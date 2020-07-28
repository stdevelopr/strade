import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from scipy.signal import argrelextrema
from .db_op import get_symbol_data
import math

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
