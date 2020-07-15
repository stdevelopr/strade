import requests
from binance.client import Client
from app.extensions import mongo
from app.indicators import MA, MACD
import os

api_key = os.environ.get("API_KEY")
api_secret = os.environ.get("API_SECRET")
client = Client(api_key, api_secret)
collection = "BINANCE"

def binance_connect():
    response = client.get_exchange_info()
    return response

def get_all_symbols():
    resp = client.get_exchange_info()
    symbols = [i['symbol'] for i in resp['symbols']]
    return symbols


def query_parse_historical_data(symbol):
    # [[
    #     1499040000000,      # Open time
    #     "0.01634790",       # Open
    #     "0.80000000",       # High
    #     "0.01575800",       # Low
    #     "0.01577100",       # Close
    #     "148976.11427815",  # Volume
    #     1499644799999,      # Close time
    #     "2434.19055334",    # Quote asset volume
    #     308,                # Number of trades
    #     "1756.87402397",    # Taker buy base asset volume
    #     "28.46694368",      # Taker buy quote asset volume
    #     "17928899.62484339" # Can be ignored
    # ]]
    candles = client.get_klines(symbol=symbol, interval=Client.KLINE_INTERVAL_30MINUTE)
    ot = []
    o = []
    l = []
    h = []
    c = []
    v = []
    ct = []
    nots = []
    tbv =[]
    tqv = []

    for k in candles:
        ot.append(k[0])
        o.append(float(k[1]))
        h.append(float(k[2]))
        l.append(float(k[3]))
        c.append(float(k[4]))
        v.append(float(k[5]))
        ct.append(k[6])
        nots.append(k[7])
        tbv.append(k[8])
        tqv.append(k[9])

    return  ot,o,l,h,c,v,ct,nots,tbv,tqv


def save_symbol_data_to_mongo(symbol,ot,o,l,h,c,v,ct,nots,tbv,tqv):
    col = mongo.db[collection]
    col.update_one({"symbol": symbol}, {"$set":{"open_time": ot, "open": o, "low":l, "high":h, "close":c, "volume":v}}, upsert=True)


def process_ma(symbol):
    close = mongo.db[collection].find_one({"symbol":symbol}, {"close": 1, "_id":0})['close']
    ma = MA(close)
    mongo.db[collection].update_one({"symbol":symbol}, {"$set":{"MA": ma.tolist()}})
    return ma


def process_macd(symbol):
    close = mongo.db[collection].find_one({"symbol":symbol}, {"close": 1, "_id":0})['close']
    macd, macdsignal, macdhist = MACD(close)
    mongo.db[collection].update_one({"symbol":symbol}, {"$set":{"MACD": macd.tolist(), "MACDSIG": macdsignal.tolist(), "MACDHIST": macdhist.tolist()}})
    return macd, macdsignal, macdhist
    