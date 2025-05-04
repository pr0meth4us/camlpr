from PIL import Image
import io
import base64

def crop(img: Image.Image, box):
    """Crop an image using the provided bounding box coordinates."""
    x1, y1, x2, y2 = map(int, box)
    return img.crop((x1, y1, x2, y2))

def to_data_url(img: Image.Image, ext="JPEG"):
    """Convert an image to a base64-encoded data URL."""
    buf = io.BytesIO()
    img.save(buf, format=ext)
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f"data:image/{ext.lower()};base64,{b64}"