from .db_hdf5 import get_symbol_indicator_hdf5, col
import numpy as np

def simulate_macd_trade(symbol, timeframe):
    """
    Buy every time the macd rise from begative to positive, and sell on the contrary
    Always considering the close value of the last candle
    """
    from datetime import datetime
    data = get_symbol_indicator(symbol, "MACD", timeframe)
    ct = data['data']["close_time"]
    macd = data["indicators"]["MACD"]["MACD"]
    close = data['data']["close"]



    buy_time_list = []
    sell_time_list = []
    buy_values_list = []
    sell_values_list = []

    # get the index where crosses take place
    buy_index, sell_index = detect_lines_crosses_index(np.zeros(len(macd)), macd)

    

    # getting the times and values where the macd cross the zero up
    for k in buy_index:   
        buy_time_list.append(ct[k])
        buy_values_list.append(close[k])

    # getting the times and values where the macd cross the zero down
    for k in sell_index:   
        sell_time_list.append(ct[k])
        sell_values_list.append(close[k])

    profit = calculate_profit_long(buy_time_list, sell_time_list, buy_values_list, sell_values_list)

    return {"profit": profit, "buy": buy_time_list, "sell": sell_time_list}


def simulate_macd_trade_crossover(symbol, timeframe):
    """ Simulate a buy when the MACD line cross the signal line, and calculate the profit """

    data = get_symbol_indicator(symbol, "MACD", timeframe)

    ct = data['data']["close_time"]
    macd = data["indicators"]["MACD"]["MACD"]
    signal = data["indicators"]["MACD"]["MACDSIG"]
    close = data['data']["close"]

    # get the index where crosses take place
    buy_index, sell_index = detect_lines_crosses_index(signal, macd)

    buy_time_list = []
    sell_time_list = []
    buy_values_list = []
    sell_values_list = []

    # getting the times and values where the macd cross the zero up
    for k in buy_index:   
        buy_time_list.append(ct[k])
        buy_values_list.append(close[k])

    # getting the times and values where the macd cross the zero down
    for k in sell_index:   
        sell_time_list.append(ct[k])
        sell_values_list.append(close[k])

    profit = calculate_profit_long(buy_time_list, sell_time_list, buy_values_list, sell_values_list)

    return {"profit": profit, "buy": buy_time_list, "sell": sell_time_list}


def simulate_rsi_trade(symbol, timeframe):
    """ Simulate a buy when the RSI is bellow 30 and cross above the last day high, and sell when its above 60 or go bellow 40, and calculate the profit """

    data = get_symbol_indicator(symbol, "RSI", timeframe)
    ct = data['data']["close_time"]
    rsi = data["indicators"]["RSI"]
    close = data['data']["close"]
    high = data['data']['high']

    buy_times = []
    sell_times = []
    buy_values = []
    sell_values = []
    prepare_buy = False
    bought = False
    alert = False
    sell = False

    for index, t in enumerate(ct):
        if index!=0 and index!=len(ct)-1:
            if rsi[index] < 30 and not prepare_buy:
                prepare_buy = True
            
            if close[index+1] > high[index] and prepare_buy and not bought:
                buy_times.append(ct[index])
                buy_values.append(close[index])
                bought = True
            
            if bought and rsi[index] > 40:
                alert = True

            if alert and rsi[index] < 40:
                sell = True
                sell_times.append(ct[index])
                sell_values.append(close[index])
                bought = False
                alert = False
                prepare_buy = False

            if bought and not sell and rsi[index] > 60:
                sell = True
                sell_times.append(ct[index])
                sell_values.append(close[index])
                bought = False
                alert = False
                prepare_buy = False

    

    profit = calculate_profit_long(buy_times, sell_times, buy_values, sell_values)

    return {"profit": profit, "buy": buy_times, "sell": sell_times}





def detect_lines_crosses_index(slower_array: list, fast_array: list):
    """
    Compare two arrays values and detect when they cross
    Return two arrays:
    First: buy time, representing the index of the times of cross from bottom to top
    Second: sell time, representing the index of the times of cross from up to bellow.
    Returns the index previous of the cross.
    """
    buy_arr = []
    sell_arr = []
    arr_size = len(slower_array)
    for i in range(arr_size):
        # exclude the ends
        if i!=0 and i!=arr_size-1:
            # if the faster array cross from bellow, it is a buy signal
            if fast_array[i] < slower_array[i] and fast_array[i+1] > slower_array[i+1]:
                buy_arr.append(i)
            elif fast_array[i] > slower_array[i] and fast_array[i+1] < slower_array[i+1]:
                sell_arr.append(i)

    return buy_arr, sell_arr


def calculate_profit_long(buy_times: list, sell_times: list, buy_values: list, sell_values: list):
    """ Calculate the profit from buys and sells arrays in long type markets """


    sell_values_copy = sell_values.copy()
    buy_values_copy = buy_values.copy()

    # Deletes if the first action of the chart is a selling
    if sell_times[0] < buy_times[0]:
        sell_values_copy.pop(0)

    # Deletes if the last action of the chart is a buying
    if buy_times[-1] > sell_times[-1]:
        buy_values_copy.pop()

    profit = sum(np.array(sell_values_copy) - np.array(buy_values_copy))

    return profit






