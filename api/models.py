import os
import sys
import torch
import gc
from torchvision import transforms
from ultralytics import YOLO

from api.config import DETECT_WEIGHTS, SEG_WEIGHTS, OCR_WEIGHTS

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'parseq'))

# Load models with memory optimization
def load_optimized_models():
    # Load YOLO models with device specification
    device = "cuda" if torch.cuda.is_available() else "cpu"

    # For YOLO models, use the proper optimization approach
    detector = YOLO(DETECT_WEIGHTS)
    # YOLO models have internal optimization methods
    detector.to(device)

    segmenter = YOLO(SEG_WEIGHTS)
    segmenter.to(device)

    # Load parseq model with optimized settings
    parseq_model = torch.load(OCR_WEIGHTS, map_location=device)

    # For the PyTorch model we can apply direct optimization
    if torch.cuda.is_available():
        parseq_model = parseq_model.half()  # Only apply half precision on GPU

    parseq_model = parseq_model.to(device).eval()

    transform = transforms.Compose([
        transforms.Resize((32, 128)),
        transforms.ToTensor(),
        transforms.Normalize(0.5, 0.5),
    ])

    return detector, segmenter, parseq_model, device, transform

# Initialize models with optimization
detector, segmenter, parseq_model, device, transform = load_optimized_models()

# Explicitly clean up memory
gc.collect()
if torch.cuda.is_available():
    torch.cuda.empty_cache()