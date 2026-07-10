# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Trung Tâm Học & In Tiếng Anh (English Learning & Printing Hub)

> File chỉ dẫn gốc cho Claude Code. Đọc kỹ Mục 1 và Mục 2 trước khi viết bất kỳ dòng code nào.

---

## 0. Cách dùng file này (dành cho Claude Code)

- Đây là **nguồn sự thật duy nhất** về kiến trúc, quy ước và schema của dự án.
- Nếu người dùng yêu cầu điều gì mâu thuẫn với file này, **hãy hỏi lại** trước khi làm.
- Khi cần tham chiếu shape dữ liệu, xem **[docs/CONTENT_SCHEMA.md](docs/CONTENT_SCHEMA.md)** (schema `.md`) và **[docs/EXERCISE_CATALOG.md](docs/EXERCISE_CATALOG.md)** (catalog bài tập) — **không tự bịa cấu trúc mới**. Chỉ nạp doc đúng phần đang làm để tiết kiệm token.
- File này giữ **gọn** (Mục 5–7 đã tách ra `docs/`). Tránh nhồi lại chi tiết vào đây.

### Trạng thái dự án & Lệnh

- **Hiện tại: CHƯA scaffold code.** Repo mới chỉ có tài liệu (`CLAUDE.md`, `docs/`) và 4 file sách nguồn (`.pdf`, `.docx`) ở thư mục gốc. Các lệnh `npm run dev` / `npm run build` sẽ có **sau khi chạy Phase 1** (Mục 11).
- **4 file sách nguồn là nguồn thô, KHÔNG phải dữ liệu app đọc trực tiếp.** Chúng rất lớn (PDF ~1–5 MB) → **TUYỆT ĐỐI không Read cả file vào context** (đốt token). Chỉ trích từng phần nhỏ khi cần, chuyển thành `content/**/*.md` đúng schema Mục 5.
- **Kỷ luật token:** 1 phase = 1 phiên (xong thì `/clear`); chỉ nạp `docs/*.md` đúng phần đang làm; dùng 1 bộ dữ liệu mẫu `content/unit01/` xuyên suốt.

---

## 1. Tổng quan dự án

Ứng dụng web nội bộ phục vụ một giáo viên tiếng Anh và học sinh tiểu học / trung học. Deploy trên **Cloudflare Pages**. App có **hai chế độ** dùng chung một nguồn dữ liệu (`.md`):

1. **Chế độ Giáo viên (Soạn & In):**
   - Nạp các file `.md` chứa nội dung sách giáo khoa.
   - Truy vấn từ vựng theo **Unit** hoặc theo **số trang**.
   - Sinh các dạng bài tập tự động từ kho từ/câu.
   - Xuất ra giao diện **tối ưu cho in ấn** (ẩn toàn bộ UI qua `@media print`), có thể **bật/tắt đáp án**.

2. **Chế độ Học sinh (Tương tác & Nghe):**
   - Hiển thị đúng bài tập đó dưới dạng tương tác trên web.
   - Học sinh làm bài online, được **chấm điểm** ngay.
   - Bấm vào từ / câu để **nghe phát âm** (Web Speech API).

**Nguyên tắc cốt lõi:** *Một nguồn nội dung `.md` → hai đầu ra (in giấy + web tương tác).* Mọi thiết kế phải bám nguyên tắc này. Không được duplicate nội dung cho hai chế độ.

---

## 2. Nguyên tắc làm việc & quy ước code

