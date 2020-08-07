import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from scipy.signal import argrelextrema
from .db_op import get_symbol_data, get_symbol_indicator
import math
from sklearn import preprocessing
from collections import deque
import random
import keras
from keras import models
from keras import layers, optimizers
from keras.callbacks import TensorBoard
import tensorflow as tf
import shutil


# config = tf.compat.v1.ConfigProto()
# config.gpu_options.allow_growth = True
# session = tf.compat.v1.Session(config=config)

# uncomment to use CPU
import os
os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"] = ""



# basead on the last 60 candles
SEQ_LEN = 3

# try to predict the next 3 candle
FUTURE_PERIOD_PREDICT = 3

NAME = "ai_model"
tensorboard = TensorBoard(log_dir=f'logs/{NAME}')
RATIO = "LTC-USD"


def classify(current, future):
    "If the price is greater in the next FUTURE_PERIOD_PREDICT return 1(buy signal)"
    if float(future) > float(current):
        return 1
    else:
        return 0

def scale_column(col_values):
    """ Scale the values of a column between 0 and 1 """

    scalar = preprocessing.MinMaxScaler()
    scalar.fit(col_values)
    # print(scalar.data_max_, scalar.data_min_)
    return scalar.transform(col_values)


def preprocess_df(df):
    df.drop('future', 1, inplace=True)
    
    for col in df.columns:
        if col != "target":
            df[col] = df[col].pct_change()
            df.dropna(inplace=True)
            df[col] = scale_column(df[col].values.reshape(-1, 1))

    df.dropna(inplace=True)
    sequential_data = []
    prev_days = deque(maxlen=SEQ_LEN)

    # create a list of lists containing each feature, and remove the target feature
    for i in df.values:
        prev_days.append([n for n in i[:-1]])
        if len(prev_days) == SEQ_LEN:
            sequential_data.append([list(prev_days), i[-1]])

    random.shuffle(sequential_data)

    buys = []
    sells = []

    for seq, target in  sequential_data:
        if target == 1:
            buys.append([seq, target])
        elif target == 0:
            sells.append(([seq, target]))

    random.shuffle(buys)
    random.shuffle(sells)

    # equalize buys and sells
    lower = min(len(buys), len(sells))
    buys = buys[:lower]
    sells = sells[:lower]

    sequential_data = buys+sells

    random.shuffle(sequential_data)

    # split x and y
    X = []
    y = []

    for seq, target in sequential_data:
        X.append(seq)
        y.append(target)


    return np.array(X), np.array(y)

