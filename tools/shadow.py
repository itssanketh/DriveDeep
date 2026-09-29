# usage: python tools/shadow.py img/car/<id>.webp img/shadow/<id>.webp   (needs numpy, scipy, pillow)
# Ground shadow for a cut-out car, on a canvas padded PADX each side and PADB below the car's box
# (style.css positions it with the same numbers). Built from the silhouette:
#   contact    each visible tyre's lowest point (local maxima of the bottom edge): tight, dark
#   footprint  the polygon between the tyre contacts, i.e. the ground under the car: soft occlusion
#   cast       the footprint pushed back-right (light is front-left), wide and faint
import sys, numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter, maximum_filter1d
from scipy.spatial import ConvexHull
PADX, PADB = 0.12, 0.14
a = np.asarray(Image.open(sys.argv[1]).convert('RGBA'))[..., 3] > 127
H, W = a.shape
px, pb = round(W * PADX), round(H * PADB)
WW, HH = W + 2 * px, H + pb
has = a.any(0)
b = np.where(has, H - 1 - np.argmax(a[::-1], 0), -1).astype(float)
# tyre contacts: columns that are (nearly) the lowest within +-3% of the width, and low in the frame
tol, win = H * 0.006, max(3, round(W * 0.06))
peak = has & (b >= maximum_filter1d(b, win) - tol) & (b > H * 0.6)
segs, x = [], 0
while x < W:
    if peak[x]:
        s = x
        while x < W and peak[x]: x += 1
        if x - s >= W * 0.004: segs.append((s, x - 1))
    x += 1
pts = [((s + e) / 2 + px, b[s:e + 1].max()) for s, e in segs]
foot = Image.new('L', (WW, HH)); d = ImageDraw.Draw(foot)
if len(pts) >= 3:
    P = np.array(pts); hull = P[ConvexHull(P).vertices]
    d.polygon([tuple(p) for p in hull], fill=255)
if len(pts) >= 2:
    d.line(pts, fill=255, width=max(2, round(H * 0.03)))
con = Image.new('L', (WW, HH)); dc = ImageDraw.Draw(con)
for (s, e), (cx, cy) in zip(segs, pts):
    hw = max((e - s) / 2, W * 0.02) * 1.3
    dc.ellipse([cx - hw, cy - H * 0.012, cx + hw, cy + H * 0.012], fill=255)
F = np.asarray(foot) / 255.0; C = np.asarray(con) / 255.0
occ = gaussian_filter(F, H * 0.025)
contact = gaussian_filter(C, H * 0.008)
cast = gaussian_filter(np.roll(np.roll(F, round(W * 0.04), 1), round(H * 0.02), 0), H * 0.06)
def n(v): return v / (v.max() or 1)
alpha = 1 - (1 - 0.85 * n(contact)) * (1 - 0.6 * n(occ)) * (1 - 0.3 * n(cast))
out = np.zeros((HH, WW, 4), np.uint8); out[..., 3] = np.clip(alpha * 255, 0, 255)
# Saved at half size: it is all soft blur, and CSS sizes it by percentage anyway.
Image.fromarray(out).resize((WW // 2, HH // 2), Image.LANCZOS).save(sys.argv[2], quality=80)
print(sys.argv[2], len(pts), 'contacts', [(round(x - px), round(y)) for x, y in pts])
