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
    while True:
        try:
            message = await websocket.recv()
            # print(len(message))
            if len(message) > 5000:
                  if is_valid_image(message):
                          print(websocket.id)
                          with open("image.jpg", "wb") as f:
                                f.write(message)

            print()
        except websockets.exceptions.ConnectionClosed:
            break

async def main():
    server = await websockets.serve(handle_connection, '0.0.0.0', 3001)
    print('WebSocket Server is ON')
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    print(f"Hostname: {hostname}")
    print(f"IP Address: {ip_address}")
    await server.wait_closed()
    
    
asyncio.run(main())


