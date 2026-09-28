# Design System: Bodylines

## 1. Theme
Seven Fords, 1896 to 2017 (Quadricycle, Model T, '32 V8, Thunderbird, Mustang, GT40 Mk II, Ford GT):
one maker, so the line-up reads as one family evolving.
Dark showroom. A live WebGL shader (drifting rainbow rings, `shader.js`, ported from the
21st.dev shader-animation) fills the page background; the cars are cut-out three-quarter studio shots
with no backdrop (`img/car/<id>.webp`, all nose front-left), so they read as solid objects and the car is the only thing on stage.

## 2. Color
- **Bg** #0A0A0A (behind the shader), **Ink** #EDEDED, **Mute** ink at 62%, **Faint** ink at 38%
- **Line** ink at 14% - spec rules and the line-up
- **Accent** #FF5A47 - chapter numbers, scroll bar, focus
- Each car's light pool sits front-left, where the photo is lit from (look.js `light`), warm white with a touch of its `tint`
- Optional era tones (look.js `TONED`): warm charcoal for 1896-1932, neutral dark after

## 3. Type
Cormorant Garamond 300 for headlines, spec values and the outlined year behind each car.
Jost 300 for body. Labels are Jost 400, .72rem, uppercase, .22em tracking.

## 4. Layout
- Header: tracked wordmark left, era years right, 1px accent scroll bar on top.
- Hero (400vh, sticky; `hero.js`, ported scroll-morph-hero): 20 photo cards (`img/card/`) scatter in,
  line up, form a ring around the headline. Scrolling morphs the ring into an arch and sweeps it
  left; hovering a card flips it to its year, clicking jumps to that car.
- Showroom (740vh, one sticky stage): the car, right of centre, resting on a contact shadow (no
  mirror reflection), overlapping a huge solid year at 5% white set left of it, name and one sentence bottom-left, three specs bottom-right, `05 / 07` top-right.
- Finale: a pinned timeline that scrolls sideways (after 21st.dev's Product Timeline): a hairline rail
  fills with the accent as you scroll; the seven cars alternate above and below it on accent dots, each
  stem growing from the rail and its year, name and car rising in (scrubbed) as it enters from the right.
- Footer: closing line and back-to-top, a two-column hairline index of the seven cars (hover slides
  the name and shows an accent arrow), credit line, and a giant faint serif "Bodylines" cropped by the
  bottom of the page that rises letter by letter.
- Below 900px: copy moves to the top, specs to the bottom; timeline milestones get wider.

Per-car tuning (photo filter, scale, offset, light, falloff, tone) lives in `look.js`. Cutout edges
are choked 1px and darkened in the image files, so no studio halo shows against black.

## 5. Motion
One rAF loop in main.js reads scrollY (Lenis-smoothed). Cards are springs (k 40, c 15).
Showroom `pos` is a float car index and every property is a pure function of it (scrubbed by
Lenis, never timed). Hand-offs are a rack focus, after the 21st.dev depth-fade/tunnel components:
the leaving car drifts on and goes out of focus (blur, dark, desaturated) while the next comes out of
the dark into focus, overlapping so there is no empty frame. Each car arrives from its own direction
(MOVES in main.js: depth, right, below, deep, above, left, diagonal) but only a third of a screen
away, so it reads as a camera move. A slow dolly (drift + push-in) means nothing ever stops dead, and
a light sweep masked to the car's silhouette crosses the paint as it settles. The year behind moves
the same way at a third of the distance. Copy lines are scrubbed in (blur, rise) with a per-line lag, names letter-roll, spec numbers count up.
The shader dims to 55% once the showroom takes over.

## 6. Content
As little as possible: one sentence per car (the first sentence of `text` in eras.js), three specs.
No emojis, no em dashes in copy, no invented stats (every spec is a published figure).
