import { useExerciseState } from '../../hooks/useExerciseState.js';
import { ExerciseControls } from './Matching.jsx';
import AudioButton from '../ui/AudioButton.jsx';

/** Bài "dictation" — nghe & viết lại. Chỉ tương tác được ở chế độ web. */
export default function Dictation({ exercise, mode = 'web', showAnswers = false }) {
  if (mode === 'print') return <DictationPrint exercise={exercise} showAnswers={showAnswers} />;
  return <DictationWeb exercise={exercise} />;
}

function DictationWeb({ exercise }) {
  const { answers, setAnswer, checked, check, result } = useExerciseState(exercise);

  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-lg text-sky-700">{exercise.title}</h3>
      <ol className="space-y-3 list-decimal list-inside">
        {exercise.items.map((item, i) => {
          const isCorrect = checked && result.perItem[i];
          const isWrong = checked && !result.perItem[i];
          return (
            <li key={i} className="flex flex-wrap items-center gap-2">
              <AudioButton text={item.audioText} className="text-2xl" />
              <input
                type="text"
                value={answers[i] ?? ''}
                onChange={(e) => setAnswer(i, e.target.value)}
                placeholder="Gõ những gì bạn nghe được..."
                className={`border-2 rounded-xl px-3 py-1.5 text-sm w-64 outline-none transition ${
                  isCorrect
                    ? 'border-green-400 bg-green-50'
                    : isWrong
                      ? 'border-red-400 bg-red-50'
                      : 'border-slate-200 focus:border-sky-400'
                }`}
              />
              {isWrong && <span className="text-xs font-bold text-red-600">❌ Đáp án: {item.answer}</span>}
            </li>
          );
        })}
      </ol>
      <ExerciseControls checked={checked} check={check} result={result} />
    </div>
  );
}

function DictationPrint({ exercise, showAnswers }) {
  return (
    <section className="break-inside-avoid space-y-2">
      <h3 className="font-semibold">{exercise.title}</h3>
      <p className="text-xs italic text-slate-500">
        Bài nghe–viết chỉ khả dụng ở bản web (Web Speech API không phát khi in).
      </p>
      <ol className="space-y-2 list-decimal list-inside text-sm">
        {exercise.items.map((item, i) => (
          <li key={i}>
            <div className="border-b border-slate-400 h-6">
              {showAnswers && <span className="italic">{item.answer}</span>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
