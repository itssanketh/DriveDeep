// Background: the shader-animation React component, ported to plain WebGL (no three.js: the whole
// thing is one full-screen triangle, and dropping the library saves phones 1.3 MB of script).
// The fragment shader draws the drifting rainbow rings.
const vertexShader = `
  attribute vec2 p;
  void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const fragmentShader = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif
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

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function shaderBackground(container, { still = false, maxDpr = 1.25 } = {}) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { antialias: false, depth: false, stencil: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) return null; // no WebGL: the page background stays plain black
  container.appendChild(canvas);

  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vertexShader));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fragmentShader));
  gl.bindAttribLocation(prog, 0, 'p');
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'resolution'), uTime = gl.getUniformLocation(prog, 'time');
  let time = 1;
  const draw = () => { gl.uniform1f(uTime, time); gl.drawArrays(gl.TRIANGLES, 0, 3); };

  // The rings are soft glows, so rendering them at up to maxDpr (1.25 desktop, 1 on phones) is
  // indistinguishable from full retina and a fraction of the pixels.
  const resize = () => {
    const r = Math.min(devicePixelRatio, maxDpr);
    canvas.width = Math.round(container.clientWidth * r);
    canvas.height = Math.round(container.clientHeight * r);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    draw();
  };
  resize();
  addEventListener('resize', resize);

  if (still) return { run() {} };
  // run(false) parks the loop (nothing is drawn while an opaque section covers the rings);
  // run(true) picks it up again where it left off.
  let on = false, last = 0;
  const loop = (now) => {
    if (!on) return;
    // Same speed as the original (0.05 per frame at 60 fps), but independent of refresh rate.
    time += 0.05 * Math.min((now - last) / 16.67, 4);
    last = now;
    draw();
    requestAnimationFrame(loop);
  };
  return {
    run(v) {
      if (v === on) return;
      on = v;
      if (on) requestAnimationFrame((now) => { last = now; loop(now); });
    },
  };
}
