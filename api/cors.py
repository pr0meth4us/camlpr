import os
from flask_cors import CORS

def init_cors(app):
    """
    Initialize CORS on Flask `app`, reading ALLOWED_ORIGINS from the environment.
    Expects ALLOWED_ORIGINS as a comma-separated list, e.g.
      ALLOWED_ORIGINS="http://localhost:3000,https://my-next-app.com"
    """
    raw = os.getenv("ALLOWED_ORIGINS", "")
    origins = [u.strip() for u in raw.split(",") if u.strip()]
    if not origins:
        # fallback to allowing all (not recommended in prod)
        origins = "*"

    CORS(
        app,
        resources={
            r"/api/*": {"origins": origins}
        },
        supports_credentials=True,
        methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )
