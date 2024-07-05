from flask import Blueprint, request
from ..controllers.index import LogsController
logs_routes = Blueprint('logs', __name__)
logs_controller = LogsController()

@logs_routes.route('/', methods=['GET'])
def get_logs():
    return logs_controller.index()
