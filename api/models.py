import os
import sys
import torch
import gc
from torchvision import transforms
from ultralytics import YOLO

from api.config import DETECT_WEIGHTS, SEG_WEIGHTS, OCR_WEIGHTS

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'parseq'))


def load_optimized_models():
    global detector, segmenter, parseq_model, device, transform

    device = "cuda" if torch.cuda.is_available() else "cpu"

    detector = YOLO(DETECT_WEIGHTS)
    detector.to(device)

    segmenter = YOLO(SEG_WEIGHTS)
    segmenter.to(device)

    parseq_model = torch.load(OCR_WEIGHTS, map_location=device)

    if torch.cuda.is_available():
        parseq_model = parseq_model.half()

    parseq_model = parseq_model.to(device).eval()

    transform = transforms.Compose([
        transforms.Resize((32, 128)),
        transforms.ToTensor(),
        transforms.Normalize(0.5, 0.5),
    ])

    return detector, segmenter, parseq_model, device, transform


detector, segmenter, parseq_model, device, transform = load_optimized_models()

gc.collect()
if torch.cuda.is_available():
    torch.cuda.empty_cache()
