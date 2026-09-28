// Background: the shader-animation React component, ported to plain three.js.
// A full-screen quad whose fragment shader draws the drifting rainbow rings.
import * as THREE from 'three';

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  #define TWO_PI 6.2831853072
  #define PI 3.14159265359

  precision highp float;
  uniform vec2 resolution;
  uniform float time;

  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float t = time * 0.05;
    float lineWidth = 0.002;

    vec3 color = vec3(0.0);
    for (int j = 0; j < 3; j++) {
      for (int i = 0; i < 5; i++) {
        color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
      }
    }

    gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
  }
`;

export function shaderBackground(container, { still = false } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
  } catch {
    return; // no WebGL: the page background stays plain black
  }
  // The shader runs per pixel; 1.5x is indistinguishable from 2x here and much cheaper on retina screens.
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  const camera = new THREE.Camera();
  camera.position.z = 1;
  const scene = new THREE.Scene();
  const uniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
  };
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })));

  const resize = () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
    if (still) renderer.render(scene, camera);
  };
  resize();
  addEventListener('resize', resize);

  if (still) return;
  let last = performance.now();
  const loop = (now) => {
    // Same speed as the original (0.05 per frame at 60 fps), but independent of refresh rate.
    uniforms.time.value += 0.05 * Math.min((now - last) / 16.67, 4);
    last = now;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
