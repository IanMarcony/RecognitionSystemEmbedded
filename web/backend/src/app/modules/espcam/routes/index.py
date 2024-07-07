from flask import Blueprint, request
from ..controllers.index import EspCamController
esp_cam_routes = Blueprint('esp', __name__)
esp_cam_controller = EspCamController()

@esp_cam_routes.route('/', methods=['GET'])
def get_images():
    return esp_cam_controller.get_images()
