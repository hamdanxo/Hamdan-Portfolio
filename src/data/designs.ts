export type Book = {
  /** Page images in reading order (first = front cover, last = back cover). */
  pages: string[];
  /** Pixel size of one page image. */
  width: number;
  height: number;
};

export type ImageSet = {
  /** Images in order; the first one is shown in front when the set opens. */
  images: string[];
  /** Pixel size of the images (all the same shape). */
  width: number;
  height: number;
};

/** The kinds of design work, shown as categories. */
export type Category = 'profile' | 'ad' | 'social' | 'brand';
export const categories: { id: Category; name: string; unit: [string, string] }[] = [
  { id: 'profile', name: 'Company Profiles and Catalogues', unit: ['profile', 'profiles'] },
  { id: 'ad', name: 'Ad Creatives', unit: ['ad', 'ads'] },
  { id: 'social', name: 'Social Media', unit: ['series', 'series'] },
  { id: 'brand', name: 'Brand Identity', unit: ['board', 'boards'] },
];

export type Design = {
  client: string;
  /** Which category it belongs to (placeholders have none). */
  category?: Category;
  title: string;
  year: string;
  tags: string[];
  /** Cover / preview image under /public. null shows placeholder art. */
  img: string | null;
  /** Multi-page work (company profiles, brochures): opens as a page-turning book. */
  book?: Book;
  /** A series of posts or ads: opens as a stack you can flip through. */
  set?: ImageSet;
};

const pages = (folder: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/designs/${folder}/p${String(i + 1).padStart(2, '0')}.webp`);
const shots = (folder: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/designs/${folder}/${String(i + 1).padStart(2, '0')}.webp`);

/** Real work. Add new designs here (newest first). */
export const work: Design[] = [
  {
    client: 'Global Classic',
    category: 'brand',
    title: 'Brand Board',
    year: '2026',
    tags: ['Brand', 'Identity'],
    img: '/designs/global-classic-brand/cover.webp',
    set: { images: shots('global-classic-brand', 4), width: 2400, height: 1500 },
  },
  {
    client: 'Sixty Newton',
    category: 'brand',
    title: 'Brand Board',
    year: '2026',
    tags: ['Brand', 'Identity'],
    img: '/designs/sixty-newton-brand/cover.webp',
    set: { images: shots('sixty-newton-brand', 4), width: 2400, height: 1500 },
  },
  {
    client: 'Lapiz Blue',
    category: 'brand',
    title: 'Brand Board',
    year: '2026',
    tags: ['Brand', 'Identity'],
    img: '/designs/lapiz-blue-brand/cover.webp',
    set: { images: shots('lapiz-blue-brand', 4), width: 2400, height: 1500 },
  },
  {
    client: 'Sixty Newton',
    category: 'profile',
    title: 'Company Profile 2026',
    year: '2026',
    tags: ['Print', 'Brand'],
    img: '/designs/sixty-newton-profile/cover.webp',
    book: { pages: pages('sixty-newton-profile', 24), width: 1414, height: 1000 },
  },
  {
    client: 'Sahihi Construction Chemicals',
    category: 'profile',
    title: 'Company Profile 2026',
    year: '2026',
    tags: ['Print', 'Brand'],
    img: '/designs/sahihi-profile/cover.webp',
    book: { pages: pages('sahihi-profile', 24), width: 1000, height: 1414 },
  },
  {
    client: 'Lapiz Blue',
    category: 'profile',
    title: 'Company Profile 2026-27',
    year: '2026',
    tags: ['Print', 'Brand'],
    img: '/designs/lapiz-blue-profile/cover.webp',
    book: { pages: pages('lapiz-blue-profile', 28), width: 1000, height: 1352 },
  },
  {
    client: 'Global Classic',
    category: 'social',
    title: 'Stone Collections',
    year: '2026',
    tags: ['Social', 'Series'],
    img: '/designs/stone-collections/cover.webp',
    set: { images: shots('stone-collections', 7), width: 1200, height: 1200 },
  },
  {
    client: 'Lapiz Blue',
    category: 'ad',
    title: 'Fuga-Shock Launch',
    year: '2026',
    tags: ['Social', 'Ad'],
    img: '/designs/fuga-shock/cover.webp',
    set: { images: shots('fuga-shock', 3), width: 1024, height: 1280 },
  },
  {
    client: 'Global Classic',
    category: 'profile',
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
