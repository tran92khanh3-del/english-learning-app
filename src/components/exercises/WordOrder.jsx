import { useState } from 'react';
import { useExerciseState } from '../../hooks/useExerciseState.js';
import { ExerciseControls } from './Matching.jsx';
import AudioButton from '../ui/AudioButton.jsx';

function shuffle(words) {
  const arr = [...words];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Bài "word_order" — sắp xếp từ thành câu. mode: "web" | "print". */
export default function WordOrder({ exercise, mode = 'web', showAnswers = false }) {
  if (mode === 'print') return <WordOrderPrint exercise={exercise} showAnswers={showAnswers} />;
  return <WordOrderWeb exercise={exercise} />;
}

function WordOrderWeb({ exercise }) {
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
              <WordOrderItem
                item={item}
                built={answers[i] ?? ''}
                onChange={(text) => setAnswer(i, text)}
              />
              {isCorrect && <span className="text-xs text-green-600">Đúng!</span>}
              {isWrong && <span className="text-xs text-red-600">Đáp án: {item.answer}</span>}
            </li>
          );
        })}
      </ol>
      <ExerciseControls checked={checked} check={check} result={result} />
    </div>
  );
}

function WordOrderItem({ item, built, onChange }) {
  const [pool] = useState(() => shuffle(item.words));
  const [used, setUsed] = useState([]);
  const chosen = built ? built.split(' ') : [];

  const pick = (word, poolIndex) => {
    onChange([...chosen, word].join(' ').trim());
    setUsed((prev) => [...prev, poolIndex]);
  };

  const reset = () => {
    onChange('');
    setUsed([]);
  };

  return (
    <div className="space-y-1">
      <div className="min-h-[2rem] border-b border-dashed border-slate-300 flex flex-wrap items-center gap-1.5 pb-1">
        {chosen.length === 0 && <span className="text-slate-400 text-sm">(bấm các từ bên dưới theo thứ tự)</span>}
        {chosen.length > 0 && (
          <>
            <span>{built}</span>
            <AudioButton text={built} />
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {pool.map((word, idx) => (
          <button
            key={idx}
            type="button"
            disabled={used.includes(idx)}
            onClick={() => pick(word, idx)}
            className={`px-2 py-1 rounded-md border text-sm ${
              used.includes(idx) ? 'opacity-30 border-slate-200' : 'border-slate-300 hover:border-sky-400 bg-white'
            }`}
          >
            {word}
          </button>
        ))}
        {chosen.length > 0 && (
          <button type="button" onClick={reset} className="px-2 py-1 rounded-md text-sm text-slate-500 hover:text-red-600">
            ↺ Làm lại
          </button>
        )}
      </div>
    </div>
  );
}

function WordOrderPrint({ exercise, showAnswers }) {
  return (
    <section className="break-inside-avoid space-y-3">
      <h3 className="font-semibold">{exercise.title}</h3>
      <ol className="space-y-3 list-decimal list-inside text-sm">
        {exercise.items.map((item, i) => (
          <li key={i} className="break-inside-avoid">
            <div>{shuffle(item.words).join(' / ')}</div>
            <div className="border-b border-slate-400 h-6 mt-1">
              {showAnswers && <span className="italic">{item.answer}</span>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
