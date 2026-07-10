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
    <div className="space-y-4">
      <h3 className="font-extrabold text-lg text-sky-700">{exercise.title}</h3>
      <ul className="space-y-2.5">
        {exercise.pairs.map(([left, right], i) => {
          const isCorrect = checked && result.perItem[i];
          const isWrong = checked && !result.perItem[i];
          return (
            <li key={left} className="flex items-center gap-3">
              <span className="w-40 font-bold inline-flex items-center gap-1.5">
                {left}
                <AudioButton text={left} />
              </span>
              <select
                value={answers[left] ?? ''}
                onChange={(e) => setAnswer(left, e.target.value)}
                className={`border-2 rounded-xl px-3 py-1.5 text-sm outline-none transition ${
                  isCorrect
                    ? 'border-green-400 bg-green-50'
                    : isWrong
                      ? 'border-red-400 bg-red-50'
                      : 'border-slate-200 focus:border-sky-400'
                }`}
              >
                <option value="">-- chọn nghĩa --</option>
                {rightOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {isWrong && <span className="text-xs font-bold text-red-600">❌ Đáp án: {right}</span>}
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
  const allCorrect = checked && result.correctCount === result.total;
  return (
    <div className="flex items-center gap-3 print:hidden">
      <button
        onClick={check}
        className="px-5 py-2 rounded-full bg-sky-500 text-white text-sm font-bold shadow-pop hover:bg-sky-600 active:translate-y-0.5 active:shadow-none transition"
      >
        ✅ Kiểm tra
      </button>
      {checked && (
        <span
          className={`text-sm font-bold px-3 py-1.5 rounded-full ${
            allCorrect ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {allCorrect ? '🎉' : '💪'} Điểm: {result.correctCount}/{result.total}
        </span>
      )}
    </div>
  );
}

export { ExerciseControls };
