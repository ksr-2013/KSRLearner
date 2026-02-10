'use client';

import { useState } from 'react';
import type { PracticeCourse, Question } from '../data/practiceCourses';

interface PracticeCoursePlayerProps {
  course: PracticeCourse;
}

export default function PracticeCoursePlayer({ course }: PracticeCoursePlayerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const getScore = () => {
    let correct = 0;
    course.questions.forEach((q) => {
      const selected = answers[q.id];
      const selectedOption = q.options.find((o) => o.id === selected);
      if (selectedOption?.correct) correct += 1;
    });
    return { correct, total: course.questions.length };
  };

  const { correct, total } = getScore();

  const renderQuestion = (q: Question) => {
    const selected = answers[q.id];
    const isCorrect = q.options.find((o) => o.id === selected)?.correct;

    return (
      <div
        key={q.id}
        style={{
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          background: '#0f172a',
          border: '1px solid rgba(148, 163, 184, 0.4)',
        }}
      >
        <div style={{ marginBottom: 12, fontWeight: 600, color: '#e5e7eb' }}>{q.prompt}</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {q.options.map((opt) => {
            const isSelected = selected === opt.id;
            const showCorrect = submitted && opt.correct;
            const showWrongSelected = submitted && isSelected && !opt.correct;

            let bg = '#020617';
            let border = '1px solid rgba(148,163,184,0.4)';
            if (isSelected && !submitted) {
              bg = 'rgba(59,130,246,0.2)';
              border = '1px solid rgba(59,130,246,0.9)';
            }
            if (showCorrect) {
              bg = 'rgba(22,163,74,0.18)';
              border = '1px solid rgba(22,163,74,0.9)';
            }
            if (showWrongSelected) {
              bg = 'rgba(220,38,38,0.18)';
              border = '1px solid rgba(220,38,38,0.9)';
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(q.id, opt.id)}
                style={{
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border,
                  background: bg,
                  color: '#e5e7eb',
                  fontSize: 13,
                  cursor: submitted ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '999px',
                    border: '1px solid rgba(148,163,184,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    color: '#9ca3af',
                    background: isSelected ? 'rgba(59,130,246,0.25)' : 'transparent',
                  }}
                >
                  {opt.id.toUpperCase()}
                </span>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div style={{ marginTop: 10, fontSize: 12, color: isCorrect ? '#4ade80' : '#f97373' }}>
            {isCorrect ? '✅ Correct! ' : '❌ Not correct. '}
            <span style={{ color: '#9ca3af', display: 'block', marginTop: 4 }}>{q.explanation}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: 'rgba(15,23,42,0.9)',
        border: '1px solid rgba(148,163,184,0.4)',
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#e5e7eb' }}>{course.title}</div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{course.description}</div>
        <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 4 }}>
          Topic: {course.topic.replace('-', ' ')} · Level: {course.level}
        </div>
      </div>

      {course.questions.map(renderQuestion)}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginTop: 8,
        }}
      >
        <div style={{ fontSize: 13, color: '#e5e7eb' }}>
          Score:{' '}
          <span style={{ fontWeight: 600 }}>
            {correct} / {total}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '6px 10px',
              fontSize: 12,
              borderRadius: 6,
              border: '1px solid rgba(148,163,184,0.6)',
              background: 'transparent',
              color: '#e5e7eb',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              borderRadius: 6,
              border: 'none',
              background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
              color: '#f9fafb',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Check answers
          </button>
        </div>
      </div>
    </div>
  );
}


