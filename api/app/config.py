from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Config:
    DETECT_WEIGHTS = BASE_DIR / "models/detection/best.pt"
    SEG_WEIGHTS    = BASE_DIR / "models/segmentation/best.pt"
    OCR_WEIGHTS    = BASE_DIR / "models/parseq/parseq.pt"

    DETECT_CONF = 0.50     # detection confidence
    SEG_CONF    = 0.30     # segmentation confidence
    MAX_REQUESTS_BEFORE_RELOAD = 25
