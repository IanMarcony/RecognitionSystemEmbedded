import websockets
import binascii
import socket
import asyncio
from io import BytesIO
from ultralytics import YOLO
from PIL import Image, UnidentifiedImageError

model = YOLO('./bestv8.pt')
print(model.names)

connected_clients = set()

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
                        results = model.track("./camera/image.jpg", classes=0, conf=0.80, imgsz=640)
                        print(results)
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
    
    
asyncio.run(main())


