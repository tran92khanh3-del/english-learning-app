# EXERCISE_CATALOG.md — Catalog các dạng bài tập

> Tách từ CLAUDE.md Mục 6. Shape dữ liệu chuẩn cho từng dạng bài. Chỉ đọc file này khi đụng `exerciseGen.js`, `ExerciseRenderer.jsx`, hoặc các component trong `components/exercises/`.

`ExerciseRenderer.jsx` định tuyến theo `type`. Mỗi dạng có shape cố định — **không thêm/đổi field tùy tiện**.

| `type` | Ý nghĩa | Field dữ liệu | Web (học sinh làm) | In (giấy) |
|---|---|---|---|---|
| `matching` | Nối từ–nghĩa | `pairs: [[a,b],...]` | Kéo–thả hoặc chọn cặp | 2 cột, kẻ đường nối |
| `fill_blank` | Điền chỗ trống | `items: [{text, answer}]` | Ô input, chấm điểm | Chừa khoảng `_____` |
| `multiple_choice` | Trắc nghiệm | `items: [{question, options[], answer}]` | Chọn 1, chấm điểm | A/B/C/D |
| `word_order` | Sắp xếp thành câu | `items: [{words[], answer}]` | Kéo–thả các từ | Các từ xáo trộn |
| `dictation` | Nghe–viết | `items: [{audioText, answer}]` | TTS đọc → HS gõ | (chỉ web / hoặc in mã QR nghe) |
| `true_false` | Đúng/Sai | `items: [{statement, answer}]` | Chọn T/F | ☐ T ☐ F |
| `short_answer` | Trả lời ngắn | `items: [{question, answer}]` | Textarea | Dòng kẻ trống |

**Quy tắc chung:**
- Mọi dạng phải xử lý được **cả 2 chế độ** (web tương tác + in tĩnh).
- Field `answer` chỉ hiển thị khi: (a) chế độ web đã chấm xong, hoặc (b) chế độ in bật "kèm đáp án".
- `exerciseGen.js` có thể **tự sinh** `matching` / `fill_blank` / `multiple_choice` từ danh sách từ vựng (xem `CONTENT_SCHEMA.md` mục 2) mà không cần giáo viên soạn tay.
