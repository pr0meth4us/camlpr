import io
import base64
import numpy as np
import cv2
from PIL import Image, ImageFilter


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


def enhance_plate(img: Image.Image) -> Image.Image:
    """Enhance the cropped plate image using unsharp masking and histogram equalization, then restore RGB channels."""
    # Convert to grayscale
    gray = img.convert("L")
    # Unsharp Masking (sharpen image)
    sharpened = gray.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
    # Histogram Equalization
    np_img = np.array(sharpened)
    equalized = cv2.equalizeHist(np_img)
    # Back to PIL, then convert to RGB so model gets 3 channels
    final = Image.fromarray(equalized).convert("RGB")
    return final
