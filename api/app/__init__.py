from flask import Flask
from .binance.views import binance_bp
from flask_socketio import SocketIO

def create_app(config_obj = 'api.app.settings'):
    app = Flask(__name__)
    app.config.from_object(config_obj)
    
    # SocketIO extension
    socketio = SocketIO()
    socketio.init_app(app)
    

    # blueprints
    from .binance import events
    app.register_blueprint(events.bp)
    app.register_blueprint(binance_bp)


    return app