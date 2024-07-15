import React from "react";
import { Card, Container } from "react-bootstrap";
import StatusCircle from "../StatusCircle";

interface SensorCardProps {
  espConnectedWs: boolean;
  camera: boolean;
  sensorPresence: boolean;
  beltMoving: boolean;
}

const SensorCard: React.FC<SensorCardProps> = ({
  espConnectedWs,
  camera,
  sensorPresence,
  beltMoving,
}) => {
  return (
    <Card className="w-auto h-auto">
      <Card.Header
        className="d-flex align-items-center"
        style={{ gap: "0.5rem" }}
      >
        <StatusCircle status={espConnectedWs} />
        <Card.Title style={{ margin: "0" }}>Sensor Status</Card.Title>
      </Card.Header>
      <Card.Body>
        <Container className="d-flex flex-column" style={{ gap: "1rem" }}>
          <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
            <i className="fas fa-wifi"></i>
            <span>ESP Connected: {espConnectedWs ? "Yes" : "No"}</span>
          </div>
          <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
            <i className="fas fa-camera"></i>
            <span>Camera: {camera ? "Yes" : "No"}</span>
          </div>
          <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
            <i className="fas fa-male"></i>
            <span>Presence Sensor: {sensorPresence ? "Yes" : "No"}</span>
          </div>
          <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
            <i className="fas fa-cog"></i>
            <span>Belt Moving: {beltMoving ? "Yes" : "No"}</span>
          </div>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default SensorCard;
