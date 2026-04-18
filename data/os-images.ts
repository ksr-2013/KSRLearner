export type OSErrorType = 'missing_image' | 'generic';

export interface OSOption {
  id: string;
  name: string;
  description: string;
  year: string;
  memory_size: number;
  vga_memory_size: number;
  url: string; // The local or remote URL to the image file
  icon: string;
  downloadLink?: string; // Where the user can download the image if missing
  isExternal?: boolean; // If true, the URL is assumed to be fully functional (like copy.sh)
  drive_type?: 'hda' | 'fda' | 'cdrom';
  asyncLoad?: boolean; // If false, image is loaded synchronously (required for some images like Windows 3.0)
}

export const OS_OPTIONS: OSOption[] = [
  {
    id: 'msdos622',
    name: 'MS-DOS 6.22',
    description: 'The final standalone release of Microsoft DOS, featuring DriveSpace, ScanDisk, and more.',
    year: '1994',
    memory_size: 16 * 1024 * 1024,
    vga_memory_size: 2 * 1024 * 1024,
    url: '/os-images/msdos622/msdos622.iso',
    downloadLink: 'https://winworldpc.com/product/ms-dos/622',
    icon: '⌨️'
  },
  {
    id: 'freedos',
    name: 'FreeDOS',
    description: 'An open-source DOS-compatible operating system. Pre-installed with various DOS applications and games.',
    year: '1998',
    memory_size: 32 * 1024 * 1024,
    vga_memory_size: 2 * 1024 * 1024,
    url: '/os-images/freedos/freedos.img',
    downloadLink: 'https://copy.sh/v86/images/freedos722.img',
    icon: '🐧',
    drive_type: 'fda'
  },
  {
    id: 'win101',
    name: 'Windows 1.01',
    description: 'The very first version of Microsoft Windows, released in 1985.',
    year: '1985',
    memory_size: 16 * 1024 * 1024,
    vga_memory_size: 2 * 1024 * 1024,
    url: '/os-images/windows101/windows101.img',
    downloadLink: 'https://copy.sh/v86/images/windows101.img',
    icon: '🪟',
    drive_type: 'fda'
  },
  {
    id: 'win203',
    name: 'Windows 2.03',
    description: 'The second major release of Windows, introducing overlapping windows.',
    year: '1987',
    memory_size: 16 * 1024 * 1024,
    vga_memory_size: 2 * 1024 * 1024,
    url: '/os-images/win203/win203.img',
    downloadLink: 'https://winworldpc.com/product/windows-20/203',
    icon: '🖥️',
    drive_type: 'fda'
  },
  {
    id: 'win30',
    name: 'Windows 3.0',
    description: 'The first widely successful version of Windows, featuring CorelDRAW! 2.0, Actor 2.0, and The Best of Microsoft Entertainment Pack.',
    year: '1990',
    memory_size: 128 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    url: '/os-images/win30/windows30.img',
    icon: '🗔',
    drive_type: 'hda',
  },
  {
    id: 'win31',
    name: 'Windows 3.1',
    description: 'The classic 16-bit operating environment that popularized Windows.',
    year: '1992',
    memory_size: 32 * 1024 * 1024,
    vga_memory_size: 4 * 1024 * 1024,
    url: '/os-images/win31/win31.img',
    downloadLink: 'https://winworldpc.com/product/windows-3/31',
    icon: '🗔',
    drive_type: 'fda'
  },
  {
    id: 'winnt31',
    name: 'Windows NT 3.1',
    description: 'The first release of the Windows NT line, designed for servers and workstations.',
    year: '1993',
    memory_size: 64 * 1024 * 1024,
    vga_memory_size: 4 * 1024 * 1024,
    url: '/os-images/winnt31/winnt31.img',
    downloadLink: 'https://winworldpc.com/product/windows-nt-31/31',
    icon: '🏢'
  },
  {
    id: 'winnt351',
    name: 'Windows NT 3.51',
    description: 'Known as "The PowerPC Release", highly stable NT workstation.',
    year: '1995',
    memory_size: 64 * 1024 * 1024,
    vga_memory_size: 4 * 1024 * 1024,
    url: '/os-images/winnt351/winnt351.img',
    downloadLink: 'https://winworldpc.com/product/windows-nt-3x/351',
    icon: '🏢'
  },
  {
    id: 'win95',
    name: 'Windows 95',
    description: 'The revolutionary operating system that introduced the Start button.',
    year: '1995',
    memory_size: 64 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    url: '/os-images/windows95/windows95.img',
    downloadLink: 'https://archive.org/details/Windows95_vms',
    icon: 'Start'
  },
  {
    id: 'winnt4',
    name: 'Windows NT 4.0',
    description: 'Combined the Windows 95 interface with the robust Windows NT kernel.',
    year: '1996',
    memory_size: 128 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    url: '/os-images/winnt4/winnt4.img',
    downloadLink: 'https://winworldpc.com/product/windows-nt-40/40',
    icon: '🏢'
  },
  {
    id: 'win98',
    name: 'Windows 98',
    description: 'The beloved OS that deeply integrated the World Wide Web.',
    year: '1998',
    memory_size: 128 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    url: '/os-images/windows98/windows98.img',
    downloadLink: 'https://archive.org/details/windows-98-se-v86',
    icon: '💻'
  },
  {
    id: 'reactos',
    name: 'ReactOS',
    description: 'An open-source operating system aiming for binary compatibility with Windows programs.',
    year: '1998',
    memory_size: 256 * 1024 * 1024,
    vga_memory_size: 16 * 1024 * 1024,
    url: 'https://copy.sh/v86/images/reactos.img',
    icon: '⚛️',
    isExternal: true
  },
  {
    id: 'win2000',
    name: 'Windows 2000',
    description: 'The professional OS moving entirely to the NT kernel architecture.',
    year: '2000',
    memory_size: 256 * 1024 * 1024,
    vga_memory_size: 16 * 1024 * 1024,
    url: '/os-images/windows2000/windows2000.img',
    downloadLink: 'https://winworldpc.com/product/windows-nt-2000/final',
    icon: '🏢'
  },
  {
    id: 'winme',
    name: 'Windows ME',
    description: 'Windows Millennium Edition, the final DOS-based Windows release focusing on home users.',
    year: '2000',
    memory_size: 128 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    url: '/os-images/winme/winme.img',
    downloadLink: 'https://winworldpc.com/product/windows-me/final',
    icon: '💻'
  },
  {
    id: 'archlinux',
    name: 'Arch Linux',
    description: 'A lightweight and flexible Linux distribution that tries to keep it simple.',
    year: '2002',
    memory_size: 512 * 1024 * 1024,
    vga_memory_size: 16 * 1024 * 1024,
    url: '/os-images/archlinux/archlinux.img',
    downloadLink: 'https://archlinux.org/download/',
    icon: '🐧'
  },
  {
    id: 'kolibrios',
    name: 'KolibriOS',
    description: 'An extremely small and fast open-source operating system written entirely in assembly language.',
    year: '2004',
    memory_size: 256 * 1024 * 1024,
    vga_memory_size: 16 * 1024 * 1024,
    url: 'https://copy.sh/v86/images/kolibri.img',
    icon: '🐦',
    isExternal: true
  }
];
