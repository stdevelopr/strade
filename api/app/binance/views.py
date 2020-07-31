from flask import Blueprint, jsonify, current_app
from .remote_op import binance_connect, socket_connect, socket_stop
from .db_op import process_ma,save_symbol_data_to_mongo, process_macd, get_all_symbols_names, get_symbol_data,  get_symbol_indicator
from .hunting import hunt_macd
from .trading import simulate_macd_trade, simulate_macd_trade_crossover, simulate_rsi_trade
from .prophet_forecast import forecast_data
from .AI import calculate_extrema, prepare_data, buid_model, apply_model
import json
from api.app.extensions import mongo_client, socketio
from .io_blueprint import IOBlueprint

from .events import handle_message

binance_bp = Blueprint('binance', __name__, url_prefix='/api/binance')
socket = IOBlueprint('binance', __name__)

@binance_bp.route('/')
def index():
    """ Connect to binance and return the exchange info """
    r = binance_connect()
    return jsonify(r)


#SYMBOLS #########################################################

@binance_bp.route('/all_symbols')
def all_pairs():
    """ Fetch and return a list with all symbols """
    try:
        resp = get_all_symbols_names()
        return jsonify(resp)
    except:
        return jsonify("error"),500

@binance_bp.route('/all_timeframes')
def all_timeframes():
    """ Return a list with all timeframes """
    
    return jsonify({"timeframes": ["30m", "4h", "1d"]})

@binance_bp.route('/get/<symbol>/<timeframe>')
def get_symbol(symbol, timeframe):
    """ Returns data for a specific symbol """

    return jsonify(get_symbol_data(symbol, timeframe))

################################################################


# INDICATORS############################################################

@binance_bp.route('/indicator/macd/<symbol>/<timeframe>')
def calculate_macd_route(symbol, timeframe):
    """Calculate the MACD for a symbol and return it"""
    
    data = get_symbol_indicator(symbol, "MACD", timeframe)
    macd = data['indicators']['MACD']['MACD']
    signal = data['indicators']['MACD']['MACDSIG']
    histogram = data['indicators']['MACD']['MACDHIST']
    return jsonify({"macd": macd, "signal": signal, "histogram": histogram})


@binance_bp.route('/indicator/rsi/<symbol>/<timeframe>')
def get_rsi_route(symbol,timeframe):
    data = get_symbol_indicator(symbol, "RSI", timeframe)
    rsi = data["indicators"]["RSI"]

    return jsonify({"SYMBOL": symbol, "data": rsi})

##################################################################



# SIMULATE TRADE #########################################################

@binance_bp.route('/simulate/macd_cross/<symbol>/<timeframe>')
def simulate_macd_crossover(symbol, timeframe):

    profit = simulate_macd_trade_crossover(symbol, timeframe)

    return jsonify({"SYMBOL": symbol, "data": profit})


@binance_bp.route('simulate/rsi/<symbol>/<timeframe>')
def simulate_rsi(symbol, timeframe):

    profit = simulate_rsi_trade(symbol, timeframe)

    return jsonify({"SYMBOL": symbol, "data": profit})


@binance_bp.route('/simulate/macd_simple/<symbol>/<timeframe>')
def simulate_macd_simple(symbol, timeframe):

    profit = simulate_macd_trade(symbol, timeframe)

    return jsonify({"SYMBOL": symbol, "data": profit})
    
#################################################################


# HUNTING PAIRS ###############################################
@binance_bp.route('/hunt/macd/<timeframe>')
def hunting_macd(timeframe):
    pairs_info = hunt_macd(timeframe)

    return jsonify({"pairs_info": pairs_info})




####################################################


# PROPHET #################################
@binance_bp.route('/prophet/<symbol>')
def prophet_forecast(symbol):
    data = get_symbol_data(symbol)
    before, future, last_date, forecast = forecast_data(symbol, 1)
    before = before['y'].values[0]
    last_date = last_date['y'].values[0]
    print("GREATER", last_date > before)
    print('FORECAST GREATER', list(forecast['yhat'].values())[0] > before)

    return jsonify({"forecast": forecast})

#############################################

# Real Time ######################
@binance_bp.route('/realtime/connect/<symbol>/<timeframe>')
def real_time(symbol, timeframe):
    print("Connect")
    socket_connect()

    return jsonify("OK")

@binance_bp.route('/realtime/stop')
def real_time_stop():
    print("Stop")
    socket_stop()

    return jsonify("OK")

#############################################


# AI ###########################################
@binance_bp.route('/ai/calculate_extrema//<symbol>/<timeframe>')
def ai_extrema(symbol, timeframe):
    result = calculate_extrema(symbol, timeframe)
    return jsonify(result)

@binance_bp.route('/ai/prepare_data/<symbol>/<timeframe>')
def prepare_data_route(symbol, timeframe):
    train_x, train_y, test_x, test_y = prepare_data(symbol, timeframe)
    
    data_shape = train_x.shape[1:]

    network = buid_model(data_shape)
    print(network.summary())
    test_loss, test_acc = apply_model(network, train_x, train_y, test_x, test_y)

    print("Loss", test_loss, "Acc", test_acc)



    return jsonify({"train_x": train_x.tolist()})




#######################################



