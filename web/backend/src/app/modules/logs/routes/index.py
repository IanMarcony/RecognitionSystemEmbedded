from flask import Blueprint, request
from flask_cors import cross_origin
from ..controllers.index import LogsController
logs_routes = Blueprint('logs', __name__)
logs_controller = LogsController()

@logs_routes.route('/', methods=['GET'])
@cross_origin()
def get_logs():
    return logs_controller.index()
