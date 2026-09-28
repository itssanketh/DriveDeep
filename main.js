import { animate, scroll, inView } from 'motion';
import Lenis from 'lenis';
import { ERAS } from './eras.js';
import { rollText } from './roll.js';
import { shaderBackground } from './shader.js';
import { morphHero } from './hero.js';
import { LOOK, TONED } from './look.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const N = ERAS.length;

// ---------- build ----------
const rail = document.getElementById('rail');
const years = document.getElementById('years');
const carsEl = document.getElementById('cars');
const scenes = document.getElementById('scenes');
const infos = document.getElementById('infos');
const steps = document.getElementById('steps');
const lineup = document.getElementById('lineup');
const footIndex = document.getElementById('foot-index');

ERAS.forEach((e, i) => {
  const nn = String(i + 1).padStart(2, '0');
  // Keep the copy to one line: the first sentence of each era's text.
  const line = e.text.split('. ')[0].replace(/\.?$/, '.');
  rail.append(h(`<li><a href="#${e.id}">${e.label}</a></li>`));
  steps.append(h(`<div id="${e.id}" class="step"></div>`));
  years.append(h(`<span>${e.label}</span>`));
  // .sheen is a light band masked to the car's own silhouette; it sweeps across as the car settles.
  // .shade darkens the car away from the light, masked to the silhouette like .sheen.
  const lk = LOOK[e.id];
  scenes.append(h(`<div class="scene" style="--lx:${lk.light[0]};--ly:${lk.light[1]};--tint:${e.tint};--tone:${lk.tone}"></div>`));
  carsEl.append(h(`<figure class="car" style="--tint:${e.tint};--f:${lk.filter};--scale:${lk.scale};--x:${lk.x}vw;--falloff:${lk.falloff}"><span class="body" style="--src:url(img/car/${e.id}.webp)"><img src="img/car/${e.id}.webp" alt="${e.name}"><i class="shade"></i><i class="sheen"></i></span></figure>`));
  // --k staggers each line as the car arrives; main.js drives --a (0..1) and --dir from the scroll.
  infos.append(h(`
  <article class="info" aria-labelledby="${e.id}-h">
    <div class="copy">
      <p class="label" style="--k:0"><span class="n">${nn}</span> ${e.theme}</p>
      <h2 id="${e.id}-h" style="--k:1">${e.name}</h2>
      <p class="text" style="--k:2">${line}</p>
    </div>
    <dl class="specs">
      ${e.specs.map(([k, v], j) => `<div style="--k:${j + 2}"><dt>${k}</dt><dd class="v" data-v="${v}">${v}</dd></div>`).join('')}
    </dl>
  </article>`));
  footIndex.append(h(`<li><a href="#${e.id}"><span class="label">${e.label}</span><span class="fi-name">${e.name}</span><span class="fi-arrow" aria-hidden="true">&rarr;</span></a></li>`));
  // Timeline milestones alternate above and below the rail.
  lineup.append(h(`<li class="ms ${i % 2 ? 'down' : 'up'}"><span class="stem"></span><span class="dot"></span><a href="#${e.id}"><span class="ln-year">${e.label}</span><span class="ln-name">${e.name}</span><img src="img/car/${e.id}.webp" alt="" loading="lazy"></a></li>`));
});
document.body.classList.toggle('toned', TONED);
const sceneEls = [...scenes.children], carEls = [...carsEl.children], yearEls = [...years.children], infoEls = [...infos.children];

// ---------- letter roll ----------
document.querySelectorAll('.wordmark, #rail a').forEach((el) => rollText(el, { hover: true, center: true }));
document.querySelectorAll('.info h2').forEach((el) => rollText(el));

// ---------- background ----------
const bg = document.getElementById('bg');
shaderBackground(bg, { still: reduce });

// ---------- smooth scroll ----------
const lenis = reduce ? null : new Lenis({ lerp: 0.09 });
const goTo = (y) => (lenis ? lenis.scrollTo(y, { duration: 1.8 }) : scrollTo(0, y));
document.addEventListener('click', (ev) => {
  const a = ev.target.closest('a[href^="#"]');
  if (!a) return;
  const target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  ev.preventDefault();
  goTo(target.getBoundingClientRect().top + scrollY);
  history.replaceState(null, '', a.getAttribute('href'));
});

scroll((p) => document.documentElement.style.setProperty('--p', p.toFixed(4)));

// ---------- hero ----------
const hero = document.getElementById('hero');
const show = document.getElementById('show');
const updateHero = morphHero(hero.querySelector('.hero-stick'), {
  reduce,
  onPick: (i) => goTo(document.getElementById(ERAS[i].id).getBoundingClientRect().top + scrollY),
});

