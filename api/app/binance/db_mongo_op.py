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

    return data['indicators'][indicator]

def get_all_symbols_indicator(timeframe):
    """ Get the same indicator for all symbols at once """
    data = col.find({"timeframe": timeframe, "indicators.MACD": { "$exists": True }}, {"indicators.MACD": 1, "symbol": 1, "_id": 0})

    return list(data)


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