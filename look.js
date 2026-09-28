// How each car sits in the showroom. Every value you might want to tune per car lives here.
//
// filter  CSS filter on the photo: brings the bright studio lighting down to the dark page.
// scale   car size; 1 = the old size. Tall cars grow in height, long ones in width (capped at 72vw),
//         so long cars need a smaller number than tall ones for the same presence.
// x       shift toward the right, in vw (desktop only; phones centre the car).
// light   [x, y] of the light pool on screen: the side the photo is lit from (front-left here).
// falloff 0..1, how much the car darkens away from the light, so its far edges sink into the dark.
// tone    background tone, only used when TONED is true.

// Era-tinted backgrounds: warm charcoal for the early cars, neutral dark later. false = all black.
export const TONED = false;

export const LOOK = {
  quadricycle: { filter: 'brightness(.86) contrast(1.06) saturate(.9)', scale: 1.3, x: 6, light: ['34%', '34%'], falloff: 0.4, tone: '#1b150f' },
  modelt: { filter: 'brightness(.9) contrast(1.08) saturate(.88)', scale: 1.28, x: 6, light: ['33%', '32%'], falloff: 0.35, tone: '#19150f' },
  // Dark green paint: keep it bright enough to read against black.
  v8: { filter: 'brightness(.94) contrast(1.06) saturate(.9)', scale: 1.28, x: 6, light: ['33%', '34%'], falloff: 0.35, tone: '#17140f' },
  thunderbird: { filter: 'brightness(.86) contrast(1.05) saturate(.9)', scale: 1.2, x: 5, light: ['32%', '36%'], falloff: 0.4, tone: '#110c0b' },
  // White paint in bright studio light: brought down the most.
  mustang: { filter: 'brightness(.8) contrast(1.06) saturate(.85)', scale: 1.18, x: 5, light: ['33%', '36%'], falloff: 0.45, tone: '#0e0f11' },
  gt40: { filter: 'brightness(.92) contrast(1.06) saturate(.9)', scale: 1.2, x: 5, light: ['32%', '38%'], falloff: 0.35, tone: '#0d0e10' },
  fordgt: { filter: 'brightness(.88) contrast(1.05) saturate(.88)', scale: 1.18, x: 5, light: ['32%', '36%'], falloff: 0.4, tone: '#0a0c12' },
};
