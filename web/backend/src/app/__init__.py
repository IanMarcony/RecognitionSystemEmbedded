from flask import Flask
from flask_mqtt import Mqtt
import json
from app.modules.logs.controllers.index import LogsController
from .db import conn_db

db = conn_db()
def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MQTT_BROKER_URL'] = 'test.mosquitto.org'
    app.config['MQTT_BROKER_PORT'] = 1883

    db.init_app(app)

    from .modules.products.routes.index import products_routes
    from .modules.categories.routes.index import categories_routes
    from .modules.logs.routes.index import logs_routes
    from .modules.espcam.routes.index import esp_cam_routes
    app.register_blueprint(products_routes, url_prefix='/products')
    app.register_blueprint(categories_routes, url_prefix='/categories')
    app.register_blueprint(logs_routes, url_prefix='/logs')
    app.register_blueprint(esp_cam_routes, url_prefix='/esp')
    
    mqtt = Mqtt(app)

    logs_controller = LogsController()

    @mqtt.on_connect()
    def handle_connect(client, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        mqtt.subscribe('payload/ser/recognition')

    @mqtt.on_message()
    def handle_mqtt_message(client, userdata, message):
        payload = message.payload.decode()
        print(f"Received message on topic {message.topic}: {payload}")

        # Parse o JSON recebido
        mqtt_payload = json.loads(payload)
        
        msg_create = {
            "product_name":mqtt_payload["class_name"]
        }
        
        # Crie a entrada no banco de dados usando a classe controladora
        logs_controller.create(msg_create)

        # Envie a informação para o tópico servo/control
        response_payload = json.dumps({
            "class_id": mqtt_payload["class_id"],
            "class_name": mqtt_payload["class_name"]
        })
        mqtt.publish('servo/control', response_payload)


    return app