- **Ship theo phase (xem Mục 11).** Ưu tiên bản chạy được hơn kiến trúc hoàn hảo. Không over-engineer.
- **Ngôn ngữ:** JavaScript + JSX (`.jsx`). Không bắt buộc TypeScript ở MVP; nếu thêm TS thì làm ở phase sau, không refactor giữa chừng.
- **Component nhỏ, thuần túy.** Logic tách vào `src/utils/` và `src/hooks/`. Component chỉ lo hiển thị.
- **Không hard-code nội dung bài học trong code.** Mọi nội dung đến từ `content/*.md`.
- **Tailwind cho mọi styling.** Dùng đậm các `print:` modifier để ẩn/hiện phần tử khi in.
- **Đặt tên rõ ràng, tiếng Anh cho code** (biến, hàm, file). Comment có thể tiếng Việt.
- **Trước khi thêm thư viện mới:** hỏi người dùng. Giữ dependency tối thiểu.
- **Không xóa/sửa nội dung file `.md` của người dùng.** Parser chỉ đọc.
- **Khi không chắc về schema hoặc yêu cầu:** dừng lại và hỏi, không đoán.

---

## 3. Tech Stack

| Hạng mục | Lựa chọn | Ghi chú |
|---|---|---|
| Build tool | **Vite** | Nhanh, hỗ trợ `import.meta.glob` để nạp `.md` |
| Framework | **React** | Dùng `.jsx`, functional components + hooks |
| Styling | **Tailwind CSS** | Bắt buộc dùng `print:` modifiers |
| Parse frontmatter | **gray-matter** | Đọc metadata YAML đầu file |
| Render markdown | **react-markdown** (hoặc `marked`) | Cho phần nội dung thân bài |
| Phát âm (TTS) | **Web Speech API** (`speechSynthesis`) | Native, chạy offline tùy thiết bị |
| Deploy | **Cloudflare Pages** | Build tĩnh, output `dist/` |

---

## 4. Cấu trúc thư mục (bản chuẩn — dùng cái này)

```
english-learning-app/
│
├── content/                      # Kho nội dung sách (.md) — giáo viên thả file vào đây
│   ├── unit01/
│   │   ├── unit01_vocabulary.md
│   │   ├── unit01_reading.md
│   │   └── unit01_exercises.md
│   └── unit02/
│       └── ...
│
├── docs/                         # Tài liệu tham chiếu (tách khỏi CLAUDE.md khi cần)
│   ├── CONTENT_SCHEMA.md         # (tùy chọn) chi tiết schema .md
│   └── EXERCISE_CATALOG.md       # (tùy chọn) chi tiết các dạng bài tập
│
├── public/                       # Tài nguyên tĩnh (favicon, audio offline nếu có)
│
├── scripts/
│   └── validateContent.js        # Kiểm tra file .md có đúng schema trước khi build
│
├── src/
│   ├── assets/                   # Ảnh, icon, css toàn cục
│   │
│   ├── components/
│   │   ├── layout/               # Header, Footer, Sidebar (đều print:hidden)
│   │   ├── exercises/            # Mỗi dạng bài tập 1 component
│   │   │   ├── Matching.jsx
│   │   │   ├── FillBlank.jsx
│   │   │   ├── MultipleChoice.jsx
│   │   │   ├── WordOrder.jsx
│   │   │   ├── Dictation.jsx
│   │   │   └── ExerciseRenderer.jsx   # Bộ định tuyến theo exercise.type
│   │   ├── ui/                   # Button, Input, AudioButton (nút loa)
│   │   └── print/               # Component ĐỘC QUYỀN cho in ấn
│   │       ├── PrintLayout.jsx        # Khung A4, header họ tên/lớp/ngày
│   │       ├── WorksheetHeader.jsx
│   │       └── AnswerKey.jsx          # Trang đáp án (bật/tắt)
│   │
│   ├── pages/
│   │   ├── Home.jsx              # Chọn unit / bài học
│   │   ├── TeacherView.jsx       # Soạn đề, lọc theo unit/trang, chọn dạng bài
│   │   ├── LessonWeb.jsx         # Học sinh tương tác + nghe
│   │   └── LessonPrint.jsx       # Giao diện in (Ctrl+P), ẩn menu
│   │
│   ├── hooks/
│   │   ├── useContent.js         # Nạp & cache nội dung .md đã parse
│   │   ├── useTTS.js             # Bọc Web Speech API (speak, stop, rate, voice)
│   │   └── useExerciseState.js   # Quản lý câu trả lời & chấm điểm (chế độ web)
│   │
│   ├── utils/
│   │   ├── markdownParser.js     # Đọc/parse .md → object có cấu trúc (lọc unit/trang)
│   │   ├── exerciseGen.js        # Thuật toán xào từ/câu → sinh đề tự động
│   │   ├── contentLoader.js      # import.meta.glob các file trong /content
│   │   └── scoring.js            # Logic chấm điểm cho từng dạng bài
│   │
│   ├── context/
│   │   └── AppContext.jsx        # (tùy chọn) state toàn cục: unit đang chọn, mode
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── tailwind.config.js            # Bật print variant nếu cần
├── vite.config.js
└── wrangler.toml                 # CHỈ cần nếu dùng Pages Functions (xem Mục 10)
```

