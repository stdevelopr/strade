import requests
from binance.client import Client
# from api.app.extensions import mongo_client
from api.app.indicators import MA, MACD
import os

api_key = os.environ.get("API_KEY")
api_secret = os.environ.get("API_SECRET")
client = Client(api_key, api_secret)

# db = mongo_client.strade_db
# col = db["BINANCE"]

def binance_connect():
    response = client.get_exchange_info()
    return response

def fetch_all_symbols_names():
    """ Returns a list of the symbols names directly from the exchange """
    resp = client.get_exchange_info()
    symbols = [i['symbol'] for i in resp['symbols']]
    return symbols

def fetch_symbol_data(symbol):
    """ Returns the data for a given symbol """
    # Binance response data format
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
    data = client.get_klines(symbol=symbol, interval=Client.KLINE_INTERVAL_30MINUTE)
    return data


def parse_binance_response(data):
    """ Split the binance response format into independent lists for each entry"""
    # Binance response format
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

    for k in data:
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
    