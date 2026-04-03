export type Flashcard = {
  id: string;
  term: string;
  definition: string;
};

export type FlashcardCategory = {
  id: string;
  title: string;
  description: string;
  iconName: string; // We'll map this to a Lucide icon in the UI
  cards: Flashcard[];
};

export const FLASHCARD_CATEGORIES: FlashcardCategory[] = [
  {
    id: 'hardware',
    title: 'Computer Hardware',
    description: 'Learn the physical components that make up a computer.',
    iconName: 'Cpu',
    cards: [
      { id: 'h1', term: 'CPU', definition: 'Central Processing Unit. The "brain" of the computer that performs calculations and executes instructions.' },
      { id: 'h2', term: 'RAM', definition: 'Random Access Memory. Fast, temporary storage used by the computer to hold data it is currently using.' },
      { id: 'h3', term: 'Motherboard', definition: 'The main circuit board that connects and allows communication between all hardware components.' },
      { id: 'h4', term: 'Hard Drive (HDD)', definition: 'A traditional storage device that uses mechanical platters to store data permanently.' },
      { id: 'h5', term: 'Solid State Drive (SSD)', definition: 'A faster, newer type of storage device that uses flash memory with no moving parts.' },
      { id: 'h6', term: 'GPU', definition: 'Graphics Processing Unit. Dedicated hardware for rendering images, video, and 3D graphics.' },
      { id: 'h7', term: 'Power Supply (PSU)', definition: 'Converts electricity from the wall outlet into usable power for internal computer components.' },
      { id: 'h8', term: 'Peripheral', definition: 'Any external device connected to a computer, like a mouse, keyboard, or printer.' },
    ],
  },
  {
    id: 'software',
    title: 'Software & OS',
    description: 'Master operating system concepts and software basics.',
    iconName: 'Monitor',
    cards: [
      { id: 's1', term: 'Operating System (OS)', definition: 'The core software that manages hardware resources and provides services for other programs (e.g., Windows, macOS, Linux).' },
      { id: 's2', term: 'Application', definition: 'A program designed to perform a specific task for the user, like a web browser or word processor.' },
      { id: 's3', term: 'Driver', definition: 'A specialized piece of software that allows the operating system to communicate with a hardware device.' },
      { id: 's4', term: 'File Extension', definition: 'The suffix at the end of a filename (like .jpg or .txt) that indicates the file format.' },
      { id: 's5', term: 'Process', definition: 'An instance of a computer program that is currently being executed.' },
      { id: 's6', term: 'GUI', definition: 'Graphical User Interface. Allows users to interact with electronic devices using graphical icons and visual indicators.' },
      { id: 's7', term: 'Algorithm', definition: 'A step-by-step set of instructions designed to perform a specific task or solve a problem.' },
      { id: 's8', term: 'Open Source', definition: 'Software whose source code is made available to the public, allowing anyone to view, modify, and distribute it.' },
    ],
  },
  {
    id: 'networking',
    title: 'Networking Basics',
    description: 'Understand how computers connect and talk to each other.',
    iconName: 'Server',
    cards: [
      { id: 'n1', term: 'IP Address', definition: 'Internet Protocol Address. A unique numerical label assigned to every device connected to a computer network.' },
      { id: 'n2', term: 'Router', definition: 'A device that forwards data packets between computer networks, directing traffic on the internet.' },
      { id: 'n3', term: 'LAN', definition: 'Local Area Network. A network that connects computers within a limited physical area, like a home or office.' },
      { id: 'n4', term: 'WAN', definition: 'Wide Area Network. A telecommunications network that extends over a large geographical area (the internet is the largest WAN).' },
      { id: 'n5', term: 'Protocol', definition: 'A set of rules governing the exchange or transmission of data between devices.' },
      { id: 'n6', term: 'HTTP/HTTPS', definition: 'Hypertext Transfer Protocol (Secure). The foundation of data communication for the World Wide Web.' },
      { id: 'n7', term: 'Bandwidth', definition: 'The maximum rate of data transfer across a given path, usually measured in bits per second.' },
      { id: 'n8', term: 'Ping', definition: 'A tool used to test the reachability of a host on an IP network and measure the round-trip time.' },
    ],
  },
  {
    id: 'web-dev',
    title: 'Web Development',
    description: 'Learn the foundational languages of the World Wide Web.',
    iconName: 'Code',
    cards: [
      { id: 'w1', term: 'HTML', definition: 'HyperText Markup Language. The standard markup language used to create the structure of web pages.' },
      { id: 'w2', term: 'CSS', definition: 'Cascading Style Sheets. The language used to describe the presentation and styling of a web page.' },
      { id: 'w3', term: 'JavaScript', definition: 'A programming language that enables interactive web pages and dynamic content.' },
      { id: 'w4', term: 'DOM', definition: 'Document Object Model. A programming interface for HTML and XML documents, representing the page so programs can change the document structure, style, and content.' },
      { id: 'w5', term: 'Frontend', definition: 'The part of a website that users interact with directly in their browser.' },
      { id: 'w6', term: 'Backend', definition: 'The server-side part of a website, managing the database, server physics, and application logic.' },
      { id: 'w7', term: 'API', definition: 'Application Programming Interface. A set of rules that allows different software applications to communicate with each other.' },
    ],
  }
];
