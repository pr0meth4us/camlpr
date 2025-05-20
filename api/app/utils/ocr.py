import torch
import torch.nn.functional as F


def ocr_parseq(img, model, transform, device):
    img = img.convert("RGB")
    inp = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        out = model(inp)  # [B, T, V] logits
        probs = F.softmax(out, dim=-1)  # probabilities
        text = model.tokenizer.decode(probs)[0][0]
        if len(text):
            conf = probs.max(-1).values[0][:len(text)].log().mean().exp().item() * 100
        else:
            conf = 0.0
    return text, conf
