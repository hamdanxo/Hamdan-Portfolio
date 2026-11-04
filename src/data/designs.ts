export type Design = {
  client: string;
  title: string;
  year: string;
  tags: [string, string] | string[];
  /** Path under /public, e.g. "/designs/brand-poster.webp". Leave null to show placeholder art. */
  img: string | null;
};

/** Add real work here. The gallery count only counts items that have an image. */
export const designs: Design[] = [
  { client: 'Coming soon', title: 'Design 01', year: '2026', tags: ['Brand', 'Logo'], img: null },
  { client: 'Coming soon', title: 'Design 02', year: '2026', tags: ['Social', 'Post'], img: null },
  { client: 'Coming soon', title: 'Design 03', year: '2026', tags: ['Print', 'Poster'], img: null },
  { client: 'Coming soon', title: 'Design 04', year: '2026', tags: ['Ad', 'Creative'], img: null },
  { client: 'Coming soon', title: 'Design 05', year: '2026', tags: ['Brand', 'Card'], img: null },
  { client: 'Coming soon', title: 'Design 06', year: '2026', tags: ['Social', 'Story'], img: null },
  { client: 'Coming soon', title: 'Design 07', year: '2026', tags: ['Print', 'Flyer'], img: null },
  { client: 'Coming soon', title: 'Design 08', year: '2026', tags: ['Ad', 'Banner'], img: null },
];
