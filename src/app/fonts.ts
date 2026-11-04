import localFont from 'next/font/local';

export const geist = localFont({
  src: '../fonts/geist-latin-200-500.woff2',
  variable: '--font-geist',
  weight: '200 500',
  display: 'swap',
});

export const manrope = localFont({
  src: '../fonts/manrope-latin-200-600.woff2',
  variable: '--font-manrope',
  weight: '200 600',
  display: 'swap',
  preload: false,
});

export const dmMono = localFont({
  src: [
    { path: '../fonts/dm-mono-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/dm-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-dm-mono',
  display: 'swap',
  preload: false,
});

export const cormorant = localFont({
  src: '../fonts/cormorant-garamond-latin-400-italic.woff2',
  variable: '--font-cormorant',
  weight: '400',
  style: 'italic',
  display: 'swap',
});

export const michroma = localFont({
  src: '../fonts/michroma-latin-400-normal.woff2',
  variable: '--font-michroma',
  weight: '400',
  display: 'swap',
  preload: false,
});

export const montserrat = localFont({
  src: [
    { path: '../fonts/montserrat-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/montserrat-latin-500-normal.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false,
});

export const fontVariables = [geist, manrope, dmMono, cormorant, michroma, montserrat].map((f) => f.variable).join(' ');
