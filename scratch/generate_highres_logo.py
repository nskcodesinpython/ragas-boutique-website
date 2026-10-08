from PIL import Image
import base64

# Open the exact user-uploaded PNG
img_path = r"C:\Users\sivak\.gemini\antigravity\brain\ad5a245c-c947-48e2-93d3-c26614aadc1d\.user_uploaded\media_1791293274421_dfd9637c.png"
img = Image.open(img_path).convert("RGBA")

# High-resolution super-sampling (1200x1200 px) using Lanczos filter
high_res = img.resize((1200, 1200), Image.Resampling.LANCZOS)
high_res.save(r"public\images\logo.png")

# Encode to base64
with open(r"public\images\logo.png", "rb") as f:
    b64_str = base64.b64encode(f.read()).decode("utf-8")

# Generate SVG container containing the 1200x1200 high-res image
svg_data = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 1200" width="100%" height="100%">
  <image width="1200" height="1200" xlink:href="data:image/png;base64,{b64_str}" />
</svg>'''

with open(r"public\images\logo.svg", "w") as f:
    f.write(svg_data)

print("Successfully created crisp 1200x1200 high-res logo.svg")

