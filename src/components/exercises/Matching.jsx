import { useExerciseState } from '../../hooks/useExerciseState.js';
import AudioButton from '../ui/AudioButton.jsx';

/** Bài "matching" — nối từ với nghĩa. mode: "web" | "print". */
export default function Matching({ exercise, mode = 'web', showAnswers = false }) {
  if (mode === 'print') return <MatchingPrint exercise={exercise} showAnswers={showAnswers} />;
  return <MatchingWeb exercise={exercise} />;
}

function MatchingWeb({ exercise }) {
  const { answers, setAnswer, checked, check, result } = useExerciseState(exercise);
  const rightOptions = exercise.pairs.map(([, right]) => right);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{exercise.title}</h3>
      <ul className="space-y-2">
        {exercise.pairs.map(([left, right], i) => {
          const isCorrect = checked && result.perItem[i];
          const isWrong = checked && !result.perItem[i];
          return (
            <li key={left} className="flex items-center gap-3">
              <span className="w-40 font-medium inline-flex items-center gap-1.5">
                {left}
                <AudioButton text={left} />
              </span>
              <select
                value={answers[left] ?? ''}
                onChange={(e) => setAnswer(left, e.target.value)}
                className={`border rounded-md px-2 py-1 text-sm ${
                  isCorrect ? 'border-green-500 bg-green-50' : isWrong ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              >
                <option value="">-- chọn nghĩa --</option>
                {rightOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {isWrong && <span className="text-xs text-red-600">Đáp án: {right}</span>}
            </li>
          );
        })}
      </ul>
      <ExerciseControls checked={checked} check={check} result={result} />
    </div>
  );
}

function MatchingPrint({ exercise, showAnswers }) {
  const rights = exercise.pairs.map(([, right]) => right);
  return (
    <section className="break-inside-avoid space-y-2">
      <h3 className="font-semibold">{exercise.title}</h3>
      <div className="grid grid-cols-2 gap-x-8 text-sm">
        <ol className="list-decimal list-inside space-y-1">
          {exercise.pairs.map(([left]) => (
            <li key={left}>{left}</li>
          ))}
        </ol>
        <ol className="list-[lower-alpha] list-inside space-y-1">
          {rights.map((right) => (
            <li key={right}>{right}</li>
          ))}
        </ol>
      </div>
      {showAnswers && (
        <p className="text-sm italic">
          Đáp án: {exercise.pairs.map(([left, right]) => `${left}–${right}`).join(', ')}
        </p>
      )}
    </section>
  );
}

function ExerciseControls({ checked, check, result }) {
  return (
    <div className="flex items-center gap-3 print:hidden">
      <button
        onClick={check}
        className="px-4 py-1.5 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"
      >
        Kiểm tra
      </button>
      {checked && (
        <span className="text-sm font-medium text-slate-600">
          Điểm: {result.correctCount}/{result.total}
        </span>
      )}
    </div>
  );
}

export { ExerciseControls };
