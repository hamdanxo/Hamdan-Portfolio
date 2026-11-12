import fs from 'node:fs';
import path from 'node:path';
import AboutMotion from './AboutMotion';

// The Download CV button only appears once public/cv.pdf exists, so there is never a broken link.
const hasCv = fs.existsSync(path.join(process.cwd(), 'public', 'cv.pdf'));
// A photo shows on the left of the screen once public/about/photo.webp exists; until then a soft glass light.
const hasPhoto = fs.existsSync(path.join(process.cwd(), 'public', 'about', 'photo.webp'));

const P1 =
  "I'm a Computer Science student at the University of Wollongong in Dubai, majoring in Big Data and AI. I like work that sits between design and engineering, where how something looks matters as much as how it runs.";
const P2 =
  "At Lapiz Blue I look after graphic design and marketing, from company profiles to product launches. Before that I coordinated client events at Cheeky Monkeys and handled data work for The Mosbach Group. I'm open to internships and volunteer roles where I can keep learning by doing.";

/** Splits text into words that light up one by one as you scroll. */
const words = (t: string) => t.split(' ').map((w, i) => <span className="ab3-w" key={i}>{w} </span>);

export default function About() {
  return (
    <section className="ab3" id="about" aria-label="About">
      <div className="ab3-pin">
        <div className="ab3-dev">
          <div className="ab3-bezel">
            <div className="ab3-screen">
              <div className="ab3-l">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {hasPhoto ? <img className="ab3-photo" src="/about/photo.webp" alt="Muhammad Hamdan" /> : <div className="ab3-orb" aria-hidden="true" />}
                <dl className="ab3-facts">
                  <div><dt>Based in</dt><dd>Dubai</dd></div>
                  <div><dt>Studying</dt><dd>UOWD, Big Data and AI</dd></div>
                  <div><dt>Working at</dt><dd>Lapiz Blue</dd></div>
                </dl>
                <i className="ab3-plus" aria-hidden="true" />
              </div>
              <div className="ab3-r">
                <p className="mono ab3-k">About</p>
                <h2 className="ab3-h">
                  <span className="ab3-hw">Developer,</span> <span className="ab3-hw">designer</span>{' '}
                  <span className="ab3-hw ab3-pu">and</span> <span className="ab3-hw ab3-pu">marketer.</span>
                </h2>
                <p className="ab3-p">{words(P1)}</p>
                <p className="ab3-p">{words(P2)}</p>
                {hasCv && <a className="cv-btn ab3-cv" href="/cv.pdf" download="Muhammad Hamdan CV.pdf">Download CV</a>}
              </div>
            </div>
          </div>
          <div className="ab3-stand" aria-hidden="true" />
          <div className="ab3-base" aria-hidden="true" />
        </div>
      </div>
      <AboutMotion />
    </section>
  );
}
