from flask import Flask
from .config import Config
from .extensions import init_cors
from .models import load_optimized_models
import logging
from logging.handlers import RotatingFileHandler

# Globals wired once at startup
detector, segmenter, parseq_model, device, transform = (None,) * 5


def create_app() -> Flask:
    """
    Application-factory.  Creates and configures a Flask app instance.
    """
    global detector, segmenter, parseq_model, device, transform

    app = Flask(__name__)
    app.config.from_object(Config)
    # ——— Logging setup ———
    handler = RotatingFileHandler(
        "inference.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=5
    )
    handler.setFormatter(logging.Formatter(
        "%(asctime)s %(levelname)s %(module)s: %(message)s"
    ))
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)

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

    return app
