from api.app.extensions import mongo_client
from .connect import fetch_all_symbols_names, fetch_symbol_data, parse_binance_response

db = mongo_client["strade_db"]
col = db["BINANCE"]


def save_symbol_data_to_mongo(symbol,ot,o,l,h,c,v,ct,nots,tbv,tqv):
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



### Symbols data
def get_symbol_data(symbol):
    """ Get a symbol data from database, if not exist fetch from binance, save and return"""
    data = col.find_one({"symbol":symbol})
    if not data:
        resp = fetch_symbol_data(symbol)
        col.insert_one({"symbol": symbol, "data":resp})
        return parse_binance_response(resp)
    
    return parse_binance_response(data['data'])



####Symbols Names
def fetch_and_save_all_symbols_names_to_database():
    """ Fetch all symbols names from the binance remote api """
    symbols = fetch_all_symbols_names()
    col.update_one({"doc_name":"allSymbols"}, {"$set": {"symbols": symbols}}, upsert=True)
    return symbols

def get_all_symbols_names():
    """ Query all symbols from database, if not exist fetch and save """
    r = col.find_one({"doc_name": "allSymbols"})
    if not r:
        fetch_and_save_all_symbols_names_to_database()
        return symbols
    return r['symbols']

