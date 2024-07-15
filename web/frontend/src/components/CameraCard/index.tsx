import { useState } from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import StatusCircle from "../StatusCircle";

const CameraCard = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const socketUrl = process.env.REACT_APP_WEB_SOCKET_URL || "";

  const ws = new WebSocket(socketUrl);

  ws.onmessage = function (event) {
    console.log("Updating...");
    setImageSrc("data:image/jpeg;base64," + event.data);
  };

  ws.onerror = function (error) {
    console.error("WebSocket Error: ", error);
  };

  ws.onopen = function () {
    console.log("WebSocket connection established");
  };

  ws.onclose = function () {
    console.log("WebSocket connection closed");
  };

  return (
    <Card className="w-auto h-auto">
      <Card.Header
        className="d-flex align-items-center"
        style={{ gap: "0.5rem" }}
      >
        <StatusCircle status={!!imageSrc} />
        <Card.Title style={{ margin: "0" }}>Real Time Camera</Card.Title>
      </Card.Header>
      <Card.Body>
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ width: 320, height: 240 }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              width={320}
              height={240}
              alt="Imagem em tempo real"
            />
          ) : (
            <Spinner variant="primary" />
          )}
        </Container>
      </Card.Body>
    </Card>
  );
};

export default CameraCard;
