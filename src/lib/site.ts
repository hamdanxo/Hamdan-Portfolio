export const site = {
  name: 'Muhammad Hamdan',
  title: 'Muhammad Hamdan | Portfolio',
  description:
    'Muhammad Hamdan, Computer Science student at the University of Wollongong in Dubai. Web developer, graphic designer and marketer.',
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000'),
  email: 'hamdansameer2005@gmail.com',
} as const;
