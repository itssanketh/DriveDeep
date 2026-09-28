// Letter roll, ported from the animated-menu React component to plain DOM + CSS.
// Each letter is two stacked copies. On hover the top copy slides up and out while the bottom copy
// slides in, staggered 35 ms per letter (from the centre outward when `center` is set).
// Without `hover`, only the top copy is used and the letters roll up into place when revealed.
const STAGGER = 35;

export function rollText(el, { hover = false, center = false } = {}) {
  const text = el.textContent.trim();
  const n = text.length;
  const delay = (i) => `${Math.round(center ? STAGGER * Math.abs(i - (n - 1) / 2) : STAGGER * i)}ms`;

  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = text;
  const vis = document.createElement('span');
  vis.className = hover ? 'roll roll-hover' : 'roll roll-in';
  vis.setAttribute('aria-hidden', 'true');

  let i = 0;
  // Split on spaces and after hyphens so long names like "Mercedes-Benz" can still wrap.
  text.split(' ').forEach((word, wi) => {
    if (wi) { vis.append(' '); i++; }
    word.split(/(?<=-)/).forEach((part, pi) => {
      if (pi) vis.append(document.createElement('wbr'));
      const w = document.createElement('span');
      w.className = 'roll-word';
      const layers = hover ? ['roll-a', 'roll-b'] : ['roll-a'];
      const start = i;
      for (const cls of layers) {
        const layer = document.createElement('span');
        layer.className = cls;
        [...part].forEach((c, k) => {
          const l = document.createElement('span');
          l.textContent = c;
          l.style.setProperty('--d', delay(start + k));
          layer.append(l);
        });
        w.append(layer);
      }
      i += part.length;
      vis.append(w);
    });
  });
  el.replaceChildren(sr, vis);
}
