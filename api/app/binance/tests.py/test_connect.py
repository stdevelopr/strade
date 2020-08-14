# import pytest
# import numpy as np
# import pandas as pd
# import json
# # from api.app.binance.connect import binance_connect
# from api.app.binance.trading import calculate_profit_long
# from api.app.binance.prophet_forecast import forecast_data, split_random_dataframe, data_to_prophet_dataframe, extract_y_value_from_df_row, extract_y_from_forecast, forecast_predict
# from api.app.binance.db_op import get_symbol_data
# from datetime import datetime


# # def test_connection():
# #     r = binance_connect()
# #     assert r

# # def test_profit():
# #     # (buy_times: list, sell_times: list, buy_values: list, sell_values: list)
# #     buy_times = [2]
# #     sell_times = [5]
# #     buy_values = [4]
# #     sell_values = [7]
# #     assert  calculate_profit_long(buy_times, sell_times, buy_values, sell_values) == 3
# #     buy_times = [2,8]
# #     sell_times = [1, 5]
# #     buy_values = [4,10]
# #     sell_values = [3, 7]
# #     assert  calculate_profit_long(buy_times, sell_times, buy_values, sell_values) == 3


# def test_mongo_to_dataframe():
#     data = data_to_prophet_dataframe(get_symbol_data("ETCBTC"))
#     sample, historical = split_random_dataframe(data)
#     y_from = historical.tail(1)
#     # y_actual = extract_y_value_from_df_row(sample)
#     forecast = forecast_predict(historical, sample,1)
#     y_predict = extract_y_from_forecast(forecast)

#     print('FROMMM',y_from)
#     dt64 = np.datetime64(sample['ds'].values[0])
#     ts = (dt64 - np.datetime64('1970-01-01T00:00:00Z')) / np.timedelta64(1, 's')
#     print("SAMMMMMMMMMMMPLE", ts, sample['y'].values[0])
#     print("FOOOOOOOOOOOREEEECAST", forecast)