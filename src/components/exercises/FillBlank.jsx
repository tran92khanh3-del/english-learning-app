import { useExerciseState } from '../../hooks/useExerciseState.js';
import { ExerciseControls } from './Matching.jsx';
import AudioButton from '../ui/AudioButton.jsx';

/** Bài "fill_blank" — điền vào chỗ trống. mode: "web" | "print". */
export default function FillBlank({ exercise, mode = 'web', showAnswers = false }) {
  if (mode === 'print') return <FillBlankPrint exercise={exercise} showAnswers={showAnswers} />;
  return <FillBlankWeb exercise={exercise} />;
}

function FillBlankWeb({ exercise }) {
  const { answers, setAnswer, checked, check, result } = useExerciseState(exercise);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{exercise.title}</h3>
      <ol className="space-y-2 list-decimal list-inside">
        {exercise.items.map((item, i) => {
          const isCorrect = checked && result.perItem[i];
          const isWrong = checked && !result.perItem[i];
          return (
            <li key={i} className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5">
                {item.text}
                <AudioButton text={item.text.replace('___', item.answer)} />
              </span>
              <input
                type="text"
                value={answers[i] ?? ''}
                onChange={(e) => setAnswer(i, e.target.value)}
                className={`border rounded-md px-2 py-1 text-sm w-32 ${
                  isCorrect ? 'border-green-500 bg-green-50' : isWrong ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
              {isWrong && <span className="text-xs text-red-600">Đáp án: {item.answer}</span>}
            </li>
          );
        })}
      </ol>
      <ExerciseControls checked={checked} check={check} result={result} />
    </div>
  );
}

function FillBlankPrint({ exercise, showAnswers }) {
  return (
    <section className="break-inside-avoid space-y-2">
      <h3 className="font-semibold">{exercise.title}</h3>
      <ol className="space-y-2 list-decimal list-inside text-sm">
        {exercise.items.map((item, i) => (
          <li key={i}>
            {item.text.replace('___', showAnswers ? `[${item.answer}]` : '_____')}
          </li>
        ))}
      </ol>
    </section>
  );
}
