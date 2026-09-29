// How each car sits in the showroom, and its poster theme. Every value you might want to tune per car lives here.
//
// filter  CSS filter on the photo.
// scale   car size; 1 = the old size. Tall cars grow in height, long ones in width (capped at 72vw),
//         so long cars need a smaller number than tall ones for the same presence.
// x       shift toward the right, in vw (desktop only; phones centre the car).
// falloff 0..1, how much the car darkens away from the light (front-left).
// bg      the scene's paper colour.
// ink     the giant word behind the car, and the text.
// c1, c2  the two diagonal livery stripes; c2 is also the accent for that car's labels and particles.
// motes   particles drifting through the scene: 'dust' floats up, 'air' streams past like a wind tunnel.

export const LOOK = {
  quadricycle: { filter: 'contrast(1.04)', scale: 1.3, x: 6, falloff: 0.25, bg: '#e9dfcc', ink: '#3a2f25', c1: '#2b2420', c2: '#b7803c', motes: 'dust' },
  modelt: { filter: 'contrast(1.05)', scale: 1.28, x: 6, falloff: 0.2, bg: '#e7e4dc', ink: '#232323', c1: '#161616', c2: '#c49a55', motes: 'dust' },
  v8: { filter: 'brightness(1.05) contrast(1.04)', scale: 1.28, x: 6, falloff: 0.2, bg: '#e1e7df', ink: '#22362b', c1: '#1c3326', c2: '#5f8f6e', motes: 'dust' },
  thunderbird: { filter: 'contrast(1.04)', scale: 1.2, x: 5, falloff: 0.25, bg: '#f1e8e3', ink: '#2a2626', c1: '#2a2626', c2: '#d42f2b', motes: 'dust' },
  mustang: { filter: 'contrast(1.05)', scale: 1.18, x: 5, falloff: 0.3, bg: '#e6e9ee', ink: '#2d3036', c1: '#2d3036', c2: '#1f4f9c', motes: 'air' },
  gt40: { filter: 'contrast(1.04)', scale: 1.2, x: 5, falloff: 0.2, bg: '#e6e6e3', ink: '#121212', c1: '#121212', c2: '#c9a24a', motes: 'air' },
  fordgt: { filter: 'contrast(1.04)', scale: 0.98, x: 5, falloff: 0.25, bg: '#e3e9f2', ink: '#13234a', c1: '#13234a', c2: '#2f6fd1', motes: 'air' },
  gt500: { filter: 'contrast(1.04)', scale: 0.98, x: 5, falloff: 0.2, bg: '#e8ebef', ink: '#141a24', c1: '#141414', c2: '#1f5fbf', motes: 'air' },
  // White car, electric-blue accent.
  mache: { filter: 'contrast(1.04)', scale: 1.02, x: 5, falloff: 0.2, bg: '#e8eff1', ink: '#1d2b33', c1: '#1d2b33', c2: '#2a9fd6', motes: 'dust' },
  // Launch livery: deep blue, cyan and red.
  gtmk4: { filter: 'contrast(1.03)', scale: 1.15, x: 5, falloff: 0.2, bg: '#e4e8f0', ink: '#101a33', c1: '#16255c', c2: '#d6334a', motes: 'air' },
  darkhorse: { filter: 'contrast(1.04)', scale: 1.15, x: 5, falloff: 0.25, bg: '#e6e8e8', ink: '#15181a', c1: '#15181a', c2: '#2f8f9d', motes: 'air' },
  // White, with the Spirit of America stripes: navy and red.
  gtd: { filter: 'contrast(1.04)', scale: 0.98, x: 5, falloff: 0.2, bg: '#eceef2', ink: '#1a2238', c1: '#1f3a8a', c2: '#d0202e', motes: 'air' },
};
