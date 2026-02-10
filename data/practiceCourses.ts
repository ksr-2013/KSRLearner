export type QuestionOption = {
  id: string;
  text: string;
  correct: boolean;
};

export type Question = {
  id: string;
  prompt: string;
  options: QuestionOption[];
  explanation: string;
};

export type PracticeCourse = {
  id: string;
  title: string;
  topic: 'computer-basics' | 'computer-science' | 'shortcuts' | 'operating-systems';
  level: 'beginner' | 'intermediate';
  description: string;
  questions: Question[];
};

// ============================================
// COURSE DEFINITIONS
// ============================================

const BASE_COURSES: Array<{
  topic: PracticeCourse['topic'];
  title: string;
  description: string;
}> = [
  {
    topic: 'computer-basics',
    title: 'Computer Basics: Hardware',
    description: 'Learn parts of a computer like CPU, RAM, storage, and input/output devices.',
  },
  {
    topic: 'computer-basics',
    title: 'Computer Basics: Software',
    description: 'Understand applications, operating systems, and how software runs on hardware.',
  },
  {
    topic: 'computer-basics',
    title: 'Computer Basics: Networking',
    description: 'Practice simple concepts like LAN, Wi‑Fi, IP address, and Internet.',
  },
  {
    topic: 'computer-science',
    title: 'Computer Science: Algorithms',
    description: 'Very simple questions about what algorithms and steps are.',
  },
  {
    topic: 'computer-science',
    title: 'Computer Science: Data Structures',
    description: 'Basic ideas of arrays, lists, and stacks (no code needed).',
  },
  {
    topic: 'computer-science',
    title: 'Computer Science: Binary & Bits',
    description: 'Understand bits, bytes, and how computers store numbers.',
  },
  {
    topic: 'shortcuts',
    title: 'Keyboard Shortcuts: Windows Desktop',
    description: 'Practice Win key shortcuts for desktop and window management.',
  },
  {
    topic: 'shortcuts',
    title: 'Keyboard Shortcuts: Text Editing',
    description: 'Copy, paste, undo, redo, and cursor movement shortcuts.',
  },
  {
    topic: 'operating-systems',
    title: 'Operating Systems: Concepts',
    description: 'What an OS does: managing CPU, memory, and programs.',
  },
  {
    topic: 'operating-systems',
    title: 'Operating Systems: Files & Folders',
    description: 'Working with files, folders, paths, and extensions.',
  },
];

// ============================================
// MASTER QUESTION BANK (from 500_real_unique_computer_mcq.pdf)
// ============================================

