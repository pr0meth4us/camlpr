import os
import logging
from asgiref.wsgi import WsgiToAsgi

# Configure logging before importing the app
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Import after logging configuration
from app import create_app

# Create Flask app
flask_app = create_app()

# Convert to ASGI
asgi_app = WsgiToAsgi(flask_app)

# Log successful startup
logging.info(f"ASGI app initialized, listening on port {os.environ.get('PORT', '5328')}")