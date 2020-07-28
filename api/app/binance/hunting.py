from .db_op import get_all_symbols_indicator
from .utils import find_last_potive_cross


def hunt_macd(timeframe):
    """ Calculate a trading strategy for all pairs """
    pairs_info = get_all_symbols_indicator(timeframe)
    info_list = []
    for p in pairs_info:
        last_cross = find_last_potive_cross(p['indicators']['MACD']['MACDHIST'])
        info_list.append({'symbol': p['symbol'], 'last_cross_index': last_cross})

    print(info_list)
    return info_list