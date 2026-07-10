# PRINT_SPEC.md — Chế độ In: Yêu cầu kỹ thuật

> Tách từ CLAUDE.md Mục 7. Chỉ đọc file này khi làm việc với `components/print/` (`PrintLayout`, `WorksheetHeader`, `AnswerKey`) hoặc trang `LessonPrint.jsx`.

- Trang in theo **A4**, lề hợp lý; dùng `PrintLayout.jsx` bọc nội dung.
- **Ẩn toàn bộ UI** khi in: navbar, sidebar, nút bấm, nút loa → `print:hidden`.
- **Header phiếu bài tập** (`WorksheetHeader.jsx`): tên trường, lớp, Họ tên: ______, Ngày: ______.
- **Ngắt trang** giữa các bài tập lớn: `break-after-page` / `break-inside-avoid` (Tailwind).
- **Bật/tắt đáp án:** một prop `showAnswers`. Khi bật, render thêm `AnswerKey.jsx` ở cuối (hoặc in đáp án inline). Mặc định: **tắt** (bản cho học sinh).
- **Thân thiện in đen trắng:** không phụ thuộc màu để phân biệt đáp án.
