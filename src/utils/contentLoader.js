import { parseMarkdown } from './markdownParser.js';

/**
 * Nạp toàn bộ file .md trong /content lúc BUILD (import.meta.glob eager).
 * Xem CLAUDE.md Mục 10.1 hướng A (build-time, khuyến nghị cho MVP).
 */
const rawFiles = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * @returns {Array<{ id: string, path: string } & ReturnType<typeof parseMarkdown>>}
 */
export function loadAllContent() {
  return Object.entries(rawFiles).map(([path, raw]) => {
    const parsed = parseMarkdown(raw);
    const id = path.replace('/content/', '').replace(/\.md$/, '');
    return { id, path, ...parsed };
  });
}

/** Gom nội dung theo unit → { [unit]: { unit, title, files: [...] } } */
export function loadUnits() {
  const all = loadAllContent();
  const byUnit = new Map();

  for (const doc of all) {
    const unit = doc.meta.unit ?? 0;
    if (!byUnit.has(unit)) {
      byUnit.set(unit, { unit, files: [] });
    }
    byUnit.get(unit).files.push(doc);
  }

  return [...byUnit.values()]
    .sort((a, b) => a.unit - b.unit)
    .map((u) => ({
      ...u,
      // Tiêu đề unit lấy từ file đầu tiên có title
      title: u.files.find((f) => f.meta.title)?.meta.title ?? `Unit ${u.unit}`,
    }));
}
