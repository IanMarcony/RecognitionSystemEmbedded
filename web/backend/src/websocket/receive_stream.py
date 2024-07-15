import websockets
import binascii
import socket
import asyncio
from io import BytesIO
from ultralytics import YOLO
from PIL import Image, UnidentifiedImageError
import numpy as np
import threading
import queue
import paho.mqtt.client as mqtt
import json

model = YOLO('./bestv8.pt')
print(model.names)

# Fila para processamento de imagens
image_queue = queue.Queue()

# Conjunto para gerenciar clientes conectados
connected_clients = set()

# Configuração do MQTT
mqtt_client = mqtt.Client()
mqtt_broker = "test.mosquitto.org"
mqtt_port = 1883
mqtt_topic = "payload/ser/recognition"

def on_connect(client, userdata, flags, rc):
    print("Conectado ao MQTT Broker com código de resultado: " + str(rc))

def on_publish(client, userdata, mid):
    print("Mensagem publicada com ID: " + str(mid))

mqtt_client.on_connect = on_connect
mqtt_client.on_publish = on_publish
mqtt_client.connect(mqtt_broker, mqtt_port, 60)

def is_valid_image(image_bytes):
    try:
        Image.open(BytesIO(image_bytes))
        # print("image OK")
        return True
    except UnidentifiedImageError:
        print("image invalid")
        return False

async def handle_connection(websocket, path):    
    try:
        connected_clients.add(websocket)
        message = await websocket.recv()
        if len(message) > 5000:
                if is_valid_image(message):
                        with open("./camera/image.jpg", "wb") as f:
                            f.write(message)
                        with open("./camera/image.jpg", "rb") as f:
                            image_bytes = f.read()
                        websockets.broadcast(connected_clients, binascii.b2a_base64(image_bytes).decode('utf-8'))
                        image_queue.put(image_bytes)
                       
    except websockets.exceptions.ConnectionClosed:
        print('Erro')
    finally:
        if len(connected_clients)>10:
            connected_clients.clear()
            
        

async def main():
    server = await websockets.serve(handle_connection, '0.0.0.0', 5000)
    print('WebSocket Server is ON')
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    print(f"Hostname: {hostname}")
    print(f"IP Address: {ip_address}")
    await server.wait_closed()
    
    
def process_images():
    while True:
        print('sending...')
        mqtt_payload = {
            "class_id": 1,
            "class_name": "Queijo"
        }
        
        # Converter o dicionário para uma string JSON
        mqtt_message = json.dumps(mqtt_payload)
        
        # Publicar a mensagem JSON no MQTT
        mqtt_client.publish(mqtt_topic, mqtt_message)
        if not image_queue.empty():
            image_bytes = image_queue.get()
            image = Image.open(BytesIO(image_bytes))
            image_np = np.array(image)
            results = model.track(image_np, classes=0, conf=0.80, imgsz=640)
            for result in results:
                boxes = result.boxes
                if boxes:
                    class_id = boxes.cls.int().numpy()
                    class_id = np.array(class_id)
                    class_id = class_id[0] if len(class_id) > 0 else -1
                    class_name = model.names[int(class_id)] if class_id >= 0 else ""
                     # Estruturar os resultados em um dicionário
                    mqtt_payload = {
                        "class_id": int(class_id),
                        "class_name": class_name
                    }
                    
                    # Converter o dicionário para uma string JSON
                    mqtt_message = json.dumps(mqtt_payload)
                    
                    # Publicar a mensagem JSON no MQTT
                    mqtt_client.publish(mqtt_topic, mqtt_message)
                    print(f"Publicado no MQTT: {mqtt_message}")

# Iniciar a thread de processamento de imagens
image_processing_thread = threading.Thread(target=process_images)
image_processing_thread.start()


asyncio.run(main())


