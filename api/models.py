import torch
from ultralytics import YOLO
from torchvision import transforms
from config import DETECT_WEIGHTS, SEG_WEIGHTS, PARSEQ_WEIGHTS
from api.parseq.strhub.data.utils import Tokenizer
# YOLO models
detector = YOLO(DETECT_WEIGHTS)
segmenter = YOLO(SEG_WEIGHTS)

# PARSeq model
device = "cuda" if torch.cuda.is_available() else "cpu"

# Import and initialize the PARSeq model with parameters
from api.parseq.strhub.models.parseq.model import PARSeq

# PARSeq model - Using parameters that match the checkpoint
parseq_model = PARSeq(
    num_tokens=97,
    max_label_length=25,
    img_size=[32, 1024],     # Keep original image size for input
    patch_size=[4, 8],       # Match the checkpoint's patch size
    embed_dim=384,
    enc_num_heads=6,
    enc_mlp_ratio=4,
    enc_depth=12,
    dec_num_heads=6,
    dec_mlp_ratio=4,
    dec_depth=1,
    decode_ar=True,
    refine_iters=0,
    dropout=0.1
).to(device)

# Load the state_dict
state_dict = torch.load(PARSEQ_WEIGHTS, map_location=device)

# Process state_dict to remove "model." prefix
new_state_dict = {}
for key, value in state_dict.items():
    if key.startswith('model.'):
        new_key = key.replace('model.', '', 1)
        new_state_dict[new_key] = value
    else:
        new_state_dict[key] = value

# Resize position embeddings to match the model's expected size
if 'encoder.pos_embed' in new_state_dict:
    pos_embed = new_state_dict['encoder.pos_embed']
    if pos_embed.shape[1] != 1024:
        print(f"Resizing position embeddings from {pos_embed.shape} to [1, 1024, 384]")

        # Get original dimensions
        orig_size = pos_embed.shape  # Should be [1, 128, 384]
        target_size = (1, 1024, 384)
        embed_dim = orig_size[2]

        # Reshape for proper 2D interpolation (treating the sequence dimension as spatial)
        pos_embed_reshaped = pos_embed.permute(0, 2, 1)  # [1, 384, 128]
        pos_embed_reshaped = pos_embed_reshaped.unsqueeze(3)  # [1, 384, 128, 1]

        # Interpolate
        pos_embed_interpolated = torch.nn.functional.interpolate(
            pos_embed_reshaped,
            size=(1024, 1),
            mode='bilinear',
            align_corners=False
        )

        # Reshape back to original format
        pos_embed_interpolated = pos_embed_interpolated.squeeze(3)  # [1, 384, 1024]
        new_pos_embed = pos_embed_interpolated.permute(0, 2, 1)  # [1, 1024, 384]

        new_state_dict['encoder.pos_embed'] = new_pos_embed

# Load the adjusted state_dict into the model
parseq_model.load_state_dict(new_state_dict, strict=False)
parseq_model.eval()  # Set the model to evaluation mode

# PARSeq preprocessing - Match the input size for the model
transform = transforms.Compose([
    transforms.Resize((32, 1024)),  # Keep consistent with img_size
    transforms.ToTensor(),
    transforms.Normalize(0.5, 0.5),
])

charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.- "  # Adjust as needed
tokenizer = Tokenizer(charset=charset)