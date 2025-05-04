# Configuration settings for the license plate detection and OCR application

DETECT_WEIGHTS = "./models/detection.pt"  # Path to plate detector model weights
SEG_WEIGHTS = "./models/segmentation.pt"  # Path to number-vs-province segmenter model weights
DETECT_CONF = 0.5  # Confidence threshold for detection
SEG_CONF = 0.3  # Confidence threshold for segmentation