// ---------- showroom ----------
// pos: which car is centred, as a float; everything below is a pure function of it, so the
// motion is scrubbed by the (Lenis-smoothed) scroll and never plays on its own.
// Hand-off between two cars is a rack focus: the leaving car drifts on, blurs, darkens and loses
// its colour while the next one comes out of the dark into focus. Their fades overlap, so there is
// never an empty frame and never a hard cut. While a car is centred it keeps a slow dolly push-in.
// MOVES[i] is where car i comes from (x, y in screens, z in px, r* in degrees): small, so it
// reads as a camera move rather than a slide. The leaving car heads the opposite way to the one
// arriving, at 60% of the distance.
const MOVES = [
  { z: -900, ry: -10 },              // first car: out of the dark
  { x: 0.32, ry: -12 },              // from the right
  { y: 0.26, rx: 10 },               // rising from below
  { z: -1400, ry: 14 },              // from deep in the room
  { y: -0.24, rz: -3 },              // settling down from above
  { x: -0.32, ry: 12 },              // from the left
  { x: 0.24, y: 0.2, z: -500, rz: 3 }, // diagonal, from below right
  { z: -900 },                       // after the last car: it drifts toward you and dissolves
];
const ease = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2); // in-out cubic
const HOLD = 0.4; // extra screens the last car stays put
const railLinks = [...rail.querySelectorAll('a')];
const countN = document.getElementById('count-n');
let active = -2;

const setActive = (i) => {
  if (i === active) return;
  active = i;
  railLinks.forEach((a, k) => (k === i ? a.setAttribute('aria-current', 'step') : a.removeAttribute('aria-current')));
  infoEls.forEach((el, k) => el.classList.toggle('on', k === i));
  if (i < 0) return;
  countN.textContent = String(i + 1).padStart(2, '0');
  // Spec numbers count up from zero each time their car arrives, keeping their units.
  infoEls[i].querySelectorAll('.v').forEach((v) => {
    const m = v.dataset.v.match(/^([\d,.]+)(.*)$/);
    if (!m || reduce) return;
    const n = parseFloat(m[1].replace(/,/g, ''));
    const dp = (m[1].split('.')[1] || '').length;
    animate(0, n, { duration: 1.4, delay: 0.25, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => {
      v.textContent = x.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp, useGrouping: m[1].includes(',') }) + m[2];
    } });
  });
};

