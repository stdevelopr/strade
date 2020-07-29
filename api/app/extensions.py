from pymongo import MongoClient
from flask_socketio import SocketIO

mongo_client = MongoClient()
socketio = SocketIO(logger=True)