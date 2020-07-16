from flask import Blueprint, jsonify
from .connect import binance_connect, process_ma, get_all_symbols, query_parse_historical_data, save_symbol_data_to_mongo, process_macd
import json
from app.extensions import mongo


binance_bp = Blueprint('binance', __name__, url_prefix='/api/binance')

@binance_bp.route('/')
def index():
    """ Connect to binance and return the exchange info """
    r = binance_connect()
    return jsonify(r)

@binance_bp.route('/all_symbols')
def all_pairs():
    """ Fetch and return a list with all symbols """
    resp = get_all_symbols()
    return jsonify(resp)

@binance_bp.route('/extract/<symbol>')
def extract_symbol(symbol):
    """ Fetch data for a specific symbol and process it to database """
    ot,o,l,h,c,v,ct,nots,tbv,tqv = query_parse_historical_data(symbol)
    save_symbol_data_to_mongo(symbol,ot,o,l,h,c,v,ct,nots,tbv,tqv)
    return jsonify({"o":o, "h":h, "l":l, "c":c, "ot":ot, "v":v, "ct":ct})


@binance_bp.route('/plot/<symbol>')
def candlestick_route(symbol):
    """ Fetch data and plot it for a specific symbol"""

    ot,o,l,h,c,v,ct,nots,tbv,tqv = query_parse_historical_data(symbol)

    import plotly.graph_objects as go
    from datetime import datetime
    import plotly.express as px
    fig = go.Figure()

    fig.add_trace(go.Candlestick(x=ot,
                    open=o,
                    high=h,
                    low=l,
                    close=c))

    # ma = calculate_ma(symbol)
    # fig.add_trace(
    # go.Scatter(
    #     x=ot,
    #     y=ma[0]
    # ))

    fig.show()
    return "OK"

@binance_bp.route('/process_ma/<symbol>')
def calculate_ma_route(symbol):
    """Calculate the MA for a symbol and save it to database"""

    r = process_ma(symbol)
    return jsonify({"ma": str(r)})

@binance_bp.route('/process_macd/<symbol>')
def calculate_macd_route(symbol):
    """Calculate the MACD for a symbol and save it to database"""
    r = process_macd(symbol)
    return jsonify({"macd": str(r)})

@binance_bp.route('/trade/<symbol>')
def trade(symbol):
    from datetime import datetime
    data = mongo.db["BINANCE"].find_one({"symbol":symbol}, {"_id":0, "open_time":1, "MACD":1, "close": 1})
    ot = data["open_time"]


    dt = [datetime.fromtimestamp(int(val)/1000) for val in ot]

    macd = data["MACD"]
    close = data["close"]
    stop = False
    profit = []
    buy = []
    sell = []
    buy_sign = False
    for i in range(len(macd)):
        if i!=0 and i!=len(macd)-1:
            if macd[i] <= 0 and macd[i+1] >0:
                # buy
                buy.append(close[i])
                buy_sign = True
                buy_val = close[i]
                print("BUY", dt[i], close[i])
            elif macd[i] >= 0 and macd[i+1] <0 and buy_sign==True:
                sell.append(close[i])
                profit.append(close[i] - buy_val)
                buy_sign = False
                print("SELL", dt[i], close[i])

    # print(sum(profit))
    profit_sum = sum(profit)

    # import plotly.graph_objects as go
    # from datetime import datetime
    # import plotly.express as px
    # fig = go.Figure()

    # fig.add_trace(
    # go.Scatter(
    #     x=dt,
    #     y=macd
    # ))


    # fig.show()


    return jsonify({"SYMBOL": symbol, "profit": profit_sum})
