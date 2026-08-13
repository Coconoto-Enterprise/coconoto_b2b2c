from PIL import Image
import os

BASE = r"C:\Users\user\Documents\GitHub\coconoto_b2b2c\src\assets"
FILES = ["coconut_google_search.png", "coconut_google_search-2.png"]
TARGET_W = 680  # 2x of the 340px max display width (retina-safe)

for f in FILES:
    src = os.path.join(BASE, f)
    if not os.path.exists(src):
        print(f"SKIP (missing): {f}")
        continue
    with Image.open(src) as im:
        im = im.convert("RGB")
        w, h = im.size
        if w > TARGET_W:
            new_h = max(1, round(h * TARGET_W / w))
            im = im.resize((TARGET_W, new_h), Image.LANCZOS)
        out = os.path.splitext(src)[0] + ".webp"
        im.save(out, "WEBP", quality=82, method=6)
        orig = os.path.getsize(src)
        new = os.path.getsize(out)
        print(f"{f}: {w}x{h} -> {im.size}, {orig/1024:.1f}KB -> {new/1024:.1f}KB "
              f"({(1 - new/orig)*100:.0f}% smaller)")
