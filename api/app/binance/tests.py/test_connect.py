import pytest
from api.app.binance.connect import binance_connect


def test_connection():
    r = binance_connect()
    assert r