**Khác biệt so với bản Gemini:** thêm `content/` chia theo unit, `docs/`, `scripts/validateContent.js`, `src/hooks/`, `src/context/`, tách rõ `components/print/` với `PrintLayout` + `AnswerKey`, thêm `ExerciseRenderer` làm bộ định tuyến, và `scoring.js`.

---

## 5. Quy ước Schema nội dung `.md` (QUAN TRỌNG NHẤT)

> Chi tiết đầy đủ (frontmatter, bảng từ vựng, block `exercise`) đã tách ra **[docs/CONTENT_SCHEMA.md](docs/CONTENT_SCHEMA.md)** để tiết kiệm token. Chỉ đọc file đó khi đụng `markdownParser.js`, `contentLoader.js`, hoặc tạo/sửa file trong `content/`.

Tóm tắt: mỗi file `.md` có **frontmatter YAML** (`unit`, `title`, `page`, `type`...). `type: vocabulary` dùng **bảng markdown** (mỗi hàng 1 từ, có cột `page` để lọc theo trang). `type: exercise` dùng **fenced block ` ```exercise `** chứa YAML (nhiều bài / 1 file). **Không tự bịa cấu trúc mới** — bám đúng doc.

---

## 6. Catalog các dạng bài tập (shape dữ liệu chuẩn)

> Bảng shape đầy đủ 7 dạng bài đã tách ra **[docs/EXERCISE_CATALOG.md](docs/EXERCISE_CATALOG.md)**. Chỉ đọc khi đụng `exerciseGen.js`, `ExerciseRenderer.jsx`, hoặc `components/exercises/`.

Tóm tắt: `ExerciseRenderer.jsx` định tuyến theo `type` (`matching`, `fill_blank`, `multiple_choice`, `word_order`, `dictation`, `true_false`, `short_answer`). Mỗi dạng có shape cố định — **không thêm/đổi field tùy tiện**. Mọi dạng phải chạy được **cả 2 chế độ** (web + in). `answer` chỉ hiện khi web đã chấm hoặc in bật "kèm đáp án".

---

## 7. Chế độ In — Yêu cầu kỹ thuật

> Chi tiết đã tách ra **[docs/PRINT_SPEC.md](docs/PRINT_SPEC.md)**. Chỉ đọc khi làm `components/print/` hoặc `LessonPrint.jsx`.

Tóm tắt: khổ **A4**, ẩn toàn bộ UI khi in (`print:hidden`), header phiếu (Họ tên/lớp/ngày), ngắt trang bằng `break-after-page` / `break-inside-avoid`, prop `showAnswers` (mặc định **tắt**), thân thiện in đen trắng.

---

## 8. Chế độ Web (Học sinh) — Tương tác & Chấm điểm

- Mỗi component bài tập nhận `mode="web"`, quản lý câu trả lời qua `useExerciseState`.
- Nút **"Kiểm tra"** → gọi `scoring.js` → hiển thị đúng/sai + điểm, tô màu phản hồi.
- Không lưu điểm lên server ở MVP (không có backend/DB). Giữ trong React state.
- Mọi từ / câu tiếng Anh đều có thể click để nghe (Mục 9).

---

## 9. Phát âm (TTS) — Web Speech API

`useTTS.js` bọc `window.speechSynthesis`:

- Hàm: `speak(text, {rate, voice})`, `stop()`, `getVoices()`.
- **Ưu tiên giọng** `en-US` hoặc `en-GB`; cho giáo viên chọn giọng trong Settings.
- **Tốc độ chậm** mặc định (rate ~0.85) vì học sinh nhỏ tuổi.
- (Tùy chọn) **highlight từ** đang đọc bằng sự kiện `onboundary`.
- **Xử lý lỗi:** danh sách giọng nạp bất đồng bộ (`onvoiceschanged`); nếu thiết bị không có giọng tiếng Anh, hiển thị thông báo nhẹ nhàng thay vì crash.
- **Lưu ý chất lượng:** giọng native khác nhau theo thiết bị/trình duyệt. Nếu sau này cần giọng đồng nhất/chất lượng cao → cân nhắc pre-generate audio (`public/audio/`) hoặc proxy cloud TTS qua Pages Functions (ngoài phạm vi MVP).

---

## 10. Nạp nội dung & Deploy

### 10.1. Nạp file `.md`

Hai hướng, chọn **A cho MVP**:

- **A. Build-time (khuyến nghị):** `contentLoader.js` dùng
  ```js
  const files = import.meta.glob('/content/**/*.md', { query: '?raw', import: 'default', eager: true });
  ```
  Nội dung được bundle lúc build, có version control. *Đổi nội dung ⇒ build & deploy lại* — hợp với quy trình giáo viên soạn theo đợt.

- **B. Runtime fetch:** đặt `.md` trong `public/content/` rồi `fetch()`. Không cần build lại khi thêm bài, nhưng mất version control và phải tự quản lý danh mục file.

### 10.2. Cloudflare Pages

- **App Vite tĩnh thuần:** *KHÔNG cần* `wrangler.toml`. Chỉ cần cấu hình trên dashboard Pages:
  - Build command: `npm run build`
  - Output directory: `dist`
- **`wrangler.toml` chỉ cần khi** dùng **Pages Functions** (ví dụ proxy API key cho cloud TTS — giống mô hình proxy anh từng làm). Khi đó thêm thư mục `functions/` và cấu hình wrangler tương ứng.

---

## 11. Lộ trình MVP (ship từng phase)

**Phase 1 — Xương sống (chạy được):**
- Scaffold Vite + React + Tailwind + routing.
- `contentLoader` + `markdownParser` đọc được 1 file từ vựng mẫu.
- `Home` liệt kê unit; hiển thị bảng từ vựng, lọc theo trang.

**Phase 2 — In ấn:**
- `PrintLayout` + `WorksheetHeader` + `print:` modifiers.
- In danh sách từ vựng theo unit/trang, có nút bật/tắt đáp án.

**Phase 3 — Bài tập:**
- Parse block `exercise`; dựng `ExerciseRenderer` + 3 dạng đầu (`matching`, `fill_blank`, `multiple_choice`) cho cả web lẫn in.
- `exerciseGen` tự sinh bài từ kho từ vựng.

**Phase 4 — Nghe & Chấm điểm:**
- `useTTS` + nút loa trên từ/câu.
- `useExerciseState` + `scoring` cho chế độ web.

**Phase 5 — Hoàn thiện:**
- Thêm dạng bài còn lại, `validateContent.js`, Settings chọn giọng/tốc độ, polish UI cho trẻ.

---

## 12. Checklist trước khi commit (cho Claude Code)

- [ ] Nội dung mới lấy từ `.md`, không hard-code.
- [ ] Component bài tập chạy đúng cả `mode="web"` và bản in.
- [ ] Phần tử UI (nút, menu, loa) đã `print:hidden`.
- [ ] Không thêm dependency lạ mà chưa hỏi.
- [ ] Shape dữ liệu khớp Mục 5 & 6, không phát sinh field mới.
- [ ] TTS xử lý được trường hợp thiếu giọng tiếng Anh.
