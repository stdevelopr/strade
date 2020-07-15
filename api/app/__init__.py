from flask import Flask
from .binance.views import binance_bp
from .extensions import mongo

def create_app(config_obj = 'app.settings'):
    app = Flask(__name__)
    app.config.from_object(config_obj)
    mongo.init_app(app)
    
    app.register_blueprint(binance_bp)

    return app