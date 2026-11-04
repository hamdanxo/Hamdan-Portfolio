export type Book = {
  /** Page images in reading order (first = front cover, last = back cover). */
  pages: string[];
  /** Pixel size of one page image. */
  width: number;
  height: number;
};

export type Design = {
  client: string;
  title: string;
  year: string;
  tags: string[];
  /** Cover / preview image under /public. null shows placeholder art. */
  img: string | null;
  /** Multi-page work (company profiles, brochures): opens as a page-turning book. */
  book?: Book;
};

const pages = (folder: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/designs/${folder}/p${String(i + 1).padStart(2, '0')}.webp`);

/** Real work. Add new designs here (newest first). */
export const work: Design[] = [
  {
    client: 'Global Classic',
    title: 'Company Profile 2026',
    year: '2026',
    tags: ['Print', 'Brand'],
    img: '/designs/global-classic-profile/cover.webp',
    book: { pages: pages('global-classic-profile', 18), width: 1000, height: 1393 },
  },
];

/** Placeholder art shown in the endless grid until there are at least 8 real designs. */
const placeholders: Design[] = [
  { client: 'Coming soon', title: 'Design 01', year: '2026', tags: ['Brand', 'Logo'], img: null },
  { client: 'Coming soon', title: 'Design 02', year: '2026', tags: ['Social', 'Post'], img: null },
  { client: 'Coming soon', title: 'Design 03', year: '2026', tags: ['Print', 'Poster'], img: null },
  { client: 'Coming soon', title: 'Design 04', year: '2026', tags: ['Ad', 'Creative'], img: null },
  { client: 'Coming soon', title: 'Design 05', year: '2026', tags: ['Brand', 'Card'], img: null },
  { client: 'Coming soon', title: 'Design 06', year: '2026', tags: ['Social', 'Story'], img: null },
  { client: 'Coming soon', title: 'Design 07', year: '2026', tags: ['Print', 'Flyer'], img: null },
];

/** What the gallery shows: real work first, topped up with placeholders to 8 cards. */
export const designs: Design[] = [...work, ...placeholders.slice(0, Math.max(0, 8 - work.length))];
