from api.app.binance.db_hdf5 import get_symbol_data_last_entry, get_day_from_timestamp, before_today


def test_last_symbol_entry():
    ty = get_symbol_data_last_entry('1d', 'ETHBTC')
    print("BBBBBBBBB", before_today(ty))

