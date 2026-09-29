import Lenis from 'lenis';
import { ERAS } from './eras.js';
import { rollText } from './roll.js';
import { shaderBackground } from './shader.js';
import { morphHero } from './hero.js';
import { LOOK } from './look.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
// Phones and tablets: smaller photos, fewer particles, lighter blurs, lower-res rings.
const lite = matchMedia('(pointer: coarse), (max-width: 900px)').matches;
const SM = lite ? '-sm' : ''; // img/car/<id>-sm.webp is the 1200px-wide copy
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const N = ERAS.length;

// ---------- build ----------
const rail = document.getElementById('rail');
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
  const lk = LOOK[e.id];
  const theme = `--bg:${lk.bg};--ink:${lk.ink};--c1:${lk.c1};--c2:${lk.c2}`;
  // Each car's poster: paper, two livery stripes, drifting particles and floor fog.
  // ponytail: particles are random per load; fixed seeds if the layout ever needs to be stable.
  const motes = Array.from({ length: lite ? 8 : lk.motes === 'air' ? 16 : 22 }, () => {
    const r = Math.random;
    return `<i style="--mx:${(r() * 100).toFixed(1)}%;--my:${(r() * 100).toFixed(1)}%;--ms:${(0.4 + r() * 1.6).toFixed(2)};--md:${(lk.motes === 'air' ? 1 + r() * 1.8 : 9 + r() * 12).toFixed(2)}s;--mo:${(-r() * 20).toFixed(2)}s"></i>`;
  }).join('');
  scenes.append(h(`<div class="scene" style="${theme}"><div class="scene-in"><i class="stripe s1"></i><i class="stripe s2"></i><b class="word" style="--len:${e.word.length}">${e.word}</b><span class="motes ${lk.motes}">${motes}</span><i class="fog"></i></div></div>`));
  // .sheen is a light band masked to the car's own silhouette; it sweeps across as the car settles.
  // .shade darkens the car away from the light, masked to the silhouette like .sheen.
  carsEl.append(h(`<figure class="car" style="--f:${lk.filter};--scale:${lk.scale};--x:${lk.x}vw;--falloff:${lk.falloff}"><span class="body" style="--src:url(img/car/${e.id}-sm.webp)"><img class="shadow" src="img/shadow/${e.id}.webp" alt=""><img src="img/car/${e.id}${SM}.webp" alt="${e.name}"><i class="shade"></i><i class="sheen"><b></b></i></span></figure>`));
  // --k staggers each line as the car arrives; main.js drives --a (0..1) and --dir from the scroll.
  infos.append(h(`
  <article class="info" style="${theme}" aria-labelledby="${e.id}-h">
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
  lineup.append(h(`<li class="ms ${i % 2 ? 'down' : 'up'}"><span class="stem"></span><span class="dot"></span><a href="#${e.id}"><span class="ln-year">${e.label}</span><span class="ln-name">${e.name}</span><img src="img/car/${e.id}-sm.webp" alt="" decoding="async"></a></li>`));
});
const sceneEls = [...scenes.children], sceneIns = sceneEls.map((el) => el.firstChild), carEls = [...carsEl.children], yearEls = sceneEls.map((el) => el.querySelector('.word')), infoEls = [...infos.children];

// ---------- letter roll ----------
document.querySelectorAll('.wordmark, #rail a').forEach((el) => rollText(el, { hover: true, center: true }));
document.querySelectorAll('.info h2').forEach((el) => rollText(el));

// ---------- background ----------
const bg = document.getElementById('bg');
const shader = shaderBackground(bg, { still: reduce, maxDpr: lite ? 1 : 1.25 });

// ---------- smooth scroll ----------
// The wheel scrolls as fast as it is turned, up to a ceiling: the scroll target may only run LEAD
// screens ahead of the page. Lenis closes about lerp * 60 of that gap per second, so the top speed
// is about 0.9 * 0.1 * 60 = 5 screens per second; only a violent fling ever reaches it.
// Touch scrolling stays native (syncTouch off): the phone's own momentum scrolling runs off the
// main thread and is the smoothest there is.
const LEAD = 0.9;
const lenis = reduce ? null : new Lenis({
  lerp: 0.1,
  virtualScroll: (d) => {
    const max = innerHeight * LEAD;
    const lead = lenis.targetScroll - lenis.animatedScroll;
    d.deltaY = clamp(lead + d.deltaY, -max, max) - lead;
  },
});
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

const barEl = document.getElementById('bar');

// ---------- hero ----------
const hero = document.getElementById('hero');
const show = document.getElementById('show');
// ---------- loader ----------
// Nothing is shown until every image on the page (car photos, shadows, hero cards, line-up, and
// the silhouettes used as masks) and every font is downloaded and decoded, so scrolling never
// waits on the network or on an image decode. A stuck file can't hold the page hostage: after
// LOAD_MAX ms it opens anyway.
const LOAD_MAX = 15000;
const loadFill = document.getElementById('load-fill');
const loaded = (() => {
  const jobs = [...document.images].map((img) => img.decode().catch(() => {}));
  const masks = new Set([...document.querySelectorAll('.body')].map((b) => b.style.getPropertyValue('--src').slice(4, -1)));
  masks.forEach((src) => { const img = new Image(); img.src = src; jobs.push(img.decode().catch(() => {})); });
  jobs.push(document.fonts.ready);
  let done = 0;
  jobs.forEach((j) => j.then(() => { loadFill.style.transform = `scaleX(${(++done / jobs.length).toFixed(3)})`; }));
  return Promise.race([Promise.all(jobs), new Promise((r) => setTimeout(r, LOAD_MAX))]);
})();
lenis?.stop();
const ready = loaded.then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))).then(() => {
  document.documentElement.classList.add('ready');
  lenis?.start();
});

const updateHero = morphHero(hero.querySelector('.hero-stick'), {
  reduce,
  ready,
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
  { x: 0.3, ry: -10 },               // from the right
  { z: -1200, ry: 12 },              // from deep in the room
  { y: 0.24, rx: 8 },                // rising from below
  { x: -0.3, ry: 12 },               // from the left
  { x: -0.22, y: -0.18, ry: 10 },    // diagonal, from above left
  { z: -900 },                       // after the last car: it drifts toward you and dissolves
];
const ease = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2); // in-out cubic
const BLUR = lite ? 4 : 9; // px of rack-focus blur at full defocus
const HOLD = 0.4; // extra screens the last car stays put
const railLinks = [...rail.querySelectorAll('a')];
const sheens = carEls.map((c) => c.querySelector('.sheen')), sheenBands = sheens.map((el) => el.firstChild);
const countN = document.getElementById('count-n');
document.getElementById('count-total').textContent = String(N).padStart(2, '0');
let active = -2;

const setActive = (i) => {
  if (i === active) return;
  active = i;
  railLinks.forEach((a, k) => (k === i ? a.setAttribute('aria-current', 'step') : a.removeAttribute('aria-current')));
  infoEls.forEach((el, k) => el.classList.toggle('on', k === i));
  document.body.classList.toggle('lit', i >= 0);
  if (i < 0) return;
  countN.textContent = String(i + 1).padStart(2, '0');
  // Spec numbers count up from zero each time their car arrives, keeping their units.
  infoEls[i].querySelectorAll('.v').forEach((v) => {
    const m = v.dataset.v.match(/^([\d,.]+)(.*)$/);
    if (!m || reduce) return;
    const n = parseFloat(m[1].replace(/,/g, ''));
    const dp = (m[1].split('.')[1] || '').length;
    const fmt = (x) => x.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp, useGrouping: m[1].includes(',') }) + m[2];
    const t0 = performance.now() + 250;
    const step = (now) => {
      const k = clamp((now - t0) / 1400, 0, 1);
      v.textContent = fmt(n * (1 - Math.pow(1 - k, 4))); // ease-out
      if (k < 1 && active === i) requestAnimationFrame(step); else v.textContent = fmt(n);
    };
    requestAnimationFrame(step);
  });
};

// Each car is one of three states: 'off' (display none: nothing to paint), 'warm' (rendered but
// transparent, one car either side of the visible ones, so its photo is decoded and rasterised
// before it arrives and the hand-off never stalls on it) or 'on'.
const state = carEls.map(() => '');
const setState = (i, st) => {
  if (state[i] === st) return;
  state[i] = st;
  for (const el of [carEls[i], sceneEls[i], infoEls[i]]) el.style.display = st === 'off' ? 'none' : '';
  // A warm car stays "visible" at opacity 0 (it has will-change: opacity), so the browser paints it.
  for (const el of [sceneEls[i], infoEls[i]]) el.style.visibility = st === 'warm' ? 'hidden' : '';
  // Cheap to keep composited, but no reason to animate particles nobody can see.
  sceneEls[i].classList.toggle('live', st === 'on');
  if (st === 'warm') { carEls[i].style.opacity = '0'; sceneEls[i].style.transform = `translate3d(${innerWidth * 1.4}px, 0, 0)`; }
};
let covered = false; // an opaque poster fills the screen: the shader behind it can rest

const renderShow = (pos) => {
  const vw = innerWidth, vh = innerHeight;
  covered = false;
  carEls.forEach((car, i) => {
    const t = pos - i;
    const info = infoEls[i];
    if (Math.abs(t) >= 0.95) {
      setState(i, Math.abs(t) < 1.95 ? 'warm' : 'off');
      return;
    }
    setState(i, 'on');
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
    car.style.filter = off > 0.002 ? `blur(${(off * BLUR).toFixed(1)}px) saturate(${(1 - off * 0.9).toFixed(2)})` : '';
    car.style.opacity = clamp(1.25 - off * 1.4, 0, 1).toFixed(3);
    // Light sweep across the paint during the last stretch of the arrival.
    const sw = clamp((arrive - 0.55) / 0.45, 0, 1) * (1 - leave);
    sheens[i].style.opacity = Math.sin(sw * Math.PI).toFixed(3);
    sheenBands[i].style.transform = `translate3d(${(-100 + sw * 267).toFixed(1)}%, 0, 0)`;

    // The word sits deeper in the room: same direction, a third of the distance, its own soft focus.
    yearEls[i].style.transform = `translate3d(${(x * 0.35).toFixed(1)}px, ${(y * 0.35).toFixed(1)}px, 0) scale(${(1 + (1 - arrive) * 0.12 - leave * 0.08).toFixed(4)})`;
    yearEls[i].style.opacity = clamp(1 - off * 1.6, 0, 1).toFixed(3);
    if (!lite) yearEls[i].style.filter = off > 0.002 ? `blur(${(off * 6).toFixed(1)}px)` : '';

    // The poster wipes in on a diagonal, parallel to its stripes, over the one before; the
    // stripes slide in along their own axis a beat behind.
    // Done with transforms only (no clip-path, which repaints): the scene is a skewed window that
    // slides in from the right, and its contents are counter-transformed so they stay put.
    const edge = ((1 - arrive) * 1.35 - 0.1) * vw; // px from the left where the wipe edge meets the top
    const skew = -Math.atan((0.25 * vw) / vh) * 57.2958; // edge runs 25% of the width left, top to bottom
    sceneEls[i].style.transform = arrive < 1 ? `translate3d(${edge.toFixed(1)}px, 0, 0) skewX(${skew.toFixed(3)}deg)` : '';
    sceneIns[i].style.transform = arrive < 1 ? `skewX(${(-skew).toFixed(3)}deg) translate3d(${(-edge).toFixed(1)}px, 0, 0)` : '';
    if (arrive >= 1) covered = true;
    sceneEls[i].style.setProperty('--in', ease(clamp((arrive - 0.3) / 0.7, 0, 1)).toFixed(4));

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
let msX = [];
const sizeFinale = () => {
  track.style.transform = '';
  run = Math.max(track.scrollWidth - innerWidth, 0);
  finale.style.height = `${run + steps.firstChild.offsetHeight * 1.25}px`; // + a short hold at the end
  msX = msEls.map((ms) => ms.offsetLeft + lineup.offsetLeft);
  measure();
};
// Section offsets, read only when the layout changes (reading them every frame, after the frame's
// style writes, forced a synchronous layout on every frame).
const at = {};
function measure() {
  // One screen, in the same px the sections were sized in (CSS 100vh). On phones innerHeight
  // changes as the address bar slides away; the scroll maths must not, or the cars jump.
  at.vh = steps.firstChild.offsetHeight;
  at.hero = hero.offsetTop; at.heroH = hero.offsetHeight;
  at.show = show.offsetTop;
  at.finale = finale.offsetTop; at.finaleH = finale.offsetHeight;
  at.max = document.documentElement.scrollHeight - innerHeight;
  dirty = true;
}
let dirty = true;
sizeFinale();
let lastW = innerWidth;
addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; sizeFinale(); } else measure(); });
addEventListener('load', sizeFinale); // images change the track width
new ResizeObserver(() => measure()).observe(document.body);

const renderFinale = (y, vh) => {
  const top = at.finale;
  if (y < top - vh || y > top + at.finaleH) return;
  const p = clamp((y - top) / Math.max(run, 1), 0, 1);
  track.style.transform = `translate3d(${(-p * run).toFixed(1)}px, 0, 0)`;
  railFill.style.transform = `scaleX(${p.toFixed(4)})`;
  const vw = innerWidth;
  msEls.forEach((ms, k) => {
    const x = msX[k] - p * run; // left edge on screen
    ms.style.setProperty('--r', clamp((vw * 0.95 - x) / (vw * 0.4), 0, 1).toFixed(4));
  });
};

// ---------- footer ----------
// The giant wordmark rises letter by letter (--k staggers them) the first time the footer shows.
const footMark = document.getElementById('foot-mark');
footMark.innerHTML = [...footMark.textContent].map((c, k) => `<span style="--k:${k}">${c}</span>`).join('');
const footIO = new IntersectionObserver(([en]) => {
  if (en.isIntersecting) { en.target.classList.add('is-in'); footIO.disconnect(); }
}, { threshold: 0.25 });
footIO.observe(document.querySelector('.foot'));

// ---------- one loop for everything scroll-driven ----------
let last = performance.now(), lastY = NaN;
const frame = (now) => {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  lenis?.raf(now);
  const vh = at.vh, y = scrollY;

  // Hero: cards keep springing even without scrolling, but only while on screen.
  const heroRun = at.heroH - vh;
  if (y < at.hero + heroRun + vh) updateHero(clamp((y - at.hero) / heroRun, 0, 1), dt);

  // Everything else is a pure function of the scroll position: nothing to do while it rests.
  if (y !== lastY || dirty) {
    lastY = y; dirty = false;
    barEl.style.transform = `scaleX(${clamp(y / Math.max(at.max, 1), 0, 1).toFixed(4)})`;
    let raw = (y - at.show) / vh;
    raw = raw < N - 1 ? raw : raw < N - 1 + HOLD ? N - 1 : raw - HOLD;
    renderShow(clamp(raw, -1, N));
    renderFinale(y, vh);
    // Dim the rings once the cars take over, and stop drawing them while a poster hides them.
    bg.style.opacity = (1 - clamp((y - at.show + vh) / vh, 0, 1) * 0.45).toFixed(3);
    shader?.run(!covered && y < at.finale + at.finaleH);
  }
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);

// No hover on touch screens.
if (!fine) document.querySelector('.lede').textContent = 'Twelve Fords. Tap a card to meet the car.';

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
