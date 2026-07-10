import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent, getVocabulary, getExercises } from '../hooks/useContent.js';
import { generateMatching, generateFillBlank, generateMultipleChoice } from '../utils/exerciseGen.js';
import ExerciseRenderer from '../components/exercises/ExerciseRenderer.jsx';

/** Trang bài tập tương tác (học sinh). Chọn unit, làm bài + tự sinh thêm bài từ từ vựng. */
export default function Exercises() {
  const { units } = useContent();
  const [selectedUnit, setSelectedUnit] = useState(units[0]?.unit ?? null);
  const [includeGenerated, setIncludeGenerated] = useState(false);

  const contentExercises = useMemo(
    () => (selectedUnit == null ? [] : getExercises(selectedUnit)),
    [selectedUnit]
  );

  const generatedExercises = useMemo(() => {
    if (selectedUnit == null || !includeGenerated) return [];
    const words = getVocabulary(selectedUnit);
    return [generateMatching(words), generateFillBlank(words), generateMultipleChoice(words)].filter(
      (ex) => (ex.pairs?.length ?? ex.items?.length) > 0
    );
  }, [selectedUnit, includeGenerated]);

  const allExercises = [...contentExercises, ...generatedExercises];

  if (units.length === 0) {
    return <p className="text-slate-500">Chưa có nội dung.</p>;
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-2">Chọn Unit</h2>
        <div className="flex flex-wrap gap-2">
          {units.map((u) => (
            <button
              key={u.unit}
              onClick={() => setSelectedUnit(u.unit)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                selectedUnit === u.unit
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-sky-400'
              }`}
            >
              Unit {u.unit}: {u.title}
            </button>
          ))}
        </div>
      </section>

      {selectedUnit != null && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeGenerated}
                onChange={(e) => setIncludeGenerated(e.target.checked)}
              />
              Tự sinh thêm bài tập từ từ vựng
            </label>
            <Link
              to={`/exercises/print?unit=${selectedUnit}${includeGenerated ? '&generated=1' : ''}`}
              className="ml-auto px-4 py-1.5 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"
            >
              🖨️ In bài tập
            </Link>
          </div>

          {allExercises.length === 0 ? (
            <p className="text-slate-500">Chưa có bài tập cho unit này.</p>
          ) : (
            <div className="space-y-8">
              {allExercises.map((ex) => (
                <div key={ex.id} className="bg-white rounded-lg border border-slate-200 p-4">
                  <ExerciseRenderer exercise={ex} mode="web" />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
