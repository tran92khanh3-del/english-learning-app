import { useExerciseState } from '../../hooks/useExerciseState.js';
import { ExerciseControls } from './Matching.jsx';
import AudioButton from '../ui/AudioButton.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Bài "multiple_choice" — trắc nghiệm. mode: "web" | "print". */
export default function MultipleChoice({ exercise, mode = 'web', showAnswers = false }) {
  if (mode === 'print') return <MultipleChoicePrint exercise={exercise} showAnswers={showAnswers} />;
  return <MultipleChoiceWeb exercise={exercise} />;
}

function MultipleChoiceWeb({ exercise }) {
  const { answers, setAnswer, checked, check, result } = useExerciseState(exercise);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{exercise.title}</h3>
      <ol className="space-y-3 list-decimal list-inside">
        {exercise.items.map((item, i) => {
          const isCorrect = checked && result.perItem[i];
          const isWrong = checked && !result.perItem[i];
          return (
            <li key={i}>
              <div className="inline-flex items-center gap-1.5">
                {item.question}
                <AudioButton text={item.question} />
              </div>
              <div className="flex flex-wrap gap-3 mt-1 ml-4">
                {item.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name={`${exercise.id}-${i}`}
                      checked={answers[i] === opt}
                      onChange={() => setAnswer(i, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {isCorrect && <span className="text-xs text-green-600 ml-4">Đúng!</span>}
              {isWrong && <span className="text-xs text-red-600 ml-4">Đáp án: {item.answer}</span>}
            </li>
          );
        })}
      </ol>
      <ExerciseControls checked={checked} check={check} result={result} />
    </div>
  );
}

function MultipleChoicePrint({ exercise, showAnswers }) {
  return (
    <section className="break-inside-avoid space-y-2">
      <h3 className="font-semibold">{exercise.title}</h3>
      <ol className="space-y-2 list-decimal list-inside text-sm">
        {exercise.items.map((item, i) => (
          <li key={i} className="break-inside-avoid">
            <div>{item.question}</div>
            <div className="flex flex-wrap gap-4 ml-4">
              {item.options.map((opt, j) => (
                <span key={opt}>
                  {showAnswers && opt === item.answer ? (
                    <strong>
                      {LETTERS[j]}. {opt} ✓
                    </strong>
                  ) : (
                    `${LETTERS[j]}. ${opt}`
                  )}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
