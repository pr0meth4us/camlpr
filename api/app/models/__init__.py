import gc, os, sys, torch
from torchvision import transforms
from ultralytics import YOLO
from ..config import Config

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "parseq"))

def load_optimized_models():
    device = "cuda" if torch.cuda.is_available() else "cpu"

    detector  = YOLO(str(Config.DETECT_WEIGHTS)).to(device)
    segmenter = YOLO(str(Config.SEG_WEIGHTS)).to(device)

    parseq_model = torch.load(Config.OCR_WEIGHTS, map_location=device)
    if torch.cuda.is_available():
        parseq_model = parseq_model.half()
    parseq_model = parseq_model.to(device).eval()

    transform = transforms.Compose([
        transforms.Resize((32, 128)),
        transforms.ToTensor(),
        transforms.Normalize(0.5, 0.5),
    ])

    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

    return detector, segmenter, parseq_model, device, transform
