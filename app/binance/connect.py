import requests
from binance.client import Client
from app.extensions import mongo
import os

api_key = os.environ.get("API_KEY")
api_secret = os.environ.get("API_SECRET")
client = Client(api_key, api_secret)

def binance_connect():
    response = client.get_exchange_info()
    return response

def candlestick():
    candles = client.get_klines(symbol='BNBBTC', interval=Client.KLINE_INTERVAL_30MINUTE)
    doc = mongo.db.bnb.insert({'data':candles, 'symbol':'BNBBTC'})
    return candles

def get_candlesticks_from_db():
    response = mongo.db.bnb.find_one({"symbol":'BNBBTC'})
    return response['data']