from flask import Blueprint, jsonify
from .connect import binance_connect, process_ma, get_all_symbols, query_parse_historical_data, save_symbol_data_to_mongo, process_macd
import json


binance_bp = Blueprint('binance', __name__, url_prefix='/binance')

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
    return "OK"


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