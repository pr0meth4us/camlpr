from asgiref.wsgi import WsgiToAsgi
from app import create_app

asgi_app = WsgiToAsgi(create_app())
