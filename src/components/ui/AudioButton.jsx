import { useTTS } from '../../hooks/useTTS.js';

/** Nút loa — bấm để nghe phát âm `text`. Tự ẩn khi in. */
export default function AudioButton({ text, className = '' }) {
  const { speak, supported, hasEnglishVoice } = useTTS();

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        speak(text);
      }}
      title={hasEnglishVoice ? `Nghe: ${text}` : 'Thiết bị chưa có giọng đọc tiếng Anh'}
      className={`print:hidden inline-flex items-center justify-center text-sky-600 hover:text-sky-800 ${className}`}
    >
      🔊
    </button>
  );
}
