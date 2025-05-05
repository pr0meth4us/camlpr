import torch
from ultralytics import YOLO
from torchvision import transforms
from config import DETECT_WEIGHTS, SEG_WEIGHTS, OCR_WEIGHTS

detector = YOLO(DETECT_WEIGHTS)
segmenter = YOLO(SEG_WEIGHTS)

device = "cuda" if torch.cuda.is_available() else "cpu"
parseq_model = torch.load(
    OCR_WEIGHTS,
    map_location=device
).to(device).eval()

# preprocessing
transform = transforms.Compose([
    transforms.Resize((32, 128)),
    transforms.ToTensor(),
    transforms.Normalize(0.5, 0.5),
])
