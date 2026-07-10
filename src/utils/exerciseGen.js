/**
 * Tự sinh bài tập matching / fill_blank / multiple_choice từ danh sách từ vựng.
 * Xem docs/EXERCISE_CATALOG.md — shape dữ liệu phải khớp catalog, không tự thêm field.
 */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Sinh bài "matching" (từ – nghĩa) từ mảng từ vựng. */
export function generateMatching(words, { title = 'Nối từ với nghĩa', count } = {}) {
  const picked = count ? shuffle(words).slice(0, count) : words;
  return {
    id: 'gen-matching',
    type: 'matching',
    title,
    pairs: picked
      .filter((w) => w.word && w.meaning_vi)
      .map((w) => [w.word, w.meaning_vi]),
  };
}

/** Sinh bài "fill_blank" từ các từ có câu ví dụ (example) chứa chính từ đó. */
export function generateFillBlank(words, { title = 'Điền vào chỗ trống', count } = {}) {
  const candidates = words.filter((w) => w.word && w.example);
  const picked = count ? shuffle(candidates).slice(0, count) : candidates;
  return {
    id: 'gen-fill_blank',
    type: 'fill_blank',
    title,
    items: picked.map((w) => ({
      text: blankOutWord(w.example, w.word),
      answer: w.word,
    })),
  };
}

function blankOutWord(sentence, word) {
  const re = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i');
  return sentence.replace(re, '___');
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Sinh bài "multiple_choice" (chọn nghĩa đúng) từ mảng từ vựng, mỗi câu 4 lựa chọn. */
export function generateMultipleChoice(
  words,
  { title = 'Chọn nghĩa đúng', count } = {}
) {
  const candidates = words.filter((w) => w.word && w.meaning_vi);
  const picked = count ? shuffle(candidates).slice(0, count) : candidates;

  const items = picked.map((w) => {
    const wrongPool = candidates
      .filter((o) => o.word !== w.word)
      .map((o) => o.meaning_vi);
    const wrongs = shuffle([...new Set(wrongPool)]).slice(0, 3);
    const options = shuffle([w.meaning_vi, ...wrongs]);
    return {
      question: `"${w.word}" nghĩa là gì?`,
      options,
      answer: w.meaning_vi,
    };
  });

  return { id: 'gen-multiple_choice', type: 'multiple_choice', title, items };
}
