/**
 * Positions the hand and card for the current screen before the first paint.
 * Runs inline while the page is parsed (no hydration wait), so the hero image
 * is painted in its final place: no layout shift and a fast LCP on phones.
 * FlipCard re-runs the same layout on resize and after fonts load.
 */
export const heroLayout = `(function(){var p=document.querySelector('#card .flip-pin'),b=document.getElementById('flipBox'),c=document.getElementById('flipCard'),h=document.getElementById('heroText');if(!p||!b||!c||!h)return;var vw=innerWidth,vh=innerHeight,s=vw<=900||vw/vh<1.15;p.classList.toggle('stack',s);p.classList.toggle('short',vh<1000);if(s){var tb=0;for(var i=0;i<h.children.length;i++){var e=h.children[i];if(e.offsetHeight)tb=Math.max(tb,e.offsetTop+e.offsetHeight);}tb+=h.offsetTop;var w=Math.min(vw*.88,560)/.42,m=(vh-18-tb)/.86;w=Math.max(Math.min(w,m*1.5),vw*.8);var hh=w/1.5;b.style.cssText='width:'+w.toFixed(0)+'px;left:'+Math.min(vw/2-.355*w,vw*.06).toFixed(0)+'px;top:'+(tb+18+.16*hh).toFixed(0)+'px;right:auto;bottom:auto';}c.style.setProperty('--k',(c.clientWidth/359).toFixed(4));})();`;

export default function HeroLayoutScript() {
  return <script dangerouslySetInnerHTML={{ __html: heroLayout }} />;
}
