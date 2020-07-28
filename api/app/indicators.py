import numpy as np
import talib
# from talib import BBANDS, DEMA, EMA, HT_TRENDLINE, SMA
# Overlap Studies Functions


###################################### Overlap Studies#####################################################
def BBANDS(close, timeperiod=5, nbdevup=2, nbdevdn=2, matype=0):
    "BBANDS - Bollinger Bands"
    upperband, middleband, lowerband = talib.BBANDS(np.asarray(close), timeperiod=5, nbdevup=2, nbdevdn=2, matype=0)
    return [upperband, middleband, lowerband]

def DEMA(close, timeperiod=30):
    "DEMA - Double Exponential Moving Average"
    real = talib.DEMA(np.asarray(close), timeperiod=30)
    return [real]

def EMA(close, timeperiod=30):
    """
    EMA - Exponential Moving Average. NOTE: The EMA function has an unstable period.
    """
    real = talib.EMA(np.asarray(close), timeperiod=30)
    return [real]

def HT_TRENDLINE(close):
    "HT_TRENDLINE - Hilbert Transform - Instantaneous Trendline"
    real = talib.HT_TRENDLINE(np.asarray(close))
    return [real]

def KAMA(close):
    "KAMA - Kaufman Adaptive Moving Average"
    real = talib.KAMA(np.asarray(close), timeperiod=30)
    return [real]

def MA(close):
    "MA - Moving average"
    real = talib.MA(np.asarray(close), timeperiod=30, matype=0)
    return real


def MAMA(close):
    "MAMA - MESA Adaptive Moving Average"
    mama, fama = talib.MAMA(np.asarray(close), fastlimit=0, slowlimit=0)
    return [mama, fama]

def MAVP(close, periods):
    "MAVP - Moving average with variable period"
    real = talib.MAVP(close, minperiod=2, maxperiod=30, matype=0)
    return [real]

def MIDPOINT(close):
    "MIDPOINT - MidPoint over period"
    real = talib.MIDPOINT(close, timeperiod=14)
    return [real]

def MIDPRICE(close):
    "MIDPRICE - Midpoint Price over period"
    real = talib.MIDPRICE(high, low, timeperiod=14)
    return [real]


def SMA(close):
    "SMA - Simple Moving Average"
    real = talib.SMA(np.asarray(close), timeperiod=30)
    return [real]
#####################################################################################

# Momentum Indicators
#####################################################################################

def MACD(close):
    """Moving Average Convergence/Divergence"""

    macd, macdsignal, macdhist = talib.MACD(np.asarray(close), fastperiod=12, slowperiod=26, signalperiod=9)
    return macd, macdsignal, macdhist

def RSI(close):
    """ Relative Strength Index """
    real = talib.RSI(np.asarray(close), timeperiod=14)
    return real