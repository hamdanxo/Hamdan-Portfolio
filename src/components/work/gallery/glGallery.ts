import {
  CanvasTexture,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';
import type { TileSize } from './atlas';

const vertex = /* glsl */ `
attribute vec2 aBase;   // tile slot position (px, before scrolling)
attribute vec2 aCell;   // which card in the atlas
uniform vec2 uOffset;   // drag / drift offset (px)
uniform vec2 uSpan;     // full size of the repeating tile band (px)
uniform vec2 uView;     // stage size (px)
uniform vec2 uTile;     // tile size (px)
uniform vec2 uMouse;    // pointer in stage px, centred; far away when not hovering
uniform float uBend;    // curvature strength
varying vec2 vUv;
varying vec2 vCell;
varying float vHover;
varying float vEdge;

void main() {
  // Endless wrap: every slot stays inside a band centred on the screen.
  vec2 c = mod(aBase + uOffset + uSpan * 0.5, uSpan) - uSpan * 0.5;
  vec2 p = c + vec2(position.x, -position.y); // screen space, y down
  // Bowl: points sink away from the camera the further they are from the centre.
  vec2 n = p / (uView * 0.5);
  float z = -(n.x * n.x * 0.9 + n.y * n.y * 0.6) * uBend;
  vUv = uv;
  vCell = aCell;
  vec2 d = abs(uMouse - c) - uTile * 0.5;
  vHover = step(max(d.x, d.y), 0.0);
  vEdge = clamp(length(n * vec2(0.75, 0.85)), 0.0, 1.6);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p.x, -p.y, z, 1.0);
}`;

const fragment = /* glsl */ `
uniform sampler2D uAtlas;
uniform vec2 uGrid;     // atlas columns, rows
varying vec2 vUv;
varying vec2 vCell;
varying float vHover;
varying float vEdge;

void main() {
  vec2 uv = (vCell + vec2(vUv.x, 1.0 - vUv.y)) / uGrid;
  vec4 col = texture2D(uAtlas, vec2(uv.x, 1.0 - uv.y));
  // hover: lift the card and add a thin violet edge
  vec2 e = min(vUv, 1.0 - vUv);
  float border = 1.0 - step(0.006, min(e.x, e.y * 0.83));
  col.rgb += vHover * (0.05 + border * vec3(0.33, 0.24, 0.62));
  // soft edge fade, like the CSS vignette
  col.rgb *= 1.0 - smoothstep(0.85, 1.45, vEdge) * 0.55;
  gl_FragColor = col;
}`;

export type GalleryGL = {
  /** True when WebGL runs in software (no GPU): animate only while the user interacts. */
  software: boolean;
  setOffset: (x: number, y: number) => void;
  setMouse: (x: number | null, y: number | null) => void;
  resize: () => void;
  render: () => void;
  dispose: () => void;
};

/**
 * One WebGL canvas draws the whole endless, curved grid: a single instanced mesh and one texture.
 * Moving it only changes a uniform, so it stays smooth on phones.
 */
export function createGalleryGL(
  canvas: HTMLCanvasElement,
  atlas: { canvas: HTMLCanvasElement; cols: number; rows: number },
  count: number,
  size: TileSize,
): GalleryGL {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  // Phones: cap the pixel ratio a little lower; the cards are textures, so they stay sharp.
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 10, 6000);
  const texture = new CanvasTexture(atlas.canvas);
  // Raw sRGB values in, raw values out: the shader writes gl_FragColor directly, so no colour conversion.
  texture.minFilter = LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const { W, H, G } = size;
  const plane = new PlaneGeometry(W, H, 12, 12);
  const geometry = new InstancedBufferGeometry();
  geometry.index = plane.index;
  geometry.setAttribute('position', plane.getAttribute('position'));
  geometry.setAttribute('uv', plane.getAttribute('uv'));

  const uniforms = {
    uOffset: { value: new Vector2() },
    uSpan: { value: new Vector2() },
    uView: { value: new Vector2(1, 1) },
    uTile: { value: new Vector2(W, H) },
    uMouse: { value: new Vector2(1e6, 1e6) },
    uBend: { value: 260 },
    uAtlas: { value: texture },
    uGrid: { value: new Vector2(atlas.cols, atlas.rows) },
  };
  const material = new ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true, depthTest: false, depthWrite: false });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  const layout = () => {
    const sw = canvas.clientWidth, sh = canvas.clientHeight;
    // Enough slots to cover the screen plus three spare tiles on every side.
    const cols = Math.ceil(sw / (W + G)) + 6, rows = Math.ceil(sh / (H + G)) + 6;
    const base = new Float32Array(cols * rows * 2), cell = new Float32Array(cols * rows * 2);
    for (let r = 0, k = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++, k++) {
        base[k * 2] = c * (W + G) - ((cols - 1) * (W + G)) / 2;
        base[k * 2 + 1] = r * (H + G) - ((rows - 1) * (H + G)) / 2;
        const i = (c + r * 3) % count;
        cell[k * 2] = i % atlas.cols;
        cell[k * 2 + 1] = Math.floor(i / atlas.cols);
      }
    }
    geometry.setAttribute('aBase', new InstancedBufferAttribute(base, 2));
    geometry.setAttribute('aCell', new InstancedBufferAttribute(cell, 2));
    geometry.instanceCount = cols * rows;
    uniforms.uSpan.value.set(cols * (W + G), rows * (H + G));
    uniforms.uView.value.set(sw, sh);
    uniforms.uBend.value = sw < 700 ? 110 : 150;
  };

  const resize = () => {
    const sw = canvas.clientWidth, sh = canvas.clientHeight;
    renderer.setSize(sw, sh, false);
    // Camera distance so one world unit is one CSS pixel at depth 0.
    camera.aspect = sw / sh;
    camera.position.set(0, 0, sh / 2 / Math.tan((camera.fov * Math.PI) / 360));
    camera.updateProjectionMatrix();
    layout();
  };
  resize();

  const gl = renderer.getContext();
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
  const software = /swiftshader|llvmpipe|software|basic render/i.test(gpu);

  return {
    software,
    setOffset: (x, y) => uniforms.uOffset.value.set(x, y),
    setMouse: (x, y) => {
      if (x === null || y === null) uniforms.uMouse.value.set(1e6, 1e6);
      else uniforms.uMouse.value.set(x - canvas.clientWidth / 2, y - canvas.clientHeight / 2);
    },
    resize,
    render: () => renderer.render(scene, camera),
    dispose: () => { plane.dispose(); geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose(); },
  };
}
