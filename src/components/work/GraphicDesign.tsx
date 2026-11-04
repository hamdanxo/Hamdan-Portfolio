import DesignGallery from './DesignGallery';

export default function GraphicDesign() {
  return (
    <section className="cat" id="cat-graphic-design" data-cat="graphic-design">
      <div className="cat-head">
        <span className="cat-num">01</span>
        <div>
          <h2 className="cat-name">Graphic Design</h2>
          <p className="cat-desc">Brand work, social posts, print and ad creatives.</p>
        </div>
        <span className="cat-count">00 projects</span>
      </div>
      <DesignGallery />
    </section>
  );
}
