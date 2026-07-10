/**
 * Chấm điểm bài tập theo type. Shape `answers` theo từng dạng:
 * - matching: { [left]: rightGuess }
 * - fill_blank: string[] (index-aligned với items)
 * - multiple_choice: string[] (index-aligned với items, giá trị = option đã chọn)
 * - word_order: string[] (index-aligned với items, câu HS đã ghép)
 * - dictation: string[] (index-aligned với items, HS gõ lại)
 * - true_false: string[] (index-aligned với items, "true" | "false")
 * - short_answer: string[] (index-aligned với items)
 *
 * @returns {{ total: number, correctCount: number, perItem: boolean[] }}
 */
export function scoreExercise(exercise, answers) {
  switch (exercise.type) {
    case 'matching':
      return scoreMatching(exercise, answers);
    case 'fill_blank':
      return scoreFillBlank(exercise, answers);
    case 'multiple_choice':
      return scoreMultipleChoice(exercise, answers);
    case 'word_order':
      return scoreItemsField(exercise, answers, 'answer');
    case 'dictation':
      return scoreItemsField(exercise, answers, 'answer');
    case 'true_false':
      return scoreTrueFalse(exercise, answers);
    case 'short_answer':
      return scoreItemsField(exercise, answers, 'answer');
    default:
      throw new Error(`Không hỗ trợ chấm điểm dạng "${exercise.type}"`);
  }
}

function normalize(str) {
  return String(str ?? '').trim().toLowerCase();
}

function scoreMatching(exercise, answers = {}) {
  const perItem = exercise.pairs.map(([left, right]) => normalize(answers[left]) === normalize(right));
  return summarize(perItem);
}

function scoreFillBlank(exercise, answers = []) {
  const perItem = exercise.items.map((item, i) => normalize(answers[i]) === normalize(item.answer));
  return summarize(perItem);
}

function scoreMultipleChoice(exercise, answers = []) {
  const perItem = exercise.items.map((item, i) => normalize(answers[i]) === normalize(item.answer));
  return summarize(perItem);
}

function scoreItemsField(exercise, answers = [], field) {
  const perItem = exercise.items.map((item, i) => normalize(answers[i]) === normalize(item[field]));
  return summarize(perItem);
}

function scoreTrueFalse(exercise, answers = []) {
  const perItem = exercise.items.map((item, i) => normalize(answers[i]) === normalize(item.answer));
  return summarize(perItem);
}

function summarize(perItem) {
  return {
    total: perItem.length,
    correctCount: perItem.filter(Boolean).length,
    perItem,
  };
}
