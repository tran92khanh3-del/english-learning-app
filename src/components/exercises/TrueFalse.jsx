import { useExerciseState } from '../../hooks/useExerciseState.js';
import { ExerciseControls } from './Matching.jsx';
import AudioButton from '../ui/AudioButton.jsx';

/** Bài "true_false" — chọn Đúng/Sai. mode: "web" | "print". */
export default function TrueFalse({ exercise, mode = 'web', showAnswers = false }) {
  if (mode === 'print') return <TrueFalsePrint exercise={exercise} showAnswers={showAnswers} />;
  return <TrueFalseWeb exercise={exercise} />;
}

function TrueFalseWeb({ exercise }) {
  const { answers, setAnswer, checked, check, result } = useExerciseState(exercise);

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-lg text-sky-700">{exercise.title}</h3>
      <ol className="space-y-3 list-decimal list-inside">
        {exercise.items.map((item, i) => {
          const isCorrect = checked && result.perItem[i];
          const isWrong = checked && !result.perItem[i];
          return (
            <li key={i} className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-medium">
                {item.statement}
                <AudioButton text={item.statement} />
              </span>
              {['true', 'false'].map((val) => {
                const picked = answers[i] === val;
                return (
                  <label
                    key={val}
                    className={`flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full border-2 cursor-pointer transition ${
                      picked ? 'bg-sky-500 text-white border-sky-500' : 'bg-white border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${exercise.id}-${i}`}
                      checked={picked}
                      onChange={() => setAnswer(i, val)}
                      className="hidden"
                    />
                    {val === 'true' ? '✅ Đúng' : '❌ Sai'}
                  </label>
                );
              })}
              {isWrong && (
                <span className="text-xs font-bold text-red-600">
                  Đáp án: {item.answer ? 'Đúng' : 'Sai'}
                </span>
              )}
              {isCorrect && <span className="text-xs font-bold text-green-600">🎉 Đúng!</span>}
            </li>
          );
        })}
      </ol>
      <ExerciseControls checked={checked} check={check} result={result} />
    </div>
  );
}

function TrueFalsePrint({ exercise, showAnswers }) {
  return (
    <section className="break-inside-avoid space-y-2">
      <h3 className="font-semibold">{exercise.title}</h3>
      <ol className="space-y-2 list-decimal list-inside text-sm">
        {exercise.items.map((item, i) => (
          <li key={i} className="flex items-center gap-4">
            <span>{item.statement}</span>
            <span>
              {showAnswers ? (item.answer ? '☑ Đúng   ☐ Sai' : '☐ Đúng   ☑ Sai') : '☐ Đúng   ☐ Sai'}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
