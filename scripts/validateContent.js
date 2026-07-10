import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

/** Kiểm tra file .md trong content/ đúng schema (docs/CONTENT_SCHEMA.md) trước khi build. */

const CONTENT_DIR = join(process.cwd(), 'content');
const VALID_META_TYPES = ['vocabulary', 'reading', 'grammar', 'exercise'];

const EXERCISE_REQUIRED_FIELDS = {
  matching: ['pairs'],
  fill_blank: ['items'],
  multiple_choice: ['items'],
  word_order: ['items'],
  dictation: ['items'],
  true_false: ['items'],
  short_answer: ['items'],
};

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (name.endsWith('.md')) files.push(full);
  }
  return files;
}

function validateFrontmatter(file, meta, errors) {
  if (!meta.unit) errors.push(`${file}: thiếu "unit" trong frontmatter`);
  if (!meta.title) errors.push(`${file}: thiếu "title" trong frontmatter`);
  if (!meta.type) {
    errors.push(`${file}: thiếu "type" trong frontmatter`);
  } else if (!VALID_META_TYPES.includes(meta.type)) {
    errors.push(`${file}: "type: ${meta.type}" không hợp lệ (chỉ ${VALID_META_TYPES.join(' | ')})`);
  }
}

function validateVocabularyTable(file, body, errors) {
  const lines = body.split('\n');
  const headerIdx = lines.findIndex((l) => l.includes('|') && /\bword\b/i.test(l));
  if (headerIdx === -1) {
    errors.push(`${file}: type=vocabulary nhưng không tìm thấy bảng markdown có cột "word"`);
    return;
  }
  const headers = lines[headerIdx]
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((h) => h.trim().toLowerCase());
  if (!headers.includes('meaning_vi')) {
    errors.push(`${file}: bảng từ vựng thiếu cột bắt buộc "meaning_vi"`);
  }
}

function validateExerciseBlocks(file, body, errors) {
  const blockRe = /```exercise\n([\s\S]*?)```/g;
  let match;
  let count = 0;
  while ((match = blockRe.exec(body)) !== null) {
    count++;
    let data;
    try {
      data = yaml.load(match[1]);
    } catch (e) {
      errors.push(`${file}: block exercise #${count} lỗi YAML — ${e.message}`);
      continue;
    }
    if (!data || !data.type) {
      errors.push(`${file}: block exercise #${count} thiếu "type"`);
      continue;
    }
    const required = EXERCISE_REQUIRED_FIELDS[data.type];
    if (!required) {
      errors.push(`${file}: block exercise #${count} có type "${data.type}" không nằm trong catalog (xem docs/EXERCISE_CATALOG.md)`);
      continue;
    }
    for (const field of required) {
      if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
        errors.push(`${file}: block exercise #${count} (type: ${data.type}) thiếu hoặc rỗng field "${field}"`);
      }
    }
  }
  if (count === 0) {
    errors.push(`${file}: type=exercise nhưng không tìm thấy block \`\`\`exercise nào`);
  }
}

function main() {
  const errors = [];
  let files;
  try {
    files = walk(CONTENT_DIR);
  } catch {
    console.error(`Không tìm thấy thư mục content/ tại ${CONTENT_DIR}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.warn('Không có file .md nào trong content/.');
  }

  for (const file of files) {
    const raw = readFileSync(file, 'utf-8');
    const { data: meta, content: body } = matter(raw);
    const relFile = file.replace(process.cwd(), '.');

    validateFrontmatter(relFile, meta, errors);

    if (meta.type === 'vocabulary') validateVocabularyTable(relFile, body, errors);
    if (meta.type === 'exercise') validateExerciseBlocks(relFile, body, errors);
  }

  if (errors.length > 0) {
    console.error(`\n✗ Tìm thấy ${errors.length} lỗi trong content/:\n`);
    errors.forEach((e) => console.error(`  - ${e}`));
    console.error('');
    process.exit(1);
  }

  console.log(`✓ Đã kiểm tra ${files.length} file trong content/ — không có lỗi.`);
}

main();
