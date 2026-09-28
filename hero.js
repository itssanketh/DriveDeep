// Hero: the scroll-morph-hero React component, ported to plain DOM.
// Twenty photo cards scatter in, form a line, then a circle. Scrolling the page (instead of the
// original's captured wheel events) morphs the circle into an arch and sweeps it sideways.
// Each card springs toward its target (stiffness 40, damping 15, as in the original).
import { ERAS } from './eras.js';

const TOTAL = 20;
const K = 40, C = 15; // spring stiffness, damping (mass 1)
const KEYS = ['x', 'y', 'r', 's', 'o'];
// Cards are laid out at their largest (arch) size and scaled down, so they stay sharp when they grow.
const BIG = 1.8;
const lerp = (a, b, t) => a * (1 - t) + b * t;
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);

export function morphHero(stage, { reduce, onPick }) {
  const deck = stage.querySelector('.deck');
  const intro = stage.querySelector('.intro');
  const arcCopy = stage.querySelector('.arc-copy');

  // Three shots per car in date order, so the arch reads 1896 on the left to 2017 on the right.
  const shots = ERAS.flatMap((e, ei) => Array.from({ length: Math.min(e.shots, 3) }, (_, n) => ({ e, ei, n }))).slice(0, TOTAL);
  const cards = shots.map(({ e, ei, n }) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'card';
    b.setAttribute('aria-label', `${e.label}, ${e.name}`);
    b.innerHTML = `<span class="card-in"><span class="face"><img src="img/card/${e.id}-${n}.jpg" alt=""></span><span class="face back"><span>${e.label}</span></span></span>`;
    b.addEventListener('click', () => onPick(ei));
    deck.append(b);
    return b;
  });

  const scatter = cards.map(() => ({
    x: (Math.random() - 0.5) * 1500, y: (Math.random() - 0.5) * 1000, r: (Math.random() - 0.5) * 180, s: 0.6, o: 0,
  }));
  const pos = scatter.map((p) => ({ ...p }));
  const vel = cards.map(() => ({ x: 0, y: 0, r: 0, s: 0, o: 0 }));

  let phase = reduce ? 'circle' : 'scatter';
  if (!reduce) {
    setTimeout(() => (phase = 'line'), 500);
    setTimeout(() => (phase = 'circle'), 2500);
  }

  let W = stage.clientWidth, H = stage.clientHeight;
  addEventListener('resize', () => { W = stage.clientWidth; H = stage.clientHeight; });

  // Mouse parallax on the arch: +/-100px, eased.
  let mx = 0, mxs = 0;
  stage.addEventListener('pointermove', (ev) => { mx = ((ev.clientX / W) * 2 - 1) * 100; });

  const target = (i, morph, sweep) => {
    if (phase === 'scatter') return scatter[i];
    if (phase === 'line') return { x: i * 70 - (TOTAL * 70) / 2, y: 0, r: 0, s: 1, o: 1 };

    const mobile = W < 768;
    // A: circle
    const cr = Math.min(Math.min(W, H) * (mobile ? 0.42 : 0.35), 350);
    const cs = mobile ? 0.62 : 1; // smaller cards so a phone-sized ring doesn't pile up
    const ca = (i / TOTAL) * 360;
    const circle = { x: Math.cos((ca * Math.PI) / 180) * cr, y: Math.sin((ca * Math.PI) / 180) * cr, r: ca + 90 };
    // B: arch, apex below the centre, sweeping left as the page scrolls
    const ar = Math.min(W, H * 1.5) * (mobile ? 1.4 : 1.1);
    const acy = H * (mobile ? 0.35 : 0.25) + ar;
    const spread = mobile ? 100 : 130;
    const a = -90 - spread / 2 + i * (spread / (TOTAL - 1)) - sweep * spread * 0.8;
    const arc = {
      x: Math.cos((a * Math.PI) / 180) * ar + mxs, y: Math.sin((a * Math.PI) / 180) * ar + acy, r: a + 90, s: mobile ? 1.4 : 1.8,
    };
    return { x: lerp(circle.x, arc.x, morph), y: lerp(circle.y, arc.y, morph), r: lerp(circle.r, arc.r, morph), s: lerp(cs, arc.s, morph), o: 1 };
  };

  // p: 0..1 through the hero's scroll. The first quarter morphs, the rest sweeps the arch.
  return function update(p, dt) {
    const morph = clamp01(p / 0.25);
    const sweep = clamp01((p - 0.25) / 0.75);
    mxs += (mx - mxs) * Math.min(dt * 3, 1);

    const circleText = phase === 'circle' && morph < 0.5;
    intro.style.opacity = circleText ? 1 - morph * 2 : 0;
    intro.classList.toggle('on', circleText);
    const c = clamp01((morph - 0.8) / 0.2);
    arcCopy.style.opacity = c;
    arcCopy.style.transform = `translateY(${(1 - c) * 20}px)`;

    // Semi-implicit Euler in small steps keeps the springs stable on slow frames.
    const steps = Math.ceil(dt / (1 / 120));
    const h = dt / steps;
    cards.forEach((el, i) => {
      const t = target(i, morph, sweep), p0 = pos[i], v = vel[i];
      for (const k of KEYS) {
        if (reduce) { p0[k] = t[k]; continue; }
        for (let s = 0; s < steps; s++) {
          v[k] += (-K * (p0[k] - t[k]) - C * v[k]) * h;
          p0[k] += v[k] * h;
        }
      }
      el.style.transform = `translate3d(${p0.x.toFixed(1)}px, ${p0.y.toFixed(1)}px, 0) rotate(${p0.r.toFixed(2)}deg) scale(${(p0.s / BIG).toFixed(4)})`;
      el.style.opacity = clamp01(p0.o).toFixed(3);
    });
  };
}
