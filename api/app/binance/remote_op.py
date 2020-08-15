import requests
from binance.client import Client
from binance.websockets import BinanceSocketManager
from flask_socketio import emit
import os

api_key = os.environ.get("API_KEY")
api_secret = os.environ.get("API_SECRET")
client = Client(api_key, api_secret)

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


bm = BinanceSocketManager(client)
actual_prices = []
loop_event = [False]


def socket_connect():
    loop_event.clear()
    loop_event.append(True)
    # start any sockets here, i.e a trade socket
    global conn_key
    conn_key = bm.start_trade_socket('BNBBTC', process_message)
    # then start the socket manager
    bm.start()

def socket_stop():
    loop_event.clear()
    loop_event.append(False)
    bm.stop_socket(conn_key)


def process_message(msg):
    actual_prices.append(msg)
    if len(actual_prices) > 5:
        actual_prices.clear()

def binance_connect() -> object:
    """ Return the exchange info """
    response = client.get_exchange_info()
    return response

def fetch_all_symbols(log=False) -> list:
    """ Returns a list of dicts containing the symbols info directly from the exchange """
    resp = client.get_exchange_info()
    if log:
            print(resp)
    symbols = [{"symbol": i["symbol"], "baseAsset": i["baseAsset"], "quoteAsset": i["quoteAsset"], "status": i["status"]} for i in resp["symbols"]]
    return symbols

def fetch_symbol_data(symbol:str, timeframe:str, *, limit=1000 ) -> list :
    """ Returns the data for a given symbol """
    print(f"fetching {symbol}, timeframe: {timeframe}")

    data = client.get_klines(symbol=symbol, interval=timeframe, limit=limit)
    return data

def get_symbol_info(symbol):
        info = client.get_symbol_info(symbol)
        return info

def get_balance():
        assets = get_assets()
        btc_sum = []
        for a in assets:
                if a['asset'] != "BTC":
                        asset_qtd = float(a["free"]) + float(a["locked"])
                        avg_price = client.get_avg_price(symbol=a["asset"]+"BTC")
                        btc_sum.append(float(avg_price['price'])*asset_qtd)
                else:
                        btc_sum.append(float(a["free"]) + float(a["locked"]))

        return sum(btc_sum)

def get_assets():
        assets_list = []
        info = client.get_account()
        for i in info['balances']:
                if float(i["free"])!=0 or float(i["locked"]) !=0:
                        assets_list.append(i)
        return assets_list

    