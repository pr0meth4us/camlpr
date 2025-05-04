from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io

from config import DETECT_CONF, SEG_CONF
from models import detector, segmenter, parseq_model, device, transform
from image_processing import crop, to_data_url
from ocr import ocr_parseq
from province_correction import correct_province

app = Flask(__name__)
CORS(app)

@app.route("/api/inference", methods=["POST"])
def inference():
    if "image" not in request.files:
        return jsonify(error="no image uploaded"), 400

    raw = request.files["image"].read()
    pil = Image.open(io.BytesIO(raw)).convert("RGB")
    arr = np.array(pil)

    # 1) Detect the license-plate box
    det = detector.predict(source=arr, conf=DETECT_CONF, verbose=False)[0]
    boxes = det.boxes.xyxy.cpu().numpy()
    if len(boxes) == 0:
        return jsonify(image_paths=[], ocr_results=[])

    plate_box = max(boxes, key=lambda b: (b[2] - b[0]) * (b[3] - b[1]))
    plate_crop = crop(pil, plate_box)

    # 2) Draw the box for display
    vis = arr.copy()
    x1, y1, x2, y2 = map(int, plate_box)
    import cv2
    cv2.rectangle(vis, (x1, y1), (x2, y2), (0, 255, 0), 2)
    vis_img = Image.fromarray(vis)

    # 3) Segment number vs. province
    seg = segmenter.predict(source=np.array(plate_crop), conf=SEG_CONF, verbose=False)[0]
    seg_boxes = seg.boxes.xyxy.cpu().numpy()
    seg_classes = seg.boxes.cls.cpu().numpy().astype(int)

    number_boxes = [b for b, c in zip(seg_boxes, seg_classes) if c == 0]
    province_boxes = [b for b, c in zip(seg_boxes, seg_classes) if c == 1]

    number_crop = crop(plate_crop,
                       max(number_boxes, key=lambda b: (b[2] - b[0]) * (b[3] - b[1]))) if number_boxes else None
    province_crop = crop(plate_crop,
                         max(province_boxes, key=lambda b: (b[2] - b[0]) * (b[3] - b[1]))) if province_boxes else None

    # 4) OCR via PARSeq
    plate_txt, province_txt = "", ""
    confs = []

    if number_crop:
        txt, c = ocr_parseq(number_crop, parseq_model, transform, device)
        plate_txt = txt
        confs.append(c)
    if province_crop:
        txt, c = ocr_parseq(province_crop, parseq_model, transform, device)
        province_txt = txt
        confs.append(c)

    avg_conf = round(sum(confs) / len(confs), 2) if confs else 0.0

    # 5) Correct province name
    corrected_province = correct_province(province_txt) if province_txt else ""

    # 6) Pack images as base64 for front-end
    image_paths = [
        to_data_url(vis_img, "JPEG"),  # full w/ box
        to_data_url(plate_crop, "JPEG"),  # cropped plate
        to_data_url(number_crop, "JPEG") if number_crop else None,
        to_data_url(province_crop, "JPEG") if province_crop else None,
    ]

    ocr_results = [{
        "plate": plate_txt,
        "detected_province": province_txt,
        "corrected_province": corrected_province,
        "confidence": avg_conf
    }]

    return jsonify(image_paths=image_paths, ocr_results=ocr_results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5328)