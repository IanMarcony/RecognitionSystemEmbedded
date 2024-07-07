from flask import jsonify, abort, Response
import asyncio
import websockets
import binascii
from io import BytesIO
from PIL import Image
from base64 import b64encode


class EspCamController:   
    
    def get_images(self):
        return Response(self.get_image(), mimetype='multipart/x-mixed-replace; boundary=frame')
    
    def get_image(self):
        while True:
            try:
                with open("image.jpg", "rb") as f:
                    image_bytes = f.read()
                image = Image.open(BytesIO(image_bytes))
                img_io = BytesIO()
                image.save(img_io, 'JPEG')
                img_io.seek(0)
                img_bytes = img_io.read()
                yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + img_bytes + b'\r\n')

            except Exception as e:
                print("encountered an exception: ")
                print(e)

                with open("placeholder.jpg", "rb") as f:
                    image_bytes = f.read()
                image = Image.open(BytesIO(image_bytes))
                img_io = BytesIO()
                image.save(img_io, 'JPEG')
                img_io.seek(0)
                img_bytes = img_io.read()
                yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + img_bytes + b'\r\n')
                continue
