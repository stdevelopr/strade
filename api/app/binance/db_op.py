from api.app.extensions import mongo_client
from .remote_op import fetch_all_symbols_names, fetch_symbol_data
from .utils import parse_binance_response
from api.app.indicators import MA, MACD, RSI

db = mongo_client["strade_db"]
col = db["BINANCE"]


def save_symbol_data_to_mongo(symbol,ot,o,l,h,c,v,ct,nots,tbv,tqv):
    col.update_one({"symbol": symbol}, {"$set":{"open_time": ot, "open": o, "low":l, "high":h, "close":c, "volume":v}}, upsert=True)


def process_ma(symbol):
    close = mongo.db[collection].find_one({"symbol":symbol}, {"close": 1, "_id":0})['close']
    ma = MA(close)
    mongo.db[collection].update_one({"symbol":symbol}, {"$set":{"MA": ma.tolist()}})
    return ma


def process_macd(symbol, timeframe):
    close = col.find_one({"symbol":symbol, "timeframe": timeframe}, {"data.close": 1, "_id":0})['data']['close']
    macd, macdsignal, macdhist = MACD(close)
    col.update_one({"symbol":symbol, "timeframe":timeframe}, {"$set": {"indicators.MACD": {"MACD": macd.tolist(), "MACDSIG": macdsignal.tolist(), "MACDHIST": macdhist.tolist()}}})
    return macd, macdsignal, macdhist

def process_rsi(symbol, timeframe='30m'):
    close = col.find_one({"symbol":symbol, "timeframe":timeframe}, {"data.close": 1, "_id":0})['data']['close']
    real = RSI(close)
    col.update_one({"symbol":symbol, "timeframe":timeframe}, {"$set": {"indicators.RSI": real.tolist()}})
    return real


### Symbols indicators
def get_symbol_indicator(symbol, indicator, timeframe):
    """ Get the indicator for a given symbol, if it does not exist calculate and save it """

    data = col.find_one({"symbol":symbol, "timeframe":timeframe}, {"_id":0, "data":1, "indicators": 1})
    if "indicators" not in data or indicator not in data['indicators']:
        if indicator == "MACD":
            process_macd(symbol, timeframe)
        if indicator == "RSI":
            process_rsi(symbol, timeframe)
        return col.find_one({"symbol":symbol}, {"_id":0, "data":1, "indicators": 1})

    return data

def get_all_symbols_indicator(timeframe):
    """ Get the same indicator for all symbols at once """
    data = col.find({"timeframe": timeframe, "indicators.MACD": { "$exists": True }}, {"indicators.MACD": 1, "symbol": 1, "_id": 0})

    return list(data)

### Symbols data
def get_symbol_data(symbol, timeframe):
    """ Get a symbol data from database, if it does not exist fetch from binance, save and return"""
    data = col.find_one({"symbol":symbol, "timeframe": timeframe})
    if not data:
        resp = fetch_symbol_data(symbol, timeframe)
        parsed_resp = parse_binance_response(resp)
        col.insert_one({"symbol": symbol, "timeframe":timeframe, "data": parsed_resp})
        return parsed_resp
    
    return data['data']



####Symbols Names
def fetch_and_save_all_symbols_names_to_database():
    """ Fetch all symbols names from the binance remote api """
    symbols = fetch_all_symbols_names()
    col.update_one({"doc_name":"allSymbols"}, {"$set": {"symbols": symbols}}, upsert=True)
    return symbols

def get_all_symbols_names():
    """ Query and return a list with all symbols from database, if not exist fetch and save """
    r = col.find_one({"doc_name": "allSymbols"})
    if not r:
        fetch_and_save_all_symbols_names_to_database()
        return symbols
    return r['symbols']




