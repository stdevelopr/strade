from api.app.extensions import mongo_client
from .remote_op import fetch_all_symbols, fetch_symbol_data
from .utils import parse_binance_response_hdf5
from api.app.indicators import MACD, RSI
import h5py
import numpy as np
from datetime import datetime
from flask import jsonify
import json

db = mongo_client["strade_db"]
col = db["BINANCE"]

# def save_symbol_data_to_mongo(symbol,ot,o,l,h,c,v,ct,nots,tbv,tqv):
#     col.update_one({"symbol": symbol}, {"$set":{"open_time": ot, "open": o, "low":l, "high":h, "close":c, "volume":v}}, upsert=True)


# def process_ma(symbol):
#     close = mongo.db[collection].find_one({"symbol":symbol}, {"close": 1, "_id":0})['close']
#     ma = MA(close)
#     mongo.db[collection].update_one({"symbol":symbol}, {"$set":{"MA": ma.tolist()}})
#     return ma

# HDF%
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
        print("saving macd", symbol)
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


###########################################################
def fill_db_indicator_hdf5(indicator, timeframe):
    """ Calculates the indicator for all symbols pairs and save it
    
    Inputs: 
        indicator: string
        timeframe: string
    Returns: json status
    
    """
    with h5py.File("binance.hdf5", "a") as f:
        symbols = get_all_symbols_names()
        for symbol in symbols:
            try:
                print(f[f"{timeframe}/{symbol}/data"].attrs.get("last_update"))
            except:
                get_symbol_data(symbol, timeframe)
                print(f[f"{timeframe}/{symbol}/data"].attrs.get("last_update"))
                
            process_macd_hdf5(symbol, timeframe)



def refresh_all_symbols_data(timeframe):
    """ Substitute all saved data for all pairs for a timeframe with new data.

    Inputs:
        timeframe: string
    Returns: dict
        symbol: string
        MACDHIST: numpy array
    
    """
    with h5py.File("binance.hdf5", "a") as f:
        symbols = get_all_symbols_names()
        for symbol in symbols:
            try:
                print("DEL")
                del f[f"/{timeframe}/{symbol}"]
            except Exception as e:
                print(e)





def get_all_symbols_indicator(timeframe):
    """ Get the same indicator (MACD) for all symbols at once

    Inputs:
        timeframe: string
    Returns: dict
        symbol: string
        MACDHIST: numpy array
    
    """

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


# Symbols data
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
            f[f"{timeframe}/{symbol}/data"].attrs['column_names'] = [
                'open_time', 'open', 'high', 'low', 'close', 'volume', 
                'close_time', 'quote_asset_volume', 'number_trades', 
                'taker_buy_base_asset_volume', 'taker_buy_quote_asset_volume', 
                'can_be_ignored']
            f[f"{timeframe}/{symbol}/data"].attrs["last_update"] = datetime.timestamp(datetime.now())
            r = parse_binance_response_hdf5(f[f"{timeframe}/{symbol}/data"])
            return r


def fill_db_all_symbols_data(timeframe):
    """ Fetchs the data for all symbols and save to database
    
    Inputs: 
        timeframe: string
    Returns: "OK"
    
    """
    with h5py.File("binance.hdf5", "a") as f:
        for symbol in get_all_symbols_names():
            if f"/{timeframe}/{symbol}" not in f:
                print(f"Fetching {symbol}...")
                resp = fetch_symbol_data(symbol, timeframe)
                resp_arr = np.array(resp).astype(float)
                f[f"{timeframe}/{symbol}/data"] = np.array(resp_arr)
                f[f"{timeframe}/{symbol}/data"].attrs['column_names'] = [
                    'open_time', 'open', 'high', 'low', 'close', 'volume', 
                    'close_time', 'quote_asset_volume', 'number_trades', 
                    'taker_buy_base_asset_volume', 
                    'taker_buy_quote_asset_volume', 'can_be_ignored']
                f[f"{timeframe}/{symbol}/data"].attrs["last_update"] = datetime.timestamp(datetime.now())
                print("Ok.")
                
        print("Completed")

        return "OK"


def fetch_and_save_all_symbols_to_database():
    """ Fetchs all symbols from the binance remote api and save to database

    Inputs:
    Returns: a list with all symbols names(strings)
    
    """
    symbols = fetch_all_symbols()
    with h5py.File("binance.hdf5", "a") as f:
        try:
            del f['/all_symbols']
            f['/all_symbols'] = np.array(symbols, dtype=h5py.string_dtype(encoding='utf-8'))
        except Exception as e:
            print("error", e)
        return symbols


def get_all_symbols(refresh=False) -> 'a list of dicts':
    """ Gets all symbols
    
    Inputs: 
    Returns: a list of dicts containing the symbols info    
    """
    with h5py.File("binance.hdf5", "a") as f:
        symbols = f.get('/all_symbols')
        if symbols and not refresh:
            return list(symbols)
        else:
            return fetch_and_save_all_symbols_to_database()


def get_all_symbols_names(refresh=False) -> list:
    """ Gets all symbols names
    
    Inputs: 
    Returns: a list with all symbols names(strings)
    
    """
    with h5py.File("binance.hdf5", "a") as f:
        symbols = f.get('/all_symbols')
        if symbols and not refresh:
            return [json.loads(s.replace("'", "\""))['symbol'] for s in symbols]
        else:
            return fetch_and_save_all_symbols_to_database()








