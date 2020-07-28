import pandas as pd
from fbprophet import Prophet
import random
import json
from .db_op import get_symbol_data



def forecast_data(symbol, periods):
    data = get_symbol_data(symbol, 30)
    df = data_to_prophet_dataframe(data)
    last_date = df.tail(periods)
    
    df.drop(df.tail(periods).index,inplace=True)
    before_last = df.tail(periods)
    m = Prophet()
    m.fit(df)
    future = m.make_future_dataframe(periods=periods)
    forecast = m.predict(future)

    return json.loads(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods).to_json())

def data_to_prophet_dataframe(data):
    json_string = json.dumps(data)
    dataframe = pd.read_json(json_string)
    df = dataframe[['close_time', 'close']]
    df.rename(columns={'close_time': 'ds', 'close': 'y'}, inplace=True)
    return df


def split_random_dataframe(df):
    """ Return a random entry from a pandas data serie and the historical data behind it """
    random_int = random.randint(200,len(df))

    df_slice = df[0: random_int]

    return df_slice.tail(1), df_slice[0:random_int-1]

def extract_y_value_from_df_row(row):
    return row['y'].values[0]


def extract_y_from_forecast(forecast):
    return list(forecast['yhat'].values())[0]

def forecast_predict(df, pred_date, periods):
    m = Prophet()
    m.fit(df)
    # future = m.make_future_dataframe(periods=periods)
    # print("KKKKKKKKKKKKKKKKKKKKKK", future.tail())
    forecast = m.predict(pred_date)

    # forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail()

    return json.loads(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_json())




    

    