const renderShow = (pos) => {
  const vw = innerWidth, vh = innerHeight;
  carEls.forEach((car, i) => {
    const t = pos - i;
    const info = infoEls[i];
    if (Math.abs(t) >= 0.95) {
      car.style.visibility = yearEls[i].style.visibility = info.style.visibility = sceneEls[i].style.visibility = 'hidden';
      return;
    }
    car.style.visibility = yearEls[i].style.visibility = info.style.visibility = sceneEls[i].style.visibility = '';
    // arrive: 0 -> 1 over t in [-.85, -.1]; leave, a little quicker: 0 -> 1 over t in [.1, .7].
    // At the midpoint the old car is nearly gone and the new one is coming into focus.
    const arrive = ease(clamp((t + 0.85) / 0.75, 0, 1));
    const leave = ease(clamp((t - 0.1) / 0.6, 0, 1));
    const m = t < 0 ? MOVES[i] : MOVES[i + 1];
    const k = t < 0 ? 1 - arrive : -0.6 * leave; // share of the move still to go (or gone)
    const off = 1 - arrive + leave; // 0 in focus, 1 fully out of focus
    const x = (m.x || 0) * k * vw - t * vw * 0.03; // plus the slow dolly drift
    const y = (m.y || 0) * k * vh;
    const z = t < 0 ? (m.z || 0) * k : Math.abs((m.z || 0) * k) * 0.5 + leave * 160;
    const s = 1 + (0.5 - Math.abs(t)) * 0.05;
    car.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${((m.rx || 0) * k).toFixed(2)}deg) rotateY(${((m.ry || 0) * k).toFixed(2)}deg) rotateZ(${((m.rz || 0) * k).toFixed(2)}deg) scale(${s.toFixed(4)})`;
    car.style.filter = off > 0.002 ? `blur(${(off * 16).toFixed(2)}px) brightness(${(1 - off * 0.8).toFixed(3)}) saturate(${(1 - off * 0.9).toFixed(3)})` : '';
    car.style.opacity = clamp(1.25 - off * 1.4, 0, 1).toFixed(3);
    // Light sweep across the paint during the last stretch of the arrival.
    car.style.setProperty('--sweep', (clamp((arrive - 0.55) / 0.45, 0, 1) * (1 - leave)).toFixed(4));

    // The year sits deeper in the room: same direction, a third of the distance, its own soft focus.
    yearEls[i].style.transform = `translate3d(${(x * 0.35).toFixed(1)}px, ${(y * 0.35).toFixed(1)}px, 0) scale(${(1 + (1 - arrive) * 0.12 - leave * 0.08).toFixed(4)})`;
    yearEls[i].style.opacity = clamp(1 - off * 1.6, 0, 1).toFixed(3);
    yearEls[i].style.filter = off > 0.002 ? `blur(${(off * 10).toFixed(2)}px)` : '';

    // The car's light (and tone) crossfades with it but stays put: it belongs to the room.
    sceneEls[i].style.opacity = clamp(1 - off * 1.2, 0, 1).toFixed(3);

    // Copy: scrubbed in with the car, rising from below as it arrives and lifting away as it leaves.
    info.style.setProperty('--a', clamp(1 - off * 1.5, 0, 1).toFixed(4));
    info.style.setProperty('--dir', t < 0 ? 1 : -1);
  });
  setActive(pos > -0.5 && pos < N - 0.5 ? clamp(Math.round(pos), 0, N - 1) : -1);
};

// ---------- finale: a pinned timeline that scrolls sideways ----------
// Inspired by 21st.dev's Product Timeline. Scrolling down slides the track left; the rail fills
// with the accent as you go, and each milestone's stem grows out of the rail and its car rises in
// as it enters from the right (--r, 0..1, scrubbed). The section is as tall as the sideways run.
const finale = document.getElementById('finale');
const track = document.getElementById('track');
const railFill = document.getElementById('rail-fill');
const msEls = [...lineup.querySelectorAll('.ms')];
let run = 0;
const sizeFinale = () => {
  run = Math.max(track.scrollWidth - innerWidth, 0);
  finale.style.height = `${run + innerHeight * 1.25}px`; // + a short hold at the end
};
sizeFinale();
addEventListener('resize', sizeFinale);
addEventListener('load', sizeFinale); // images change the track width

const renderFinale = (y, vh) => {
  const top = finale.offsetTop;
  if (y < top - vh || y > top + finale.offsetHeight) return;
  const p = clamp((y - top) / Math.max(run, 1), 0, 1);
  track.style.transform = `translate3d(${(-p * run).toFixed(1)}px, 0, 0)`;
  railFill.style.transform = `scaleX(${p.toFixed(4)})`;
  const vw = innerWidth;
  msEls.forEach((ms) => {
    const x = ms.offsetLeft + lineup.offsetLeft - p * run; // left edge on screen
    ms.style.setProperty('--r', clamp((vw * 0.95 - x) / (vw * 0.4), 0, 1).toFixed(4));
  });
};

// ---------- footer ----------
// The giant wordmark rises letter by letter (--k staggers them) the first time the footer shows.
const footMark = document.getElementById('foot-mark');
footMark.innerHTML = [...footMark.textContent].map((c, k) => `<span style="--k:${k}">${c}</span>`).join('');
inView('.foot', (el) => { el.classList.add('is-in'); }, { amount: 0.25 });

// ---------- one loop for everything scroll-driven ----------
let last = performance.now();
const frame = (now) => {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  lenis?.raf(now);
  const vh = innerHeight, y = scrollY;

  // Hero: cards keep springing even without scrolling, but only while on screen.
  const heroTop = hero.offsetTop, heroRun = hero.offsetHeight - vh;
  if (y < heroTop + heroRun + vh) updateHero(clamp((y - heroTop) / heroRun, 0, 1), dt);

  const showTop = show.offsetTop;
  let raw = (y - showTop) / vh;
  raw = raw < N - 1 ? raw : raw < N - 1 + HOLD ? N - 1 : raw - HOLD;
  renderShow(clamp(raw, -1, N));

  renderFinale(y, vh);

  // Dim the rings once the cars take over, so the cars are the brightest thing on screen.
  bg.style.opacity = (1 - clamp((y - showTop + vh) / vh, 0, 1) * 0.45).toFixed(3);
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);

// ---------- intro ----------
if (!reduce) {
  animate('.top', { y: [-40, 0], opacity: [0, 1] }, { delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] });
}

// ---------- pointer ----------
if (fine && !reduce) {
  // Rail years pull toward the pointer.
  railLinks.forEach((a) => {
    a.addEventListener('pointermove', (ev) => {
      const r = a.getBoundingClientRect();
      a.style.transform = `translate(${(ev.clientX - r.left - r.width / 2) * 0.35}px, ${(ev.clientY - r.top - r.height / 2) * 0.45}px)`;
    });
    a.addEventListener('pointerleave', () => { a.style.transform = ''; });
  });
}
