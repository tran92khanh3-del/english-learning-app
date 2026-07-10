/**
 * Header phiếu bài tập cho bản in: tên trường, tiêu đề, và các ô Họ tên/Lớp/Ngày
 * để học sinh điền tay. In đen trắng, không phụ thuộc màu.
 */
export default function WorksheetHeader({ school = 'TRUNG TÂM TIẾNG ANH', title, subtitle }) {
  return (
    <header className="mb-4 border-b-2 border-black pb-3">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide">{school}</p>
        {title && <h1 className="text-xl font-bold mt-1">{title}</h1>}
        {subtitle && <p className="text-sm mt-0.5">{subtitle}</p>}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm">
        <span className="flex-1 min-w-[45%]">
          Họ và tên: <span className="inline-block border-b border-dotted border-black flex-1 min-w-[140px]">&nbsp;</span>
        </span>
        <span>
          Lớp: <span className="inline-block border-b border-dotted border-black min-w-[70px]">&nbsp;</span>
        </span>
        <span>
          Ngày: <span className="inline-block border-b border-dotted border-black min-w-[90px]">&nbsp;</span>
        </span>
      </div>
    </header>
  );
}
