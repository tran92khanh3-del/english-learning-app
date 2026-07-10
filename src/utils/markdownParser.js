import matter from 'gray-matter';

/**
 * Đọc chuỗi markdown thô → object có cấu trúc.
 * Ở Phase 1 chỉ xử lý type "vocabulary" (bảng markdown). Các type khác
 * (reading/grammar/exercise) giữ nguyên phần body để phase sau xử lý.
 *
 * @param {string} raw - nội dung .md thô
 * @returns {{ meta: object, vocabulary: Array, body: string }}
 */
export function parseMarkdown(raw) {
  const { data: meta, content: body } = matter(raw);

  const result = { meta, vocabulary: [], body };

  if (meta.type === 'vocabulary') {
    result.vocabulary = parseVocabularyTable(body);
  }

  return result;
}

/**
 * Parse bảng markdown từ vựng thành mảng object.
 * Bảng theo schema: | word | ipa | pos | meaning_vi | page | example |
 * Header dòng đầu quyết định tên cột → map linh hoạt theo thứ tự cột người soạn.
 */
export function parseVocabularyTable(body) {
  const lines = body.split('\n');

  // Tìm dòng header của bảng (có dấu | và có chữ "word")
  const headerIdx = lines.findIndex(
    (l) => l.includes('|') && /\bword\b/i.test(l)
  );
  if (headerIdx === -1) return [];

  const headers = splitRow(lines[headerIdx]).map((h) => h.toLowerCase());

  const rows = [];
  // Dòng ngay sau header là dòng phân cách (---) → bỏ qua; đọc tiếp đến khi hết bảng.
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes('|')) break; // hết bảng
    if (/^\s*\|?[\s:|-]+\|?\s*$/.test(line)) continue; // dòng phân cách ---

    const cells = splitRow(line);
    if (cells.length === 0 || cells.every((c) => c === '')) continue;

    const entry = {};
    headers.forEach((h, idx) => {
      entry[h] = (cells[idx] ?? '').trim();
    });

    if (!entry.word) continue; // bỏ hàng thiếu từ

    // Chuẩn hoá page về number nếu có
    if (entry.page !== undefined && entry.page !== '') {
      const n = Number(entry.page);
      entry.page = Number.isNaN(n) ? entry.page : n;
    }

    rows.push(entry);
  }

  return rows;
}

/** Tách 1 dòng bảng markdown thành các ô, bỏ dấu | ở hai đầu. */
function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}
