from flask import Flask
from .config import Config
from .extensions import init_cors
from .models import load_optimized_models
import logging
import sys

detector, segmenter, parseq_model, device, transform = (None,) * 5


def create_app() -> Flask:
    global detector, segmenter, parseq_model, device, transform

    app = Flask(__name__)
    app.config.from_object(Config)

    # ——— Console Logging setup ———
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(logging.Formatter(
        "[%(asctime)s] %(levelname)s - %(name)s: %(message)s"
    ))
    app.logger.addHandler(console_handler)
    app.logger.setLevel(logging.INFO)

    # Remove default Flask handlers to avoid duplicate logs
    app.logger.handlers = [console_handler]

    # Extensions
    init_cors(app)

    # Lazy-load heavy ML models exactly once
    if detector is None:
        detector, segmenter, parseq_model, device, transform = load_optimized_models()

    # Inject objects into app context for blueprints
    app.detector = detector
    app.segmenter = segmenter
    app.parseq_model = parseq_model
    app.ocr_device = device
    app.ocr_transform = transform
    app.request_count = 0

    # Blueprints
    from .routes.inference import bp as inference_bp
    from .routes.health import bp as health_bp
    app.register_blueprint(inference_bp, url_prefix="/api")
    app.register_blueprint(health_bp)

    app.logger.info("Application initialized with console logging")
    return app
