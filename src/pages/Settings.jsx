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
    <div className="max-w-md space-y-6">
      <h2 className="text-lg font-semibold">Cài đặt phát âm</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-600">Giọng đọc</label>
        {englishVoices.length === 0 ? (
          <p className="text-sm text-amber-600">
            Thiết bị chưa có giọng đọc tiếng Anh (en-US/en-GB). Sẽ dùng giọng mặc định của trình duyệt nếu có.
          </p>
        ) : (
          <select
            value={voiceURI}
            onChange={(e) => updateVoice(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white"
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
        <label className="block text-sm font-medium text-slate-600">
          Tốc độ đọc: {rate.toFixed(2)}x
        </label>
        <input
          type="range"
          min="0.5"
          max="1.2"
          step="0.05"
          value={rate}
          onChange={(e) => updateRate(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={() => speak('Hello, how are you? This is a test.')}
        className="px-4 py-1.5 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"
      >
        🔊 Nghe thử
      </button>
    </div>
  );
}
