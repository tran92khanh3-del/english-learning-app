/**
 * Trang đáp án cho bản in. Chỉ render khi showAnswers = true.
 * Với danh sách từ vựng: liệt kê từ → nghĩa để giáo viên đối chiếu.
 * Đặt ở cuối phiếu, ngắt sang trang mới (break-before-page).
 */
export default function AnswerKey({ words }) {
  if (!words || words.length === 0) return null;

  return (
    <section className="break-before-page pt-4">
      <h2 className="text-lg font-bold border-b border-black pb-1 mb-3">
        ĐÁP ÁN
      </h2>
      <ol className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm list-decimal list-inside">
        {words.map((w, i) => (
          <li key={`${w.word}-${i}`} className="break-inside-avoid">
            <span className="font-semibold">{w.word}</span>
            {' — '}
            {w.meaning_vi}
          </li>
        ))}
      </ol>
    </section>
  );
}
