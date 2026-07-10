import { useCallback, useEffect, useState } from 'react';

const PREFERRED_LANGS = ['en-US', 'en-GB'];
const DEFAULT_RATE = 0.85;
const RATE_KEY = 'tts.rate';
const VOICE_KEY = 'tts.voiceURI';

function pickVoice(voices, preferredVoiceURI) {
  if (preferredVoiceURI) {
    const chosen = voices.find((v) => v.voiceURI === preferredVoiceURI);
    if (chosen) return chosen;
  }
  for (const lang of PREFERRED_LANGS) {
    const match = voices.find((v) => v.lang === lang);
    if (match) return match;
  }
  return voices.find((v) => v.lang?.startsWith('en')) ?? null;
}

/** Đọc/ghi tuỳ chọn giọng đọc & tốc độ (dùng chung bởi mọi useTTS(), lưu localStorage). */
export function getTTSSettings() {
  if (typeof window === 'undefined') return { rate: DEFAULT_RATE, voiceURI: '' };
  const rate = Number(window.localStorage.getItem(RATE_KEY));
  return {
    rate: Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_RATE,
    voiceURI: window.localStorage.getItem(VOICE_KEY) ?? '',
  };
}

export function setTTSSettings({ rate, voiceURI }) {
  if (typeof window === 'undefined') return;
  if (rate !== undefined) window.localStorage.setItem(RATE_KEY, String(rate));
  if (voiceURI !== undefined) window.localStorage.setItem(VOICE_KEY, voiceURI);
}

/** Bọc Web Speech API. rate & giọng lấy từ tuỳ chọn đã lưu (Settings), mặc định rate chậm (0.85). */
export function useTTS() {
  const [voices, setVoices] = useState([]);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!supported) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, [supported]);

  const hasEnglishVoice = voices.some((v) => v.lang?.startsWith('en'));

  const speak = useCallback(
    (text, { rate, voice } = {}) => {
      if (!supported || !text) return;
      const settings = getTTSSettings();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate ?? settings.rate;
      utterance.voice = voice ?? pickVoice(voices, settings.voiceURI);
      window.speechSynthesis.speak(utterance);
    },
    [supported, voices]
  );

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  return { speak, stop, voices, getVoices: () => voices, supported, hasEnglishVoice };
}
