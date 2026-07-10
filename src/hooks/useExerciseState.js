import { useMemo, useState } from 'react';
import { scoreExercise } from '../utils/scoring.js';

/**
 * Quản lý câu trả lời & chấm điểm cho 1 bài tập (chế độ web).
 * Shape `answers` tuỳ theo exercise.type — xem scoring.js.
 */
export function useExerciseState(exercise) {
  const [answers, setAnswers] = useState(exercise.type === 'matching' ? {} : []);
  const [checked, setChecked] = useState(false);

  const setAnswer = (key, value) => {
    setChecked(false);
    setAnswers((prev) => {
      if (exercise.type === 'matching') {
        return { ...prev, [key]: value };
      }
      const next = [...prev];
      next[key] = value;
      return next;
    });
  };

  const result = useMemo(
    () => (checked ? scoreExercise(exercise, answers) : null),
    [checked, exercise, answers]
  );

  const check = () => setChecked(true);
  const reset = () => {
    setAnswers(exercise.type === 'matching' ? {} : []);
    setChecked(false);
  };

  return { answers, setAnswer, checked, check, reset, result };
}
