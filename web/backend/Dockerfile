FROM python:3.12

WORKDIR /app

COPY src/requirements.txt requirements.txt

RUN pip install -r ./requirements.txt
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

COPY src/ .

CMD ["flask", "--app", "main.py", "run", "--host=0.0.0.0", "--port=3000"]