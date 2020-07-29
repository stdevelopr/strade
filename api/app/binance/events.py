"""
Flask Blueprint for handling events on the SocketIO stream.
@author Brian Wojtczak
"""

import functools
import logging
import time

from flask import request
from flask_socketio import emit, ConnectionRefusedError, disconnect

from .io_blueprint import IOBlueprint

logger = logging.getLogger(__name__)
bp = IOBlueprint('events', __name__)


# def authenticated_only(f):
#     @functools.wraps(f)
#     def wrapped(*args, **kwargs):
#         if not is_logged_in():
#             disconnect()
#         else:
#             return f(*args, **kwargs)

#     return wrapped


# @bp.on('connect')
# def connect():
#     if not is_logged_in():
#         raise ConnectionRefusedError('unauthorized!')
#     emit('flash', 'Welcome ' + request.remote_user)  # context aware emit


# @bp.on('echo')
# @authenticated_only
# def on_alive(data):
#     logger.debug(data)
#     emit('echo', data)  # context aware emit


# @bp.on('broadcast')
# @authenticated_only
# def on_broadcast(data):
#     logger.debug(data)
#     bp.emit('broadcast', data)  # bp.emit same as socketio.emit




@bp.on('connect')
def connect():
    print("A new connection to the server")


@bp.on('disconnect')
def disconnect():
    print("Disconnected")

@bp.on('teste')
def handle_message():
    print("Evento teste")
    emit('receive', "ALO")
    return "from API"