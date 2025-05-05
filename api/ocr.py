import torch
import torch.nn.functional as F


def ocr_parseq(img_crop, parseq_model, transform, device):
    """Perform OCR on an image crop using the PARSeq model."""
    img = img_crop.convert("RGB")
    inp = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        out = parseq_model(inp)  # raw logits [B, T, V]
        probs = F.softmax(out, dim=-1)  # [B, T, V]
        decoded = parseq_model.tokenizer.decode(probs)[0][0]
        length = len(decoded)
        if length > 0:
            max_p = probs.max(-1).values[0][:length]  # top prob per timestep
            conf = max_p.log().mean().exp().item() * 100
        else:
            conf = 0.0
    return decoded, conf
