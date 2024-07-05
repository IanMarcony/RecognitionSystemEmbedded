import torch
import cv2
import time
from pathlib import Path

# Carregar o modelo treinado
model = torch.hub.load('ultralytics/yolov5', 'custom', path='best.pt', force_reload=True)

# Configurações da câmera
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Erro ao abrir a câmera")
    exit()

while True:
    # Capturar frame-by-frame
    ret, frame = cap.read()
    if not ret:
        print("Erro ao capturar frame")
        break

    # Realizar detecção
    results = model(frame)

    # Processar resultados
    labels, cords = results.xyxyn[0][:, -1], results.xyxyn[0][:, :-1]
    n = len(labels)
    
    for i in range(n):
        row = cords[i]
        if row[4] >= 0.1:  # Threshold de confiança
            x1, y1, x2, y2 = int(row[0] * frame.shape[1]), int(row[1] * frame.shape[0]), int(row[2] * frame.shape[1]), int(row[3] * frame.shape[0])
            bgr = (0, 255, 0)
            cv2.rectangle(frame, (x1, y1), (x2, y2), bgr, 2)
            label = f"{model.names[int(labels[i])]} {row[4]:.2f}"
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, bgr, 2)
    
    # Mostrar frame com detecções
    cv2.imshow('Detecção de Moedas', frame)
    
    # Sair com 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Liberar a captura e fechar janelas
cap.release()
cv2.destroyAllWindows()
