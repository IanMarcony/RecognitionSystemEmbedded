import React from "react";
import { Card, Container, Form } from "react-bootstrap";

const ServoMotorCard: React.FC<{
  angle: number;
  onChangeAngle: (angle: number) => void;
}> = ({ angle, onChangeAngle }) => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeAngle(parseInt(event.target.value));
  };

  return (
    <Card className="w-auto h-auto">
      <Card.Header
        className="d-flex align-items-center"
        style={{ gap: "0.5rem" }}
      >
        <i className="fas fa-arrows-alt"></i>
        <Card.Title style={{ margin: "0" }}>Servo Motor Control</Card.Title>
      </Card.Header>
      <Card.Body>
        <Container className="d-flex flex-column align-items-center">
          <Form.Label>Angle: {angle}°</Form.Label>
          <Form.Range
            value={angle}
            min={0}
            max={180}
            onChange={handleSliderChange}
            style={{ width: "100%" }}
          />
        </Container>
      </Card.Body>
    </Card>
  );
};

export default ServoMotorCard;