def load_model():
    # load json and create model
    json_file = open('model.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = models.model_from_json(loaded_model_json)
    # load weights into new model
    loaded_model.load_weights("model.h5")
    print("Loaded model from disk")

    return loaded_model


def train_model(network, train_x, train_y, validation_x, validation_y):
    val_dataset = tf.data.Dataset.from_tensor_slices((validation_x, validation_y))
    val_dataset = val_dataset.batch(5)

    network.fit(train_x, train_y, epochs=10, batch_size=5, validation_data=val_dataset, callbacks=[tensorboard])

    # # serialize model to JSON
    # model_json = network.to_json()
    # with open("model.json", "w") as json_file:
    #     json_file.write(model_json)
    # # serialize weights to HDF5
    # network.save_weights("model.h5")
    # print("Saved model to disk")


    # predictions = network.predict([test_images])
    # print(np.argmax(predictions[0]))
    return network

def buid_model(input_shape):
    with tf.device('/cpu:0'):
        network = models.Sequential()
        # network.add(layers.Flatten())
        print("SEquential model")
        network.add(layers.LSTM(128, input_shape=input_shape, return_sequences=True))
        network.add(layers.Dropout(0.2))
        network.add(layers.BatchNormalization())

        network.add(layers.LSTM(128, input_shape=input_shape, return_sequences=True))
        network.add(layers.Dropout(0.2))
        network.add(layers.BatchNormalization())

        network.add(layers.LSTM(128, input_shape=input_shape, return_sequences=True))
        network.add(layers.Dropout(0.2))
        network.add(layers.BatchNormalization())


        network.add(layers.Dense(128, activation='relu'))
        network.add(layers.Dropout(0.2))
        network.add(layers.Dense(2, activation='softmax'))
        # keras.utils.plot_model(network, show_shapes=True)

        opt = keras.optimizers.Adam(learning_rate=0.001, decay=1e-6)
        print("Before compile model")
        network.compile(optimizer=opt, loss='binary_crossentropy', metrics='accuracy', run_eagerly=False)
        print("Model compiled")

        return network


def get_dict_indicator(symbol, timeframe, indicator):
    """ Return a dictionary for a given indicator """
    if indicator == "MACD":
        macd = get_symbol_indicator(symbol, timeframe=timeframe, indicator="MACD")
        macd.pop("MACD")
        macd.pop("MACDSIG")
        return macd
    elif  indicator == "RSI":
        rsi = get_symbol_indicator(symbol, timeframe=timeframe, indicator="RSI")
        return {"RSI": rsi}


def create_dataframe(symbol, timeframe, columns, index_column, indicators=[]):
    """ Create a data frame from a given symbol with specified columns and indicators"""
    print("Num GPUs Available: ", tf.test.is_gpu_available(cuda_only=False, min_cuda_compute_capability=None))
    print("TFF", print(tf.__version__))

    main_df = pd.DataFrame()
    ratios = ["BTC-USD", "LTC-USD", "ETH-USD", "BCH-USD"]
    for ratio in ratios:
        dataset = f"crypto_data/{ratio}.csv"
        df = pd.read_csv(dataset, names=['time', 'low', 'high', 'open', 'close', 'volume'])
        df.rename(columns={"close":f"{ratio}_close", "volume":f"{ratio}_volume"}, inplace=True)
        df.set_index("time", inplace=True)
        df = df[[f"{ratio}_close", f"{ratio}_volume"]]

        if len(main_df) == 0:
            main_df = df
        else:
            main_df = main_df.join(df)

    main_df['future'] = main_df[f"{RATIO}_close"].shift(-FUTURE_PERIOD_PREDICT)
    main_df['target'] = list(map(classify, main_df[f"{RATIO}_close"], main_df[f"future"]))


    # data = get_symbol_data(symbol, timeframe)
    # data_dict = {c: data[c] for c in columns}
    # # df_dict = {**data_dict}
    # for i in indicators:
    #     indicators_data = get_dict_indicator(symbol, timeframe=timeframe, indicator=i)
    #     data_dict = {**data_dict, **indicators_data}
    # df = pd.DataFrame(data_dict)
    # df.set_index(index_column, inplace=True)
    return main_df

def prepare_data(symbol, timeframe, columns, index_column, indicators=[]):
    if 'close' not in columns:
        columns.append('close')
        close = False
    else:
        close = True

    df = create_dataframe(symbol, timeframe, columns, index_column, indicators)
    # df['future'] = df['close'].shift(-FUTURE_PERIOD_PREDICT)
    # df['target'] = list(map(classify, df['close'], df['future']))
    
    # if not close:
    #     df.drop('close', 1, inplace=True)
    times = sorted(df.index.values)
    back_slice = int(0.05*len(times))
    last_5pct = times[-back_slice]
    validation_df = df[(df.index >= last_5pct)]
    df = df[(df.index < last_5pct)]
    validation_x, validation_y = preprocess_df(validation_df)
    train_x, train_y = preprocess_df(df)

    return train_x, train_y, validation_x, validation_y



def calculate_extrema(symbol, timeframe):
    data = get_symbol_data(symbol, timeframe)
    df = pd.DataFrame(data['close'], columns=['data'])

    n=10 # number of points to be checked before and after 
    # Find local peaks
    df['min'] = df.iloc[argrelextrema(df.data.values, np.less_equal, order=n)[0]]['data']
    df['max'] = df.iloc[argrelextrema(df.data.values, np.greater_equal, order=n)[0]]['data']
    min_points = df['min'].tolist()
    max_points = df['max'].tolist()

    min_close_time = []
    max_close_time = []

    for index,value in enumerate(min_points):
        if not math.isnan(value):
            min_close_time.append(data['close_time'][index])

    for index,value in enumerate(max_points):
        if not math.isnan(value):
            max_close_time.append(data['close_time'][index])

    

    return {"max": max_close_time, "min":min_close_time}
