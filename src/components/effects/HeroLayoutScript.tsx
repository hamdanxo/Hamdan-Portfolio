/**
 * Positions the hand and card for the current screen before the first paint.
 * Runs inline while the page is parsed (no hydration wait), so the hero image
 * is painted in its final place: no layout shift and a fast LCP on phones.
 * FlipCard re-runs the same layout on resize and after fonts load.
 */
export const heroLayout = `(function(){var b=document.getElementById('flipBox'),c=document.getElementById('flipCard'),h=document.getElementById('heroText');if(!b||!c||!h)return;var vw=innerWidth,vh=innerHeight,s=vw<=900||vw/vh<1.15;var d=document.documentElement;d.classList.toggle('hero-stack',s);d.classList.toggle('hero-short',vh<1000);if(s){var tb=0;for(var i=0;i<h.children.length;i++){var e=h.children[i];if(e.offsetHeight)tb=Math.max(tb,e.offsetTop+e.offsetHeight);}tb+=h.offsetTop;var w=Math.min(vw*.88,560)/.42,m=(vh-48-tb)/.86;w=Math.max(Math.min(w,m*1.5),vw*.8);var hh=w/1.5;b.style.cssText='width:'+w.toFixed(0)+'px;left:'+Math.min(vw/2-.355*w,vw*.06).toFixed(0)+'px;top:'+(tb+48+.16*hh).toFixed(0)+'px;right:auto;bottom:auto';}c.style.setProperty('--k',(c.clientWidth/359).toFixed(4));})();`;

/** Runs in <head>: sets the hero layout mode from the screen shape before anything is painted. */
export const heroModeScript = `(function(){var d=document.documentElement,w=innerWidth,h=innerHeight;if(w<=900||w/h<1.15)d.classList.add('hero-stack');if(h<1000)d.classList.add('hero-short');})();`;

export default function HeroLayoutScript() {
  return <script dangerouslySetInnerHTML={{ __html: heroLayout }} />;
}
