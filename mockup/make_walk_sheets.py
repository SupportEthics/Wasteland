#!/usr/bin/env python3
"""Generate 4-frame walk-cycle sprite sheets from the single-frame character art.

Technique: split the sprite's leg region into left/right halves and alternately
lift each half (classic puppet walk), dipping the torso 1% on step frames for
weight. Frames: [contact, left-step, contact, right-step].
"""
import os
from PIL import Image

SRC = "/home/user/Wasteland/assets/art/sprites"
OUT = "/home/user/Wasteland/mockup/assets"

# name -> (leg region as fraction of bbox height, lift as fraction of bbox height)
CONFIG = {
    "ranger":      (0.30, 0.045),
    "brute":       (0.30, 0.040),
    "scout":       (0.30, 0.050),
    "medic":       (0.30, 0.045),
    "raider":      (0.30, 0.050),
    "shambler":    (0.32, 0.055),
    "crawler":     (0.48, 0.070),   # quadruped scuttle: big region = arms+legs
    "juggernaut":  (0.26, 0.030),   # heavy, short stomp
    "sporewalker": (0.34, 0.050),
}
FRAME_W = 120

def step_frame(im, bbox, leg_frac, lift_px, side):
    """side: 'L' or 'R' half of the leg region gets lifted."""
    x0, y0, x1, y1 = bbox
    bh = y1 - y0
    leg_top = y1 - int(bh * leg_frac)
    mid = (x0 + x1) // 2
    dip = max(1, int(bh * 0.012))

    canvas = Image.new("RGBA", im.size, (0, 0, 0, 0))
    # torso (everything above legs), dipped slightly for weight
    torso = im.crop((0, 0, im.width, leg_top))
    canvas.paste(torso, (0, dip), torso)
    # planted half: stays on the ground
    lx0, lx1 = (x0, mid) if side == "L" else (mid, x1)
    px0, px1 = (mid, x1) if side == "L" else (x0, mid)
    planted = im.crop((px0, leg_top, px1, y1))
    canvas.paste(planted, (px0, leg_top + dip), planted)
    # stepping half: lifted
    stepping = im.crop((lx0, leg_top, lx1, y1))
    canvas.paste(stepping, (lx0, leg_top - lift_px + dip), stepping)
    return canvas

def make_sheet(name):
    leg_frac, lift_frac = CONFIG[name]
    im = Image.open(f"{SRC}/{name}.png").convert("RGBA")
    bbox = im.getbbox()
    bh = bbox[3] - bbox[1]
    lift = max(3, int(bh * lift_frac))
    # headroom so nothing clips when lifted
    pad = lift + 4
    base = Image.new("RGBA", (im.width, im.height + pad), (0, 0, 0, 0))
    base.paste(im, (0, pad), im)
    bbox = (bbox[0], bbox[1] + pad, bbox[2], bbox[3] + pad)

    frames = [base, step_frame(base, bbox, leg_frac, lift, "L"),
              base, step_frame(base, bbox, leg_frac, lift, "R")]
    fw, fh = FRAME_W, round(base.height * FRAME_W / base.width)
    sheet = Image.new("RGBA", (fw * 4, fh), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        sheet.paste(f.resize((fw, fh), Image.LANCZOS), (i * fw, 0))
    out = f"{OUT}/sheet_{name}.webp"
    sheet.save(out, "WEBP", quality=85, method=6)
    print(f"'{name}':{{fw:{fw},fh:{fh}}},  // {os.path.getsize(out)//1024}KB")

for n in CONFIG:
    make_sheet(n)