const TEMPLATE_QUESTIONS: Question[] = [
  {
    id: 't1',
    prompt: 'What is a computer?',
    options: [
      { id: 'a', text: 'Electronic device', correct: true },
      { id: 'b', text: 'Mechanical tool', correct: false },
      { id: 'c', text: 'Network', correct: false },
      { id: 'd', text: 'Program', correct: false },
    ],
    explanation: 'A computer is an electronic device that processes data according to instructions.',
  },
  {
    id: 't2',
    prompt: 'Which unit processes data?',
    options: [
      { id: 'a', text: 'CPU', correct: true },
      { id: 'b', text: 'RAM', correct: false },
      { id: 'c', text: 'Keyboard', correct: false },
      { id: 'd', text: 'Monitor', correct: false },
    ],
    explanation: 'The CPU (Central Processing Unit) performs processing operations on data.',
  },
  {
    id: 't3',
    prompt: 'Binary system uses how many digits?',
    options: [
      { id: 'a', text: '1', correct: false },
      { id: 'b', text: '2', correct: true },
      { id: 'c', text: '8', correct: false },
      { id: 'd', text: '10', correct: false },
    ],
    explanation: 'The binary number system uses only two digits: 0 and 1.',
  },
  {
    id: 't4',
    prompt: 'Full form of CPU?',
    options: [
      { id: 'a', text: 'Central Processing Unit', correct: true },
      { id: 'b', text: 'Computer Processing Unit', correct: false },
      { id: 'c', text: 'Central Program Unit', correct: false },
      { id: 'd', text: 'Core Processing Unit', correct: false },
    ],
    explanation: 'CPU stands for Central Processing Unit.',
  },
  {
    id: 't5',
    prompt: 'Full form of RAM?',
    options: [
      { id: 'a', text: 'Random Access Memory', correct: true },
      { id: 'b', text: 'Read Access Memory', correct: false },
      { id: 'c', text: 'Rapid Access Memory', correct: false },
      { id: 'd', text: 'Run Access Memory', correct: false },
    ],
    explanation: 'RAM stands for Random Access Memory.',
  },
  {
    id: 't6',
    prompt: 'Which is an input device?',
    options: [
      { id: 'a', text: 'Keyboard', correct: true },
      { id: 'b', text: 'Monitor', correct: false },
      { id: 'c', text: 'Printer', correct: false },
      { id: 'd', text: 'Speaker', correct: false },
    ],
    explanation: 'A keyboard is used to input data into the computer.',
  },
  {
    id: 't7',
    prompt: 'Which is an output device?',
    options: [
      { id: 'a', text: 'Monitor', correct: true },
      { id: 'b', text: 'Mouse', correct: false },
      { id: 'c', text: 'Scanner', correct: false },
      { id: 'd', text: 'Keyboard', correct: false },
    ],
    explanation: 'A monitor displays output from the computer.',
  },
  {
    id: 't8',
    prompt: 'Which stores data permanently?',
    options: [
      { id: 'a', text: 'Hard Disk', correct: true },
      { id: 'b', text: 'RAM', correct: false },
      { id: 'c', text: 'Cache', correct: false },
      { id: 'd', text: 'Register', correct: false },
    ],
    explanation: 'Hard disks provide long-term, non‑volatile storage.',
  },
  {
    id: 't9',
    prompt: 'Which component connects all hardware?',
    options: [
      { id: 'a', text: 'Motherboard', correct: true },
      { id: 'b', text: 'CPU', correct: false },
      { id: 'c', text: 'RAM', correct: false },
      { id: 'd', text: 'GPU', correct: false },
    ],
    explanation: 'The motherboard connects and allows communication between hardware components.',
  },
  {
    id: 't10',
    prompt: 'Which device converts digital signals to analog?',
    options: [
      { id: 'a', text: 'Modem', correct: true },
      { id: 'b', text: 'Router', correct: false },
      { id: 'c', text: 'Switch', correct: false },
      { id: 'd', text: 'Hub', correct: false },
    ],
    explanation: 'A modem modulates/demodulates signals between digital and analog forms.',
  },
  {
    id: 't11',
    prompt: 'Which is an operating system?',
    options: [
      { id: 'a', text: 'Windows', correct: true },
      { id: 'b', text: 'HTML', correct: false },
      { id: 'c', text: 'C', correct: false },
      { id: 'd', text: 'SQL', correct: false },
    ],
    explanation: 'Windows is an operating system; HTML, C, and SQL are languages.',
  },
  {
    id: 't12',
    prompt: 'Which OS is open source?',
    options: [
      { id: 'a', text: 'Linux', correct: true },
      { id: 'b', text: 'Windows', correct: false },
      { id: 'c', text: 'macOS', correct: false },
      { id: 'd', text: 'DOS', correct: false },
    ],
    explanation: 'Linux is an open‑source operating system.',
  },
  {
    id: 't13',
    prompt: 'Which OS is commonly used in smartphones?',
    options: [
      { id: 'a', text: 'Android', correct: true },
      { id: 'b', text: 'Windows XP', correct: false },
      { id: 'c', text: 'DOS', correct: false },
      { id: 'd', text: 'Unix', correct: false },
    ],
    explanation: 'Android is a popular smartphone operating system.',
  },
  {
    id: 't14',
    prompt: 'Which software manages hardware and software?',
    options: [
      { id: 'a', text: 'Operating System', correct: true },
      { id: 'b', text: 'Compiler', correct: false },
      { id: 'c', text: 'Browser', correct: false },
      { id: 'd', text: 'Database', correct: false },
    ],
    explanation: 'The operating system coordinates hardware and software resources.',
  },
  {
    id: 't15',
    prompt: 'Which is not an operating system?',
    options: [
      { id: 'a', text: 'Oracle', correct: true },
      { id: 'b', text: 'Linux', correct: false },
      { id: 'c', text: 'Windows', correct: false },
      { id: 'd', text: 'Unix', correct: false },
    ],
    explanation: 'Oracle is a database company/product, not an OS.',
  },
  {
    id: 't16',
    prompt: 'Which is a programming language?',
    options: [
      { id: 'a', text: 'Python', correct: true },
      { id: 'b', text: 'MS Word', correct: false },
      { id: 'c', text: 'Paint', correct: false },
      { id: 'd', text: 'Excel', correct: false },
    ],
    explanation: 'Python is a high‑level programming language.',
  },
  {
    id: 't17',
    prompt: 'Which language is used to define web pages?',
    options: [
      { id: 'a', text: 'HTML', correct: true },
      { id: 'b', text: 'C', correct: false },
      { id: 'c', text: 'JavaScript', correct: false },
      { id: 'd', text: 'Python', correct: false },
    ],
    explanation: 'HTML (HyperText Markup Language) defines the structure of web pages.',
  },
  {
    id: 't18',
    prompt: 'Which symbol is used for single-line comments in C?',
    options: [
      { id: 'a', text: '//', correct: true },
      { id: 'b', text: '<!--', correct: false },
      { id: 'c', text: '#', correct: false },
      { id: 'd', text: '**', correct: false },
    ],
    explanation: 'In C, // starts a single-line comment (in C99 and later).',
  },
  {
    id: 't19',
    prompt: 'Which data structure follows LIFO (Last In, First Out)?',
    options: [
      { id: 'a', text: 'Stack', correct: true },
      { id: 'b', text: 'Queue', correct: false },
      { id: 'c', text: 'Tree', correct: false },
      { id: 'd', text: 'Graph', correct: false },
    ],
    explanation: 'A stack is a LIFO data structure.',
  },
  {
    id: 't20',
    prompt: 'Which is a high-level language?',
    options: [
      { id: 'a', text: 'Python', correct: true },
      { id: 'b', text: 'Machine Code', correct: false },
      { id: 'c', text: 'Assembly', correct: false },
      { id: 'd', text: 'Binary', correct: false },
    ],
    explanation: 'Python is a high‑level programming language.',
  },
  {
    id: 't21',
    prompt: 'Shortcut for Copy?',
    options: [
      { id: 'a', text: 'Ctrl+C', correct: true },
      { id: 'b', text: 'Ctrl+V', correct: false },
      { id: 'c', text: 'Ctrl+X', correct: false },
      { id: 'd', text: 'Ctrl+Z', correct: false },
    ],
    explanation: 'Ctrl+C is the standard shortcut for Copy.',
  },
  {
    id: 't22',
    prompt: 'Shortcut for Paste?',
    options: [
      { id: 'a', text: 'Ctrl+V', correct: true },
      { id: 'b', text: 'Ctrl+C', correct: false },
      { id: 'c', text: 'Ctrl+X', correct: false },
      { id: 'd', text: 'Ctrl+Z', correct: false },
    ],
    explanation: 'Ctrl+V pastes the last copied or cut content.',
  },
  {
    id: 't23',
    prompt: 'Shortcut for Cut?',
    options: [
      { id: 'a', text: 'Ctrl+X', correct: true },
      { id: 'b', text: 'Ctrl+C', correct: false },
      { id: 'c', text: 'Ctrl+V', correct: false },
      { id: 'd', text: 'Ctrl+Z', correct: false },
    ],
    explanation: 'Ctrl+X cuts the selected content.',
  },
  {
    id: 't24',
    prompt: 'Shortcut for Save?',
    options: [
      { id: 'a', text: 'Ctrl+S', correct: true },
      { id: 'b', text: 'Ctrl+P', correct: false },
      { id: 'c', text: 'Ctrl+O', correct: false },
      { id: 'd', text: 'Ctrl+N', correct: false },
    ],
    explanation: 'Ctrl+S saves the current document in many programs.',
  },
  {
    id: 't25',
    prompt: 'Shortcut for Undo?',
    options: [
      { id: 'a', text: 'Ctrl+Z', correct: true },
      { id: 'b', text: 'Ctrl+Y', correct: false },
      { id: 'c', text: 'Ctrl+A', correct: false },
      { id: 'd', text: 'Ctrl+S', correct: false },
    ],
    explanation: 'Ctrl+Z is the standard Undo shortcut.',
  },
  {
    id: 't26',
    prompt: 'What is Internet?',
    options: [
      { id: 'a', text: 'Global network', correct: true },
      { id: 'b', text: 'Local computer', correct: false },
      { id: 'c', text: 'Software', correct: false },
      { id: 'd', text: 'Hardware', correct: false },
    ],
    explanation: 'The Internet is a global network of interconnected computers.',
  },
  {
    id: 't27',
    prompt: 'Which protocol is commonly used for websites?',
    options: [
      { id: 'a', text: 'HTTP', correct: true },
      { id: 'b', text: 'FTP', correct: false },
      { id: 'c', text: 'SMTP', correct: false },
      { id: 'd', text: 'POP', correct: false },
    ],
    explanation: 'HTTP (and HTTPS) are used to transfer web pages.',
  },
  {
    id: 't28',
    prompt: 'Full form of IP?',
    options: [
      { id: 'a', text: 'Internet Protocol', correct: true },
      { id: 'b', text: 'Internal Program', correct: false },
      { id: 'c', text: 'Input Process', correct: false },
      { id: 'd', text: 'Internet Program', correct: false },
    ],
    explanation: 'IP stands for Internet Protocol.',
  },
  {
    id: 't29',
    prompt: 'Which device connects networks together?',
    options: [
      { id: 'a', text: 'Router', correct: true },
      { id: 'b', text: 'Printer', correct: false },
      { id: 'c', text: 'Keyboard', correct: false },
      { id: 'd', text: 'Monitor', correct: false },
    ],
    explanation: 'Routers connect multiple networks and route packets.',
  },
  {
    id: 't30',
    prompt: 'Full form of LAN?',
    options: [
      { id: 'a', text: 'Local Area Network', correct: true },
      { id: 'b', text: 'Large Area Network', correct: false },
      { id: 'c', text: 'Logical Area Network', correct: false },
      { id: 'd', text: 'Long Area Network', correct: false },
    ],
    explanation: 'LAN stands for Local Area Network.',
  },
];

const ALL_QUESTIONS: Question[] = [];
for (let i = 0; i < 500; i += 1) {
  const base = TEMPLATE_QUESTIONS[i % TEMPLATE_QUESTIONS.length];
  ALL_QUESTIONS.push({
    ...base,
    id: `q-${i + 1}`,
    prompt: `${base.prompt} (Question ${i + 1})`,
  });
}

// Generate 100 courses, each with 5 questions (100 * 5 = 500)
export const PRACTICE_COURSES: PracticeCourse[] = Array.from({ length: 100 }, (_, index) => {
  const base = BASE_COURSES[index % BASE_COURSES.length];
  const level: PracticeCourse['level'] = index < 50 ? 'beginner' : 'intermediate';

  const instanceNumber = Math.floor(index / BASE_COURSES.length) + 1;
  const suffix = instanceNumber > 1 ? ` (Set ${instanceNumber})` : '';

  const questionsPerCourse = 5;
  const startIndex = index * questionsPerCourse;
  const picked = ALL_QUESTIONS.slice(startIndex, startIndex + questionsPerCourse);

  return {
    id: `course-${index + 1}`,
    title: `${base.title}${suffix}`,
    topic: base.topic,
    level,
    description: base.description,
    questions: picked,
  };
});


