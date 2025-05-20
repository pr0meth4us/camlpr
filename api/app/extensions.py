import os
from flask_cors import CORS


def init_cors(app):
    raw = os.getenv("ALLOWED_ORIGINS", "")
    origins = [o.strip() for o in raw.split(",") if o.strip()] or "*"
    CORS(app,
         resources={r"/api/*": {"origins": origins}},
         supports_credentials=True,
         methods=["GET", "POST", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"])
