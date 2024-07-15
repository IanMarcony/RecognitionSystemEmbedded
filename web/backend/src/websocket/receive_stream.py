import websockets
import binascii
import socket
import asyncio
from io import BytesIO

from PIL import Image, UnidentifiedImageError

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
        message = await websocket.recv()
        if len(message) > 5000:
                if is_valid_image(message):
                        print(websocket.id)
                        with open("./camera/image.jpg", "wb") as f:
                            f.write(message)

        print()
    except websockets.exceptions.ConnectionClosed:
        print()

async def main():
    server = await websockets.serve(handle_connection, '0.0.0.0', 5000)
    print('WebSocket Server is ON')
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    print(f"Hostname: {hostname}")
    print(f"IP Address: {ip_address}")
    await server.wait_closed()
    
    
asyncio.run(main())


