def parse_binance_response_json(data):
    """ Split the binance response format into independent lists for each entry"""
    ot = []
    o = []
    l = []
    h = []
    c = []
    v = []
    ct = []
    nots = []
    tbv =[]
    tqv = []

    for k in data:
        ot.append(k[0])
        o.append(float(k[1]))
        h.append(float(k[2]))
        l.append(float(k[3]))
        c.append(float(k[4]))
        v.append(float(k[5]))
        ct.append(k[6])
        nots.append(k[7])
        tbv.append(k[8])
        tqv.append(k[9])

    return  {"open_time":ot,"open":o,"low":l,"high": h,"close":c,"volume":v,"close_time":ct, "number_trades": nots, "tbv": tbv, "tqv":tqv}

def parse_binance_response_hdf5(data):
    """ Split the binance response format into independent lists for each entry from an np.array"""

    columns = data.attrs.get('column_names')

    return  {columns[i]: list(data[:,i]) for i in range(len(columns))}


def find_last_potive_cross(arr):
    """Receive an array with positive and negative values and return the index of the last cross to positive """

    signal = False
    for i, v in enumerate(reversed(arr)):
        # if the last element is negative break
        if i==0 and v < 0:
            break

        # if the last element is > 0, continue backwards
        if v > 0 and not signal:
            signal = True

        # if the value becomes negative, return the index
        if v < 0 and signal:
            return i

    return None
