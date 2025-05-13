import os
import sys

import torch
from torchvision import transforms
from ultralytics import YOLO

from api.config import DETECT_WEIGHTS, SEG_WEIGHTS, OCR_WEIGHTS

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'parseq'))

detector = YOLO(DETECT_WEIGHTS)
segmenter = YOLO(SEG_WEIGHTS)

device = "cuda" if torch.cuda.is_available() else "cpu"
parseq_model = torch.load(
    OCR_WEIGHTS,
    map_location=device
).to(device).eval()

transform = transforms.Compose([
    transforms.Resize((32, 128)),
    transforms.ToTensor(),
    transforms.Normalize(0.5, 0.5),
])
