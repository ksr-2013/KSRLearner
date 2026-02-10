'use client';

import React, { useState } from 'react';
import PracticeCoursePlayer from '../../components/PracticeCoursePlayer';
import { PRACTICE_COURSES, type PracticeCourse } from '../../data/practiceCourses';

const TOPIC_LABELS: Record<PracticeCourse['topic'], string> = {
  'computer-basics': 'Computer Basics',
  'computer-science': 'Computer Science',
  shortcuts: 'Keyboard Shortcuts',
  'operating-systems': 'Operating Systems',
};

export default function ComputerPracticePage() {
  const [selectedId, setSelectedId] = useState<string>(PRACTICE_COURSES[0]?.id);

  const selectedCourse = PRACTICE_COURSES.find((c) => c.id === selectedId) ?? PRACTICE_COURSES[0];

  const groupedByTopic = PRACTICE_COURSES.reduce<Record<string, PracticeCourse[]>>((acc, course) => {
    if (!acc[course.topic]) acc[course.topic] = [];
    acc[course.topic].push(course);
    return acc;
  }, {});

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top,#0f172a,#020617)',
        color: '#e5e7eb',
        padding: '24px 16px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <header style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Computer Practice Courses (100)</h1>
          <p style={{ fontSize: 13, color: '#9ca3af' }}>
            Practice computer basics, computer science, keyboard shortcuts, and operating systems with simple
            multiple‑choice questions. Choose a course on the left, then answer and check your results.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 340px) minmax(0, 1fr)',
            gap: 16,
          }}
        >
          {/* Course list */}
          <div
            style={{
              borderRadius: 12,
              background: 'rgba(15,23,42,0.9)',
              border: '1px solid rgba(148,163,184,0.4)',
              padding: 12,
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
            }}
          >
            {Object.entries(groupedByTopic).map(([topic, courses]) => (
              <div key={topic} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#60a5fa',
                    textTransform: 'uppercase',
                    letterSpacing: 0.04,
                    marginBottom: 6,
                  }}
                >
                  {TOPIC_LABELS[topic as PracticeCourse['topic']] ?? topic}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {courses.map((course) => {
                    const isActive = course.id === selectedCourse.id;
                    return (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => setSelectedId(course.id)}
                        style={{
                          textAlign: 'left',
                          padding: '6px 8px',
                          borderRadius: 8,
                          border: 'none',
                          background: isActive ? 'rgba(59,130,246,0.25)' : 'transparent',
                          color: '#e5e7eb',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          fontSize: 12,
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{course.title}</span>
                        <span style={{ color: '#9ca3af' }}>{course.level === 'beginner' ? 'Beginner' : 'Intermediate'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Active course player */}
          <PracticeCoursePlayer course={selectedCourse} />
        </div>
      </div>
    </div>
  );
}


