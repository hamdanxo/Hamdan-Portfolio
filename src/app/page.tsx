import LiquidBackground from '@/components/effects/LiquidBackground';
import SmoothScroll from '@/components/effects/SmoothScroll';
import Reveal from '@/components/effects/Reveal';
import Cursor from '@/components/effects/Cursor';
import FlipCard from '@/components/effects/FlipCard';
import ContactSpotlight from '@/components/effects/ContactSpotlight';
import GlowParallax from '@/components/effects/GlowParallax';
import ProjectStack from '@/components/effects/ProjectStack';
import Glows from '@/components/layout/Glows';
import SiteHeader from '@/components/layout/SiteHeader';
import Hero from '@/components/home/Hero';
import Marquee from '@/components/home/Marquee';
import Projects from '@/components/home/Projects';
import Statement from '@/components/home/Statement';
import ClientStrip from '@/components/home/ClientStrip';
import ScrollFill from '@/components/effects/ScrollFill';
import ImageRipple from '@/components/effects/ImageRipple';
import About from '@/components/home/About';
import Education from '@/components/home/Education';
import Skills from '@/components/home/Skills';
import Languages from '@/components/home/Languages';
import Contact from '@/components/home/Contact';

const REVEAL =
  '#heroText, #strip, #projects > div:first-child, #about > div, #education > div:first-child, #education .glass, #skills > div:first-child, #skills .glass, #languages > *, #contact > *';

export default function HomePage() {
  return (
    <div className="page">
      <LiquidBackground />
      <Glows />
      <div className="page-inner">
        <SiteHeader page="home" />
        <main>
          <Hero />
          <Marquee />
          <Statement />
          <Projects />
          <ClientStrip />
          <About />
          <Education />
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
      <GlowParallax />
      <ProjectStack />
      <ScrollFill id="statement" />
      <ImageRipple selector=".pj-photo img" />
    </div>
  );
}
