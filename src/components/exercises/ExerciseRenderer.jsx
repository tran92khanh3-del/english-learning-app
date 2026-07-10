import Matching from './Matching.jsx';
import FillBlank from './FillBlank.jsx';
import MultipleChoice from './MultipleChoice.jsx';
import WordOrder from './WordOrder.jsx';
import Dictation from './Dictation.jsx';
import TrueFalse from './TrueFalse.jsx';
import ShortAnswer from './ShortAnswer.jsx';

const RENDERERS = {
  matching: Matching,
  fill_blank: FillBlank,
  multiple_choice: MultipleChoice,
  word_order: WordOrder,
  dictation: Dictation,
  true_false: TrueFalse,
  short_answer: ShortAnswer,
};

/**
 * Định tuyến bài tập theo exercise.type. Xem docs/EXERCISE_CATALOG.md.
 * mode: "web" (tương tác) | "print" (bản in tĩnh).
 */
export default function ExerciseRenderer({ exercise, mode = 'web', showAnswers = false }) {
  const Renderer = RENDERERS[exercise.type];
  if (!Renderer) {
    return (
      <p className="text-sm text-amber-600">
        Dạng bài "{exercise.type}" chưa được hỗ trợ ở phase này.
      </p>
    );
  }
  return <Renderer exercise={exercise} mode={mode} showAnswers={showAnswers} />;
}
