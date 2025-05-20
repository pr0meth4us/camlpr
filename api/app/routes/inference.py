import cv2
import gc
import io
import numpy as np
import re
import torch

from PIL import Image
from flask import Blueprint, current_app, request, jsonify

from ..config import Config
from ..utils import image_processing as img
from ..utils import text_correction as tc
from ..utils.ocr import ocr_parseq

bp = Blueprint("inference", __name__)


@bp.route("/inference", methods=["POST"])
def inference():
    app = current_app
    app.request_count += 1

    if "image" not in request.files:
        return jsonify(error="no image uploaded"), 400

    raw = request.files["image"].read()
    pil = Image.open(io.BytesIO(raw)).convert("RGB")
    arr = np.array(pil)

    # 1. Detect plate
    det = app.detector.predict(source=arr, conf=Config.DETECT_CONF, verbose=False)[0]
    boxes = det.boxes.xyxy.cpu().numpy()
    if not len(boxes):
        return jsonify(image_paths=[], ocr_results=[])

    plate_box = max(boxes, key=lambda b: (b[2] - b[0]) * (b[3] - b[1]))
    plate_crop = img.enhance_plate(img.crop(pil, plate_box))

    # 2. Draw box
    vis = arr.copy()
    x1, y1, x2, y2 = map(int, plate_box)
    cv2.rectangle(vis, (x1, y1), (x2, y2), (0, 255, 0), 2)
    vis_img = Image.fromarray(vis)

    # 3. Segment number / province
    seg = app.segmenter.predict(source=np.array(plate_crop), conf=Config.SEG_CONF, verbose=False)[0]
    s_boxes = seg.boxes.xyxy.cpu().numpy()
    s_cls = seg.boxes.cls.cpu().numpy().astype(int)

    n_boxes = [b for b, c in zip(s_boxes, s_cls) if c == 0]
    p_boxes = [b for b, c in zip(s_boxes, s_cls) if c == 1]
    number_crop = img.crop(plate_crop, max(n_boxes, key=lambda b: (b[2] - b[0]) * (b[3] - b[1]))) if n_boxes else None
    province_crop = img.crop(plate_crop, max(p_boxes, key=lambda b: (b[2] - b[0]) * (b[3] - b[1]))) if p_boxes else None

    # 4. OCR
    plate_txt, province_txt = "", ""
    if number_crop:
        raw, c = ocr_parseq(number_crop, app.parseq_model, app.ocr_transform, app.ocr_device)
        plate_txt = re.sub(r"[^A-Za-z0-9\-.]", "", raw)
        number_conf = c
    if province_crop:
        raw, c = ocr_parseq(province_crop, app.parseq_model, app.ocr_transform, app.ocr_device)
        province_txt = re.sub(r"[^A-Za-z0-9\-.]", "", raw)
        province_conf = c

    # 5. Province correction
    corrected_prov = tc.correct_province(province_txt)

    # 6. Plate correction
    valid_fmt = False
    if corrected_prov != "Cambodia":
        if re.match(r"^\d[A-Za-z]{2}-\d{4}$", plate_txt):
            plate_txt = tc.correct_plate(plate_txt, "nll-nnnn");
            valid_fmt = True
        elif re.match(r"^\d[A-Za-z]-\d{4}$", plate_txt):
            plate_txt = tc.correct_plate(plate_txt, "nl-nnnn");
            valid_fmt = True
    else:
        valid_fmt = True

    image_paths = [img.to_data_url(vis_img),
                   img.to_data_url(plate_crop),
                   img.to_data_url(number_crop) if number_crop else None,
                   img.to_data_url(province_crop) if province_crop else None]

    print(corrected_prov)

    result = [{
        "plate": plate_txt,
        "detected_province": province_txt,
        "corrected_province": corrected_prov,
        "province_confidence": province_conf,
        "number_confidence": number_conf,
        "format_valid": valid_fmt
    }]

    # Memory housekeeping
    if torch.cuda.is_available(): torch.cuda.empty_cache()
    if app.request_count >= Config.MAX_REQUESTS_BEFORE_RELOAD:
        gc.collect()
        if torch.cuda.is_available(): torch.cuda.empty_cache()
        app.detector, app.segmenter, app.parseq_model, _, _ = app.detector, app.segmenter, app.parseq_model, None, None
        app.request_count = 0
    app.logger.info(f"Corrected province: {corrected_prov}")
    app.logger.info(f"Inference result: {result}")
    app.logger.info(f"[#{app.request_count}] corrected_province={corrected_prov} result={result}")

    return jsonify(image_paths=image_paths, ocr_results=result)
