import io
import re
import cv2
import numpy as np
import torch
import os

from PIL import Image
from flask import Flask, request, jsonify
from api.config import DETECT_CONF, SEG_CONF
from api.image_processing import crop, to_data_url, enhance_plate
from api.models import detector, segmenter, parseq_model, device, transform
from api.ocr import ocr_parseq
from api.correction import correct_province, correct_plate
from api.cors import init_cors

app = Flask(__name__)
init_cors(app)

request_count = 0
MAX_REQUESTS_BEFORE_RELOAD = 25

app = Flask(__name__)
init_cors(app)


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
    plate_crop = enhance_plate(plate_crop)

    # 2) Draw the box for display
    vis = arr.copy()
    x1, y1, x2, y2 = map(int, plate_box)
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
        raw_txt, c = ocr_parseq(number_crop, parseq_model, transform, device)
        plate_txt = re.sub(r'[^A-Za-z0-9\-.]', '', raw_txt)  # Flexible for all cases initially
        print(raw_txt)
        confs.append(c)
    if province_crop:
        raw_txt, c = ocr_parseq(province_crop, parseq_model, transform, device)
        print(raw_txt)
        province_txt = re.sub(r'[^A-Za-z0-9\-.]', '', raw_txt)
        confs.append(c)

    avg_conf = round(sum(confs) / len(confs), 2) if confs else 0.0

    # 5) Correct province name
    corrected_province = correct_province(province_txt) if province_txt else "unreadable"

    # 6) Adjust plate number based on province
    if corrected_province == "Cambodia":
        format_valid = True
    else:
        if re.match(r'^\d[A-Za-z]{2}-\d{4}$', plate_txt):
            plate_txt = correct_plate(plate_txt, "nll-nnnn")
            format_valid = True
        elif re.match(r'^\d[A-Za-z]-\d{4}$', plate_txt):
            plate_txt = correct_plate(plate_txt, "nl-nnnn")
            format_valid = True
        else:
            format_valid = False if corrected_province != "unreadable" else False

    image_paths = [
        to_data_url(vis_img, "JPEG"),
        to_data_url(plate_crop, "JPEG"),
        to_data_url(number_crop, "JPEG") if number_crop else None,
        to_data_url(province_crop, "JPEG") if province_crop else None,
    ]

    ocr_results = [{
        "plate": plate_txt,
        "detected_province": province_txt,
        "corrected_province": corrected_province,
        "confidence": avg_conf,
        "format_valid": format_valid
    }]

    return jsonify(image_paths=image_paths, ocr_results=ocr_results)


def get_memory_usage():
    try:
        import psutil
        process = psutil.Process(os.getpid())
        mem_info = process.memory_info()
        return mem_info.rss / 1024 / 1024  # Convert to MB
    except ImportError:
        return 0  # psutil not available


@app.route('/health', methods=['GET'])
def health_check():
    mem_usage = get_memory_usage()
    return jsonify(status="healthy", memory_mb=round(mem_usage, 2)), 200


@app.route('/memory', methods=['GET'])
def memory_stats():
    """Endpoint to monitor memory usage"""
    mem_usage = get_memory_usage()
    torch_mem = 0
    if torch.cuda.is_available():
        torch_mem = torch.cuda.memory_allocated() / 1024 / 1024  # MB

    return jsonify({
        "system_memory_mb": round(mem_usage, 2),
        "torch_memory_mb": round(torch_mem, 2),
        "request_count": request_count
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5328)
