import torch
import cv2
import time
from pathlib import Path

# Carregar o modelo treinado
model = torch.hub.load('ultralytics/yolov5', 'custom', path='last.pt', force_reload=True)

# Caminho para a imagem estática
image_path = 'moeda.jpg'  # Substitua pelo caminho da sua imagem

# Carregar a imagem
img = cv2.imread(image_path)

if img is None:
    print(f"Erro ao carregar a imagem em {image_path}")
    exit()

# Realizar detecção
results = model(img)

# Processar resultados
labels, cords = results.xyxyn[0][:, -1], results.xyxyn[0][:, :-1]
n = len(labels)

for i in range(n):
    row = cords[i]
    if row[4] >= 0.5:  # Threshold de confiança
        x1, y1, x2, y2 = int(row[0] * img.shape[1]), int(row[1] * img.shape[0]), int(row[2] * img.shape[1]), int(row[3] * img.shape[0])
        bgr = (0, 255, 0)
        cv2.rectangle(img, (x1, y1), (x2, y2), bgr, 2)
        label = f"{model.names[int(labels[i])]} {row[4]:.2f}"
        cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, bgr, 2)

# Mostrar imagem com detecções
cv2.imshow('Detecção de Moedas', img)
cv2.waitKey(0)
cv2.destroyAllWindows()
