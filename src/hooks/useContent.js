import { useMemo } from 'react';
import { loadUnits, loadAllContent } from '../utils/contentLoader.js';

/**
 * Nạp & cache (qua useMemo) nội dung .md đã parse.
 * Vì import.meta.glob eager → dữ liệu sẵn có lúc build, chỉ cần memo hoá.
 */
export function useContent() {
  const units = useMemo(() => loadUnits(), []);
  const all = useMemo(() => loadAllContent(), []);
  return { units, all };
}

/** Trả về mảng từ vựng của 1 unit, tuỳ chọn lọc theo số trang. */
export function getVocabulary(unit, page) {
  const all = loadAllContent();
  const words = all
    .filter((d) => d.meta.type === 'vocabulary' && (d.meta.unit ?? 0) === unit)
    .flatMap((d) => d.vocabulary);

  if (page === undefined || page === '' || page === null) return words;
  return words.filter((w) => String(w.page) === String(page));
}
