import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useContent, getVocabulary, getExercises } from '../hooks/useContent.js';
import { generateMatching, generateFillBlank, generateMultipleChoice } from '../utils/exerciseGen.js';
import ExerciseRenderer from '../components/exercises/ExerciseRenderer.jsx';
import PrintLayout from '../components/print/PrintLayout.jsx';
import WorksheetHeader from '../components/print/WorksheetHeader.jsx';

/**
 * Trang in phiếu bài tập theo unit. URL: /exercises/print?unit=1&generated=1
 * Có thanh điều khiển (print:hidden) để bật/tắt đáp án.
 */
export default function ExercisesPrint() {
  const [params] = useSearchParams();
  const { units } = useContent();

  const unit = Number(params.get('unit'));
  const includeGenerated = params.get('generated') === '1';
  const [showAnswers, setShowAnswers] = useState(false);

  const contentExercises = useMemo(() => getExercises(unit), [unit]);
  const generatedExercises = useMemo(() => {
    if (!includeGenerated) return [];
    const words = getVocabulary(unit);
    return [generateMatching(words), generateFillBlank(words), generateMultipleChoice(words)].filter(
      (ex) => (ex.pairs?.length ?? ex.items?.length) > 0
    );
  }, [unit, includeGenerated]);

  const allExercises = [...contentExercises, ...generatedExercises];
  const unitTitle = units.find((u) => u.unit === unit)?.title ?? `Unit ${unit}`;

  return (
    <div>
      <div className="print:hidden flex flex-wrap items-center gap-3 mb-2">
        <Link to="/exercises" className="text-sm text-sky-700 hover:underline">
          ← Về trang bài tập
        </Link>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showAnswers}
            onChange={(e) => setShowAnswers(e.target.checked)}
          />
          Kèm đáp án
        </label>
        <button
          onClick={() => window.print()}
          className="ml-auto px-4 py-1.5 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"
        >
          🖨️ In (Ctrl+P)
        </button>
      </div>

      <PrintLayout>
        <WorksheetHeader title="PHIẾU BÀI TẬP" subtitle={`Unit ${unit}: ${unitTitle}`} />

        {allExercises.length === 0 ? (
          <p className="text-sm">Không có bài tập cho unit này.</p>
        ) : (
          <div className="space-y-6">
            {allExercises.map((ex) => (
              <ExerciseRenderer key={ex.id} exercise={ex} mode="print" showAnswers={showAnswers} />
            ))}
          </div>
        )}
      </PrintLayout>
    </div>
  );
}
