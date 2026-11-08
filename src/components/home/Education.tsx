import EducationMotion from '@/components/effects/EducationMotion';

/**
 * Education as a short scroll scene: the page fades into a classroom, the camera moves in on a student's laptop,
 * the education details are on its screen, then the camera dives into the screen and the page carries on.
 */
export default function Education() {
  return (
    <section className="ed" id="education" aria-label="Education">
      <div className="ed-pin">
        <div className="ed-stage ed-wide" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/edu/classroom-1400.webp" srcSet="/images/edu/classroom-1400.webp 1400w, /images/edu/classroom-2400.webp 2400w" sizes="max(100vw, 177vh)" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="ed-stage ed-close">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/edu/laptop-1400.webp" srcSet="/images/edu/laptop-1400.webp 1400w, /images/edu/laptop-2400.webp 2400w" sizes="(orientation: portrait) 168vw, max(100vw, 177vh)" alt="" loading="lazy" decoding="async" />
          <div className="ed-screen">
            <div className="ed-ui">
              <p className="ed-bar" aria-hidden="true"><i /><i /><i /><span>education</span></p>
              <h2 className="ed-title">Where I learned</h2>
              <div className="ed-rows">
                <div className="ed-row">
                  <span className="ed-when">2023 to now</span>
                  <h3>University of Wollongong in Dubai</h3>
                  <p>Bachelor of Computer Science, Big Data and AI</p>
                </div>
                <div className="ed-row">
                  <span className="ed-when">Completed</span>
                  <h3>The Westminster School, Dubai</h3>
                  <p>High School Diploma. O Levels in Travel and Tourism and Business. A Levels in Maths, Physics and English.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ed-veil" aria-hidden="true" />
      </div>
      <EducationMotion />
    </section>
  );
}
