from flask import Blueprint, jsonify, current_app
from .remote_op import binance_connect, socket_connect, socket_stop
from .db_op import process_ma,save_symbol_data_to_mongo,  get_all_symbols_names, get_symbol_data,  get_symbol_indicator_hdf5, fill_db_all_symbols_data
from .hunting import hunt_macd
from .trading import simulate_macd_trade, simulate_macd_trade_crossover, simulate_rsi_trade
from .prophet_forecast import forecast_data
from .AI import calculate_extrema, prepare_data, buid_model, train_model
import json
from api.app.extensions import mongo_client, socketio
from .io_blueprint import IOBlueprint
import numpy as np
import shutil

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
    
    data = get_symbol_indicator_hdf5(symbol, "MACD", timeframe)
    macd = data['MACD']
    signal = data['MACDSIG']
    histogram = data['MACDHIST']
    return jsonify({"macd": macd.tolist(), "signal": signal.tolist(), "histogram": histogram.tolist()})


@binance_bp.route('/indicator/rsi/<symbol>/<timeframe>')
def get_rsi_route(symbol,timeframe):
    data = get_symbol_indicator_hdf5(symbol, "RSI", timeframe)
    rsi = data["RSI"]

    return jsonify({"SYMBOL": symbol, "data": rsi.tolist()})

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
    # shutil.rmtree('logs')
    train_x, train_y, test_x, test_y = prepare_data(symbol, timeframe, columns=['close_time', 'close','volume'], index_column='close_time', indicators=[])
    print("Train_x shape", train_x.shape)
    print(train_x)
    shape_x = train_x.shape[1:]
    # train _x and train_y shape must match the number of dim
    train_y.shape += (1,1)
    # train_x = train_x.reshape(-1, shape_x)
    # test_x = test_x.reshape(-1, shape_x)
    test_y.shape += (1,1)

    print("Sample shape", shape_x)

    print(f"train: {len(train_x)} validation:{len(train_y)}")
    print(f"dont buy {(test_y==0).sum()} , buys {(test_y==1).sum()}")
    print(f"validation dont buy {(test_y==0).sum()} , validation buys {(test_y==1).sum()}")

    network = buid_model(shape_x)
    network = train_model(network, train_x, train_y, test_x, test_y)
    # # # y_new = network.predict(test_x)
    # # # print("Prediction", y_new)
    # # # print("A", np.argmax(y_new, axis=1))
    # test_loss, test_acc = network.evaluate(test_x, test_y)
    # print("Loss", test_loss, "Acc", test_acc)



    return jsonify({"train_x": train_x.tolist()})


#######################################


# ADMIN ##############################
@binance_bp.route('/admin/fill_db/<timeframe>')
def fill_db(timeframe):
    result = fill_db_all_symbols_data(timeframe)
    return jsonify(result)

