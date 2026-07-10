import { useCallback, useEffect, useState } from 'react';

const PREFERRED_LANGS = ['en-US', 'en-GB'];

function pickVoice(voices) {
  for (const lang of PREFERRED_LANGS) {
    const match = voices.find((v) => v.lang === lang);
    if (match) return match;
  }
  return voices.find((v) => v.lang?.startsWith('en')) ?? null;
}

/** Bọc Web Speech API. rate mặc định chậm (0.85) cho học sinh nhỏ tuổi. */
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
    (text, { rate = 0.85, voice } = {}) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.voice = voice ?? pickVoice(voices);
      window.speechSynthesis.speak(utterance);
    },
    [supported, voices]
  );

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  return { speak, stop, voices, getVoices: () => voices, supported, hasEnglishVoice };
}
