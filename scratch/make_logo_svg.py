from PIL import Image
import base64

uploaded_path = r"C:\Users\sivak\.gemini\antigravity\brain\ad5a245c-c947-48e2-93d3-c26614aadc1d\.user_uploaded\media_1791296269855_2648e2a6.png"

# Load image
img = Image.open(uploaded_path).convert("RGBA")

# Upscale with Lanczos resampling to 1600x1600px for ultra crisp rendering
highres_img = img.resize((1600, 1600), Image.Resampling.LANCZOS)
highres_img.save(r"scratch\temp_highres.png", "PNG")

with open(r"scratch\temp_highres.png", "rb") as f:
    b64_data = base64.b64encode(f.read()).decode("utf-8")

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1600 1600" width="100%" height="100%">
  <image width="1600" height="1600" xlink:href="data:image/png;base64,{b64_data}" />
</svg>'''

with open(r"public\images\logo.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Successfully generated 1600x1600 high-res logo.svg")

