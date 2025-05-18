import base64, io, numpy as np, cv2
from PIL import Image, ImageFilter

def crop(img: Image.Image, box):
    x1, y1, x2, y2 = map(int, box)
    return img.crop((x1, y1, x2, y2))

def to_data_url(img: Image.Image, ext="JPEG"):
    buf = io.BytesIO()
    img.save(buf, format=ext)
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f"data:image/{ext.lower()};base64,{b64}"

def enhance_plate(img: Image.Image) -> Image.Image:
    gray       = img.convert("L")
    sharpened  = gray.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
    equalized  = cv2.equalizeHist(np.array(sharpened))
    return Image.fromarray(equalized).convert("RGB")
