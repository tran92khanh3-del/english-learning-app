import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent, getVocabulary } from '../hooks/useContent.js';

export default function Home() {
  const { units } = useContent();
  const [selectedUnit, setSelectedUnit] = useState(units[0]?.unit ?? null);
  const [page, setPage] = useState('');

  const vocabulary = useMemo(
    () => (selectedUnit == null ? [] : getVocabulary(selectedUnit, page)),
    [selectedUnit, page]
  );

  // Danh sách trang có sẵn trong unit đang chọn (để hiện dropdown lọc)
  const pages = useMemo(() => {
    if (selectedUnit == null) return [];
    const all = getVocabulary(selectedUnit);
    return [...new Set(all.map((w) => w.page).filter((p) => p !== ''))].sort(
      (a, b) => Number(a) - Number(b)
    );
  }, [selectedUnit]);

  if (units.length === 0) {
    return (
      <p className="text-slate-500">
        Chưa có nội dung. Hãy thêm file <code>.md</code> vào thư mục{' '}
        <code>content/</code>.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-2">
          Chọn Unit
        </h2>
        <div className="flex flex-wrap gap-2">
          {units.map((u) => (
            <button
              key={u.unit}
              onClick={() => {
                setSelectedUnit(u.unit);
                setPage('');
              }}
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
            <label className="text-sm font-medium text-slate-600">
              Lọc theo trang:
            </label>
            <select
              value={page}
              onChange={(e) => setPage(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white"
            >
              <option value="">Tất cả trang</option>
              {pages.map((p) => (
                <option key={p} value={p}>
                  Trang {p}
                </option>
              ))}
            </select>
            <span className="text-sm text-slate-400">
              {vocabulary.length} từ
            </span>

            <Link
              to={`/print?unit=${selectedUnit}${page ? `&page=${page}` : ''}`}
              className="ml-auto px-4 py-1.5 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"
            >
              🖨️ In danh sách
            </Link>
          </div>

          <VocabularyTable words={vocabulary} />
        </section>
      )}
    </div>
  );
}

function VocabularyTable({ words }) {
  if (words.length === 0) {
    return <p className="text-slate-500">Không có từ vựng cho lựa chọn này.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="text-left px-3 py-2 font-semibold">Từ</th>
            <th className="text-left px-3 py-2 font-semibold">Phiên âm</th>
            <th className="text-left px-3 py-2 font-semibold">Loại</th>
            <th className="text-left px-3 py-2 font-semibold">Nghĩa</th>
            <th className="text-left px-3 py-2 font-semibold">Trang</th>
            <th className="text-left px-3 py-2 font-semibold">Ví dụ</th>
          </tr>
        </thead>
        <tbody>
          {words.map((w, i) => (
            <tr key={`${w.word}-${i}`} className="border-t border-slate-100">
              <td className="px-3 py-2 font-medium text-slate-800">{w.word}</td>
              <td className="px-3 py-2 text-slate-500">{w.ipa}</td>
              <td className="px-3 py-2 text-slate-500">{w.pos}</td>
              <td className="px-3 py-2">{w.meaning_vi}</td>
              <td className="px-3 py-2 text-slate-500">{w.page}</td>
              <td className="px-3 py-2 text-slate-500 italic">{w.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
