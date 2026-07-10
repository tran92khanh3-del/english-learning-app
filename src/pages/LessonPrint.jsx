import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useContent, getVocabulary } from '../hooks/useContent.js';
import PrintLayout from '../components/print/PrintLayout.jsx';
import WorksheetHeader from '../components/print/WorksheetHeader.jsx';
import AnswerKey from '../components/print/AnswerKey.jsx';

/**
 * Trang in danh sách từ vựng theo unit/trang.
 * URL: /print?unit=1&page=9  (page tùy chọn).
 * Có thanh điều khiển (print:hidden) để bật/tắt đáp án và mở hộp thoại in.
 */
export default function LessonPrint() {
  const [params] = useSearchParams();
  const { units } = useContent();

  const unit = Number(params.get('unit'));
  const page = params.get('page') ?? '';
  const [showAnswers, setShowAnswers] = useState(false);

  const words = useMemo(
    () => getVocabulary(unit, page === '' ? undefined : page),
    [unit, page]
  );
  const unitTitle = units.find((u) => u.unit === unit)?.title ?? `Unit ${unit}`;
  const subtitle =
    `Từ vựng — Unit ${unit}: ${unitTitle}` + (page ? ` (trang ${page})` : '');

  return (
    <div>
      {/* Thanh điều khiển — ẩn khi in */}
      <div className="print:hidden flex flex-wrap items-center gap-3 mb-2">
        <Link to="/" className="text-sm text-sky-700 hover:underline">
          ← Về trang chủ
        </Link>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showAnswers}
            onChange={(e) => setShowAnswers(e.target.checked)}
          />
          Kèm đáp án (nghĩa tiếng Việt)
        </label>
        <button
          onClick={() => window.print()}
          className="ml-auto px-4 py-1.5 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"
        >
          🖨️ In (Ctrl+P)
        </button>
      </div>

      <PrintLayout>
        <WorksheetHeader title="PHIẾU TỪ VỰNG" subtitle={subtitle} />

        {words.length === 0 ? (
          <p className="text-sm">Không có từ vựng cho lựa chọn này.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-1.5 pr-2 w-8">#</th>
                <th className="text-left py-1.5 pr-2">Từ</th>
                <th className="text-left py-1.5 pr-2">Phiên âm</th>
                <th className="text-left py-1.5 pr-2">Loại</th>
                <th className="text-left py-1.5">Nghĩa (điền)</th>
              </tr>
            </thead>
            <tbody>
              {words.map((w, i) => (
                <tr
                  key={`${w.word}-${i}`}
                  className="border-b border-slate-300 break-inside-avoid"
                >
                  <td className="py-1.5 pr-2 align-top">{i + 1}</td>
                  <td className="py-1.5 pr-2 align-top font-semibold">
                    {w.word}
                  </td>
                  <td className="py-1.5 pr-2 align-top">{w.ipa}</td>
                  <td className="py-1.5 pr-2 align-top">{w.pos}</td>
                  <td className="py-1.5 align-top">
                    <span className="inline-block w-full border-b border-dotted border-black">
                      &nbsp;
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showAnswers && <AnswerKey words={words} />}
      </PrintLayout>
    </div>
  );
}
