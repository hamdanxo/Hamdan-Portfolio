import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from 'three';
import { liquidFragment, liquidVertex } from './liquidShader';

export type LiquidScene = { renderer: WebGLRenderer; draw: (seconds: number) => void; resize: () => void; dispose: () => void };

/** Builds the full-screen shader scene. Throws if WebGL is unavailable. */
export function createLiquidScene(canvas: HTMLCanvasElement, pixelRatio: number): LiquidScene {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
  const uniforms = { uRes: { value: new Vector2(1, 1) }, uTime: { value: 0 } };
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new PlaneGeometry(2, 2);
  const material = new ShaderMaterial({ vertexShader: liquidVertex, fragmentShader: liquidFragment, uniforms, depthTest: false, depthWrite: false });
  scene.add(new Mesh(geometry, material));
  renderer.setPixelRatio(pixelRatio);

  const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.getDrawingBufferSize(uniforms.uRes.value);
  };
  resize();

  return {
    renderer,
    resize,
    draw: (seconds) => { uniforms.uTime.value = seconds; renderer.render(scene, camera); },
    dispose: () => { geometry.dispose(); material.dispose(); renderer.dispose(); },
  };
}
