from .db_hdf5 import get_all_symbols_indicator, fill_db_indicator_hdf5
from .utils import find_last_potive_cross


def hunt_macd(timeframe):
    """ Calculate a trading strategy for all pairs """
    # fill_db_indicator_hdf5("MACD", timeframe)
    pairs_info = get_all_symbols_indicator(timeframe)
    info_list = []
    for p in pairs_info:
        last_cross = find_last_potive_cross(p['MACDHIST'])
        info_list.append({'symbol': p['symbol'], 'last_cross_index': last_cross})

    return info_list