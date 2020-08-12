from api.app.extensions import mongo_client
from .remote_op import fetch_all_symbols_names, fetch_symbol_data
from .utils import parse_binance_response_json, parse_binance_response_hdf5
from api.app.indicators import MA, MACD, RSI
import h5py
import numpy as np
db = mongo_client["strade_db"]
col = db["BINANCE"]


def save_symbol_data_to_mongo(symbol,ot,o,l,h,c,v,ct,nots,tbv,tqv):
    col.update_one({"symbol": symbol}, {"$set":{"open_time": ot, "open": o, "low":l, "high":h, "close":c, "volume":v}}, upsert=True)


def process_ma(symbol):
    close = mongo.db[collection].find_one({"symbol":symbol}, {"close": 1, "_id":0})['close']
    ma = MA(close)
    mongo.db[collection].update_one({"symbol":symbol}, {"$set":{"MA": ma.tolist()}})
    return ma

######################### HDF%
def process_macd_hdf5(symbol, timeframe):
    """ Calculates the MACD for a given symbol and save to hdf5 database
    
    Inputs: 
        symbol: string
        timeframe: string
    Returns: a dict with the macd info
    
    """
    with h5py.File("binance.hdf5", "a") as f:
        close = get_symbol_data(symbol, timeframe)['close']
        macd, macdsignal, macdhist = MACD(close)
        arr = np.array([macd, macdsignal, macdhist])
        f[f"{timeframe}/{symbol}/indicators/MACD"] = arr
        f[f"{timeframe}/{symbol}/indicators/MACD"].attrs['column_names'] = ['MACD', 'MACDSIG', 'MACDHIST']
        return {"MACD": macd, "MACDSIG": macdsignal, "MACDHIST": macdhist}

def process_rsi_hdf5(symbol, timeframe):
    """ Calculates the RSI for a given symbol and save to hdf5 database
    
    Inputs: 
        symbol: string
        timeframe: string
    Returns: a dict with the RSI info
    
    """
    with h5py.File("binance.hdf5", "a") as f:
        close = get_symbol_data(symbol, timeframe)['close']
        real = RSI(close)
        f[f"{timeframe}/{symbol}/indicators/RSI"] = real
        return {"RSI": real}




def get_symbol_indicator_hdf5(symbol, indicator, timeframe):
    """ Get the indicator for a given symbol, if it does not exist calculate and save it
    
    Inputs: 
        symbol: string
        indicator: string
        timeframe: string
    Returns: a dict with the indicator info
    
    """
    with h5py.File("binance.hdf5", "a") as f:
        data = f.get(f"{timeframe}/{symbol}/indicators/{indicator}")
        if data:
            if indicator == "MACD":
                return {"MACD": data[0], "MACDSIG": data[1], "MACDHIST": data[2]}
            elif indicator == "RSI":
                return {"RSI": data[0:]}

        else:
            if indicator == "MACD":
                return process_macd_hdf5(symbol, timeframe)
            if indicator == "RSI":
                return process_rsi_hdf5(symbol, timeframe)


def get_all_symbols_indicator(timeframe):
    """ Get the same indicator for all symbols at once """

    with h5py.File("binance.hdf5", "a") as f:
        symbols = f.get(f"/{timeframe}")
        macd_list = []
        for s in symbols:
            indicator = f.get(f"/{timeframe}/{s}/indicators/MACD")
            try:
                macd_list.append({"symbol": s, "MACDHIST": indicator[2]})
            except:
                pass

    return macd_list


def get_symbol_data_mongo(symbol, timeframe):
    """ Get a symbol data from mongo database, if it does not exist fetch from binance, save and return"""
    data = col.find_one({"symbol":symbol, "timeframe": timeframe})
    if not data:
        resp = fetch_symbol_data(symbol, timeframe)
        parsed_resp = parse_binance_response_json(resp)
        col.insert_one({"symbol": symbol, "timeframe":timeframe, "data": parsed_resp})
        return parsed_resp
    
    return data['data']

### Symbols data
def get_symbol_data(symbol, timeframe):
    """ Get a symbol data from database, if it does not exist fetch from binance, save and return"""
    with h5py.File("binance.hdf5", "a") as f:
        data = f.get(f"{timeframe}/{symbol}/data")
        if data:
            r = parse_binance_response_hdf5(data)
            return r
        else:
            resp = fetch_symbol_data(symbol, timeframe)
            resp_arr = np.array(resp).astype(float)
            f[f"{timeframe}/{symbol}/data"] = np.array(resp_arr)
            f[f"{timeframe}/{symbol}/data"].attrs['column_names'] = ['open_time', 'open', 'high', 'low', 'close', 'volume', 'close_time',\
                                                            'quote_asset_volume', 'number_trades', 'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'can_be_ignored']
            r = parse_binance_response_hdf5(f[f"{timeframe}/{symbol}/data"])
            return r

def fill_db_all_symbols_data(timeframe):
    with h5py.File("binance.hdf5", "a") as f:
        for symbol in get_all_symbols_names():
            if f"/{timeframe}/{symbol}" not in f:
                print(f"Fetching {symbol}...")
                resp = fetch_symbol_data(symbol, timeframe)
                resp_arr = np.array(resp).astype(float)
                f[f"{timeframe}/{symbol}/data"] = np.array(resp_arr)
                f[f"{timeframe}/{symbol}/data"].attrs['column_names'] = ['open_time', 'open', 'high', 'low', 'close', 'volume', 'close_time',\
                                                            'quote_asset_volume', 'number_trades', 'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 'can_be_ignored']
                print("Ok.")
        print("Completed")

        return "OK"



def fetch_and_save_all_symbols_names_to_database():
    """ Fetch all symbols names from the binance remote api and save to database """
    symbols = fetch_all_symbols_names()
    with h5py.File("binance.hdf5", "a") as f:
        try:
            f['/all_symbols'] = np.array(symbols, dtype=h5py.string_dtype(encoding='utf-8'))
        except Exception as e:
            print("error", e)
        return symbols


def get_all_symbols_names():
    """ Query and return a list with all symbols from database, if not exist fetch and save """
    with h5py.File("binance.hdf5", "a") as f:
        symbols = f.get('/all_symbols')
        if symbols:
            return list(symbols)
        else:
            return fetch_and_save_all_symbols_names_to_database()








