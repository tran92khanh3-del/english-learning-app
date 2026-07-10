import { useEffect, useState } from 'react';
import { useTTS, getTTSSettings, setTTSSettings } from '../hooks/useTTS.js';

/** Cài đặt giọng đọc & tốc độ TTS — lưu localStorage, dùng chung cho mọi AudioButton. */
export default function Settings() {
  const { voices, supported, speak } = useTTS();
  const [rate, setRate] = useState(0.85);
  const [voiceURI, setVoiceURI] = useState('');

  useEffect(() => {
    const saved = getTTSSettings();
    setRate(saved.rate);
    setVoiceURI(saved.voiceURI);
  }, []);

  const englishVoices = voices.filter((v) => v.lang?.startsWith('en'));

  const updateRate = (value) => {
    setRate(value);
    setTTSSettings({ rate: value });
  };

  const updateVoice = (value) => {
    setVoiceURI(value);
    setTTSSettings({ voiceURI: value });
  };

  if (!supported) {
    return (
      <p className="text-amber-600">
        Thiết bị/trình duyệt này không hỗ trợ Web Speech API nên không có tuỳ chọn giọng đọc.
      </p>
    );
  }

  return (
    <div className="max-w-md space-y-6 bg-white rounded-2xl border-2 border-sky-100 shadow-sm p-5">
      <h2 className="text-xl font-extrabold text-sky-700">⚙️ Cài đặt phát âm</h2>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-600">🗣️ Giọng đọc</label>
        {englishVoices.length === 0 ? (
          <p className="text-sm text-amber-600">
            Thiết bị chưa có giọng đọc tiếng Anh (en-US/en-GB). Sẽ dùng giọng mặc định của trình duyệt nếu có.
          </p>
        ) : (
          <select
            value={voiceURI}
            onChange={(e) => updateVoice(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-3 py-1.5 text-sm bg-white outline-none focus:border-sky-400"
          >
            <option value="">Tự động (ưu tiên en-US / en-GB)</option>
            {englishVoices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-600">
          🐢 Tốc độ đọc: {rate.toFixed(2)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="1.2"
          step="0.05"
          value={rate}
          onChange={(e) => updateRate(Number(e.target.value))}
          className="w-full accent-sky-500"
        />
      </div>

      <button
        onClick={() => speak('Hello, how are you? This is a test.')}
        className="px-5 py-2 rounded-full bg-sky-500 text-white text-sm font-bold shadow-pop hover:bg-sky-600 active:translate-y-0.5 active:shadow-none transition"
      >
        🔊 Nghe thử
      </button>
    </div>
  );
}
