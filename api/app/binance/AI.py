import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from scipy.signal import argrelextrema
from .db_op import get_symbol_data
import math
from sklearn import preprocessing
from collections import deque
import random

# basead on the last 60 candles
SEQ_LEN = 10

# try to predict the next 3 candle
FUTURE_PERIOD_PREDICT = 3


def classify(current, future):
    "If the price is greater in the next FUTURE_PERIOD_PREDICT return 1(buy signal)"
    if float(future) > float(current):
        return 1
    else:
        return 0

def preprocess_df(df):
    df.drop('future', 1, inplace=True)
    
    for col in df.columns:
        if col != "target":
            df[col] = df[col].pct_change()
            df.dropna(inplace=True)
            scalar = preprocessing.MinMaxScaler()
            scalar.fit(df[col].values.reshape(-1, 1))
            # print(scalar.data_max_, scalar.data_min_)
            df[col] = scalar.transform(df[col].values.reshape(-1, 1))

    df.dropna(inplace=True)
    sequential_data = []
    prev_days = deque(maxlen=SEQ_LEN)

    # create a list of lists containing each feature, and remove the target feature
    for i in df.values:
        prev_days.append([n for n in i[:-1]])
        if len(prev_days) == SEQ_LEN:
            sequential_data.append([np.array(prev_days), i[-1]])

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

    return np.array(X), y

def prepare_data(symbol, timeframe):
    data = get_symbol_data(symbol, timeframe)
    close = data['close']
    close_time = data['close_time']
    df = pd.DataFrame(list(zip(data['close_time'], data['close'])), columns=['time','close'])
    df['future'] = df['close'].shift(-FUTURE_PERIOD_PREDICT)
    df['target'] = list(map(classify, df['close'], df['future']))
#     time              close    future     target
# 0    1588694399999  0.023032  0.023034       1
# 1    1588708799999  0.022928  0.023011       1
# 2    1588723199999  0.022753  0.022551       0
# 3    1588737599999  0.023034  0.022453       0
# 4    1588751999999  0.023011  0.022143       0
    
    df.set_index('time', inplace=True)

    # assure that the time is in order and split it
    times = sorted(df.index.values)
    back_slice = int(0.05*len(times))
    last_5pct = times[-back_slice]
    validation_df = df[(df.index >= last_5pct)]
    df = df[(df.index < last_5pct)]

    validation_x, validation_y = preprocess_df(validation_df)
    train_x, train_y = preprocess_df(df)

    print(f"train data size: {len(train_x)}, validation size: {len(validation_x)}")
    print(f"Dont buys: {train_y.count(0)}, buys: {train_y.count(1)}")
    print(f"Validation dont buys: {validation_y.count(0)}, buys: {validation_y.count(1)}")


    

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
