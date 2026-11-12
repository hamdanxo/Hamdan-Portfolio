import SmoothScroll from '@/components/effects/SmoothScroll';
import Reveal from '@/components/effects/Reveal';
import Cursor from '@/components/effects/Cursor';
import FlipCard from '@/components/effects/FlipCard';
import ContactSpotlight from '@/components/effects/ContactSpotlight';
import ProjectStack from '@/components/effects/ProjectStack';
import SiteHeader from '@/components/layout/SiteHeader';
import Hero from '@/components/home/Hero';
import Projects from '@/components/home/Projects';
import Statement from '@/components/home/Statement';
import ScrollFill from '@/components/effects/ScrollFill';
import About from '@/components/home/About';
import Journey from '@/components/home/Journey';
import WhatIDo from '@/components/home/WhatIDo';
import Skills from '@/components/home/Skills';
import Languages from '@/components/home/Languages';
import Contact from '@/components/home/Contact';

const REVEAL =
  '#heroText, #projects > div:first-child, #skills > div:first-child, #skills .sk-cell, #languages > *, #contact > *';

export default function HomePage() {
  return (
    <div className="page">
      <div className="page-inner">
        <SiteHeader page="home" />
        <main>
          <Hero />
          <Statement />
          <Projects />
          <About />
          <Journey />
          <WhatIDo />
          <Skills />
          <Languages />
          <Contact />
        </main>
      </div>
      <SmoothScroll />
      <Reveal selector={REVEAL} />
      <Cursor magnetic="#heroText a, header nav a:last-child" />
      <FlipCard />
      <ContactSpotlight />
      <ProjectStack />
      <ScrollFill id="statement" />
    </div>
  );
}
