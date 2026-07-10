# CONTENT_SCHEMA.md — Quy ước Schema nội dung `.md`

> Tách từ CLAUDE.md Mục 5. Đây là **hợp đồng dữ liệu** giữa giáo viên (người soạn) và app (người đọc). Parser dựa **hoàn toàn** vào quy ước này. Chỉ đọc file này khi đụng `markdownParser.js`, `contentLoader.js`, hoặc tạo/sửa file trong `content/`.

## 1. Frontmatter (bắt buộc ở đầu mọi file)

```yaml
---
unit: 1
title: "Greetings"
page: 8                # số trang trong sách (dùng để lọc "lấy từ trang mấy")
grade: 3               # khối lớp (3, 6, 9...) — tùy chọn
level: "A1"            # CEFR: A1/A2/B1... — tùy chọn
type: "vocabulary"     # vocabulary | reading | grammar | exercise
---
```

## 2. File từ vựng (`type: vocabulary`)

Dùng **bảng markdown** để giáo viên soạn nhanh, parser đọc dễ. Mỗi hàng là một từ:

```markdown
| word     | ipa          | pos   | meaning_vi | page | example                    |
|----------|--------------|-------|------------|------|----------------------------|
| hello    | /həˈloʊ/     | excl. | xin chào   | 8    | Hello, how are you?        |
| goodbye  | /ˌɡʊdˈbaɪ/   | excl. | tạm biệt   | 8    | Goodbye, see you tomorrow. |
| friend   | /frend/      | n.    | bạn        | 9    | She is my best friend.     |
```

Quy ước cột:
- `word` (bắt buộc), `meaning_vi` (bắt buộc)
- `ipa`, `pos`, `example`, `page` (tùy chọn nhưng nên có)
- `page` ở cấp hàng cho phép lọc từ vựng theo **từng trang cụ thể**, ngay cả khi cả file cùng một unit.

## 3. File bài đọc / ngữ pháp (`type: reading` / `grammar`)

Nội dung markdown thường (đoạn văn, tiêu đề `##`, danh sách). App render trực tiếp bằng `react-markdown`. Từ nào cần nghe phát âm thì học sinh click trực tiếp trên web (không cần đánh dấu đặc biệt ở MVP).

## 4. File bài tập (`type: exercise`)

Mỗi bài tập là một **fenced code block với tag `exercise`**, bên trong là YAML. Một file chứa nhiều bài:

````markdown
```exercise
type: matching
title: "Nối từ với nghĩa"
pairs:
  - [hello, xin chào]
  - [friend, bạn]
  - [book, quyển sách]
```

```exercise
type: fill_blank
title: "Điền vào chỗ trống"
items:
  - text: "I say ___ when I meet someone."
    answer: "hello"
  - text: "A ___ is someone you like and trust."
    answer: "friend"
```
````

**Vì sao dùng fenced block `exercise` thay vì frontmatter?** Cho phép nhiều bài tập / một file, tách bạch khỏi nội dung văn xuôi, và parse an toàn (đọc block → YAML.parse).
