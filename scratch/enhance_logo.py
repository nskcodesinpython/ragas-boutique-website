from PIL import Image, ImageEnhance, ImageFilter
import base64
from io import BytesIO

img_path = r"C:\Users\sivak\.gemini\antigravity\brain\ad5a245c-c947-48e2-93d3-c26614aadc1d\.user_uploaded\media_1791296269855_2648e2a6.png"
img = Image.open(img_path).convert("RGBA")

# Super-scale 12x with Lanczos filter and Edge Sharpening
w, h = img.size
target_w, target_h = w * 12, h * 12

upscaled = img.resize((target_w, target_h), Image.Resampling.LANCZOS)

# Enhance sharpness to remove low-res blur
enhancer = ImageEnhance.Sharpness(upscaled)
sharpened = enhancer.enhance(3.0)

buffered = BytesIO()
sharpened.save(buffered, format="PNG", compress_level=1)
b64_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {target_w} {target_h}" width="100%" height="100%">
  <image width="{target_w}" height="{target_h}" xlink:href="data:image/png;base64,{b64_str}" />
</svg>'''

with open(r"public\images\logo.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print(f"Successfully processed high-sharpness {target_w}x{target_h} logo.svg")

