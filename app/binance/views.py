from flask import Blueprint, jsonify
from .connect import binance_connect, candlestick, get_candlesticks_from_db
import json

binance_bp = Blueprint('binance', __name__, url_prefix='/binance')

@binance_bp.route('/')
def index():
    r = binance_connect()
    return jsonify(r)


@binance_bp.route('/candlestick')
def candlestick_route():
    r = candlestick()
    date = []
    o = []
    h = []
    l = []
    c = [] 
    for k in r:
        date.append(k[0])
        o.append(k[1])
        h.append(k[2])
        l.append(k[3])
        c.append(k[4])

    import plotly.graph_objects as go
    from datetime import datetime


    fig = go.Figure(data=[go.Candlestick(x=date,
                    open=o,
                    high=h,
                    low=l,
                    close=c)])

    fig.show()
    return jsonify(r)


@binance_bp.route('/return_from_db')
def return_from_db():
    r = get_candlesticks_from_db()
    return jsonify(r)