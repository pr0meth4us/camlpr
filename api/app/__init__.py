from flask import Flask
from .config import Config
from .extensions import init_cors
from .models import load_optimized_models

# Globals wired once at startup
detector, segmenter, parseq_model, device, transform = (None,) * 5


def create_app() -> Flask:
    """
    Application-factory.  Creates and configures a Flask app instance.
    """
    global detector, segmenter, parseq_model, device, transform

    app = Flask(__name__)
    app.config.from_object(Config)

    # Extensions
    init_cors(app)

    # Register simple health route BEFORE loading models
    # This ensures health checks work even if model loading is slow
    @app.route("/health")
    def health():
        return {"status": "healthy"}, 200

    # Blueprints (excluding health since we defined it above)
    from .routes.inference import bp as inference_bp
    app.register_blueprint(inference_bp, url_prefix="/api")

    # Lazy-load heavy ML models exactly once AFTER health route is registered
    if detector is None:
        try:
            detector, segmenter, parseq_model, device, transform = load_optimized_models()

            # Inject objects into app context for blueprints
            app.detector = detector
            app.segmenter = segmenter
            app.parseq_model = parseq_model
            app.ocr_device = device
            app.ocr_transform = transform
            app.request_count = 0
            app.logger.info("ML models loaded successfully")
        except Exception as e:
            app.logger.error(f"Error loading ML models: {str(e)}")
            # Continue app startup even if models fail to load
            # Health checks will still pass, and you can debug the model loading issue

    return app