# Design System: Drivedeep

## 1. Theme
Twelve Fords, 1896 to 2025 (Quadricycle, Model T, '32 V8, Thunderbird, Mustang, GT40 Mk II, Ford GT,
Shelby GT500, Mustang Mach-E, GT Mk IV, Mustang Dark Horse, Mustang GTD):
one maker, so the line-up reads as one family evolving.
Dark showroom. A live WebGL shader (drifting rainbow rings, `shader.js`, ported from the
21st.dev shader-animation) fills the page background; the cars are cut-out three-quarter studio shots
with no backdrop (`img/car/<id>.webp`, all nose front-left), so they read as solid objects and the car is the only thing on stage.

Loader: a full-screen wordmark and accent progress line covers the page until every image (car
photos, masks, shadows, 24 hero cards, two per car, line-up) and font is downloaded and decoded (15s safety
timeout); then it fades, the header drops in and the hero intro starts.

## 2. Color
- **Bg** #0A0A0A (behind the shader), **Ink** #EDEDED, **Mute** ink at 62%, **Faint** ink at 38%
- **Line** ink at 14% - spec rules and the line-up
- **Accent** #FF5A47 - chapter numbers, scroll bar, focus
- Showroom: each car has its own light poster palette (look.js `bg`, `ink`, `c1`, `c2`) taken from its paint and trim;
  inside the showroom text turns dark and `c2` is the accent

## 3. Type
Cormorant Garamond 300 for headlines and spec values. Anton for the giant model name behind each car.
Jost 300 for body. Labels are Jost 400, .72rem, uppercase, .22em tracking.

## 4. Layout
- Header: tracked wordmark left, era years right (hidden below 1100px), 1px accent scroll bar on top.
- Hero (400vh, sticky; `hero.js`, ported scroll-morph-hero): 20 photo cards (`img/card/`) scatter in,
  line up, form a ring around the headline. Scrolling morphs the ring into an arch and sweeps it
  left; hovering a card flips it to its year, clicking jumps to that car.
- Showroom (1240vh, one sticky stage): each car sits on its own poster (after a car-poster reference):
  tinted paper, the model name huge in Anton behind it (`word` in eras.js), two diagonal livery
  stripes on the right, drifting particles (`motes`: dust for the early cars, wind-tunnel air lines for
  the later ones) and white floor fog. The car, right of centre, stands on a ground shadow (`img/shadow/<id>.webp`, from
  `tools/shadow.py`: dark contacts under each visible tyre, the footprint between them, a soft cast
  shadow back-right), name and one sentence bottom-left, three specs bottom-right, `05 / 12` top-right; header and counter use
  mix-blend-mode: difference over the posters so they read on paper and stripes alike.
- Finale: a pinned timeline that scrolls sideways (after 21st.dev's Product Timeline): a hairline rail
  fills with the accent as you scroll; the twelve cars alternate above and below it on accent dots, each
  stem growing from the rail and its year, name and car rising in (scrubbed) as it enters from the right.
- Footer: closing line and back-to-top, a two-column hairline index of the twelve cars (hover slides
  the name and shows an accent arrow), credit line, and a giant faint serif "Drivedeep" cropped by the
  bottom of the page that rises letter by letter.
- Below 900px: copy moves to the top, specs to the bottom; timeline milestones get wider.

Per-car tuning (photo filter, scale, offset, light, falloff, tone) lives in `look.js`. Cutouts are high-res studio shots (1850 to 2300px wide), cut with rembg birefnet-general and choked
1px; no dark rim, since the posters are light. Where a photo showed its surroundings through glass (the V8
windscreen), that area is made clear glass so the poster shows through.

## 5. Motion
One rAF loop in main.js reads scrollY (wheel smoothed by Lenis, lerp .1). The wheel scrolls as fast
as it's turned up to a ceiling: the Lenis target may run at most 0.9 screens ahead of the page, about
5 screens per second. Touch scrolling is native (the phone's own momentum, off the main thread).

Performance rules (the site holds the display's refresh rate on an integrated GPU):
- Nothing reads layout inside the loop; section offsets are cached on resize (ResizeObserver).
- Scroll-driven work runs only when scrollY changes; only the hero springs tick while at rest.
- Everything that moves per frame is a composited transform, opacity or filter (poster wipe = a
  skewed window with counter-transformed contents, not clip-path; sheen = a sliding band, not
  background-position). Nothing sets custom properties on :root.
- Each car is off (display none), warm (painted at opacity 0, one car either side of the visible
  ones, so its photo is decoded and rasterised before it arrives) or on. All photos are pre-decoded.
- The WebGL rings stop drawing while an opaque poster covers them. Particles only animate in the
  visible poster, and get their softness from gradients rather than filter: blur.
- Blur radii are modest (car 9px, word 6px, copy 4px) and the car's layer is the photo's own size.
- No libraries beyond Lenis: the rings are raw WebGL (one triangle), count-ups and the footer reveal
  are a few lines of JS, the header intro is a CSS animation.
- Phones (coarse pointer or <=900px) get a lite profile: 1200px car photos (`img/car/<id>-sm.webp`,
  also used for masks and the line-up everywhere), 8 particles, rack-focus blur 4px, no blur on the
  word or copy, rings at 1x. Shadows are stored at half size. The scroll maths uses CSS 100vh, not
  innerHeight, so the address bar sliding away doesn't make the cars jump. Cards are springs (k 40, c 15).
Showroom `pos` is a float car index and every property is a pure function of it (scrubbed by
Lenis, never timed). Hand-offs are a rack focus, after the 21st.dev depth-fade/tunnel components:
the leaving car drifts on and goes out of focus (blur, dark, desaturated) while the next comes out of
the dark into focus, overlapping so there is no empty frame. Each car arrives from its own direction
(MOVES in main.js: depth, right, below, deep, above, left, diagonal) but only a third of a screen
away, so it reads as a camera move. A slow dolly (drift + push-in) means nothing ever stops dead, and
a light sweep masked to the car's silhouette crosses the paint as it settles. Each poster wipes in on a diagonal parallel to its stripes, over the one before, and its stripes slide in
along their own axis. The word behind moves the same way as the car at a third of the distance. Copy lines are scrubbed in (blur, rise) with a per-line lag, names letter-roll, spec numbers count up.
The shader dims to 55% once the showroom takes over.

## 6. Content
As little as possible: one sentence per car (the first sentence of `text` in eras.js), three specs.
No emojis, no em dashes in copy, no invented stats (every spec is a published figure).
