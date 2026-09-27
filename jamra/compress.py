from PIL import Image
import os
D = "jamra/src/assets"
LIMITS = {
  "hero.jpg": 1100, "chef_fire.jpg": 1500, "interior.jpg": 1100, "spices.jpg": 850,
  "dish_grill.jpg": 900, "dish_lamb.jpg": 900, "dish_mezza.jpg": 900, "dish_kunafa.jpg": 900,
  "skewers_fire.jpg": 1100, "bread_oven.jpg": 1000, "coffee_dallah.jpg": 1000, "lanterns.jpg": 1100,
}
total = 0
for f in sorted(os.listdir(D)):
    p = os.path.join(D, f)
    if not f.lower().endswith((".jpg", ".jpeg", ".png")): continue
    im = Image.open(p).convert("RGB")
    w, h = im.size
    limit = LIMITS.get(f, 1100)
    s = min(1, limit / max(w, h))
    if s < 1: im = im.resize((int(w * s), int(h * s)), Image.LANCZOS)
    im.save(p, "JPEG", quality=76, optimize=True, progressive=True)
    kb = os.path.getsize(p) // 1024
    total += kb
    print(f"{f}: {im.size[0]}x{im.size[1]} {kb}KB")
print("TOTAL:", total, "KB")
