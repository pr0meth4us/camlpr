import torch
from ultralytics import YOLO
from torchvision import transforms
from config import DETECT_WEIGHTS, SEG_WEIGHTS

# YOLO models
detector = YOLO(DETECT_WEIGHTS)
segmenter = YOLO(SEG_WEIGHTS)

# PARSeq model
device = "cuda" if torch.cuda.is_available() else "cpu"
parseq_model = torch.hub.load(
    "baudm/parseq", "parseq", pretrained=True, trust_repo=True
).to(device).eval()

# PARSeq preprocessing
transform = transforms.Compose([
    transforms.Resize((32, 128)),
    transforms.ToTensor(),
    transforms.Normalize(0.5, 0.5),
])
