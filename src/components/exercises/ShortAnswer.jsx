import { useExerciseState } from '../../hooks/useExerciseState.js';
import { ExerciseControls } from './Matching.jsx';
import AudioButton from '../ui/AudioButton.jsx';

/** Bài "short_answer" — trả lời ngắn. mode: "web" | "print". */
export default function ShortAnswer({ exercise, mode = 'web', showAnswers = false }) {
  if (mode === 'print') return <ShortAnswerPrint exercise={exercise} showAnswers={showAnswers} />;
  return <ShortAnswerWeb exercise={exercise} />;
}

function ShortAnswerWeb({ exercise }) {
  const { answers, setAnswer, checked, check, result } = useExerciseState(exercise);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{exercise.title}</h3>
      <ol className="space-y-3 list-decimal list-inside">
        {exercise.items.map((item, i) => {
          const isCorrect = checked && result.perItem[i];
          const isWrong = checked && !result.perItem[i];
          return (
            <li key={i} className="space-y-1">
              <div className="inline-flex items-center gap-1.5">
                {item.question}
                <AudioButton text={item.question} />
              </div>
              <textarea
                value={answers[i] ?? ''}
                onChange={(e) => setAnswer(i, e.target.value)}
                rows={2}
                className={`block w-full border rounded-md px-2 py-1 text-sm ${
                  isCorrect ? 'border-green-500 bg-green-50' : isWrong ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
              {isWrong && <span className="text-xs text-red-600">Gợi ý đáp án: {item.answer}</span>}
            </li>
          );
        })}
      </ol>
      <ExerciseControls checked={checked} check={check} result={result} />
    </div>
  );
}

function ShortAnswerPrint({ exercise, showAnswers }) {
  return (
    <section className="break-inside-avoid space-y-3">
      <h3 className="font-semibold">{exercise.title}</h3>
      <ol className="space-y-3 list-decimal list-inside text-sm">
        {exercise.items.map((item, i) => (
          <li key={i} className="break-inside-avoid">
            <div>{item.question}</div>
            <div className="border-b border-slate-400 h-6 mt-1">
              {showAnswers && <span className="italic">{item.answer}</span>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
