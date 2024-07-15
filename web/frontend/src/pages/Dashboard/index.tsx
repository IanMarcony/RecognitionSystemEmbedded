import { Card } from "react-bootstrap";
import "./styles.scss";
import CameraCard from "../../components/CameraCard";
import { getMqttClient } from "../../services/mqtt.service";
import { useEffect, useState } from "react";
import { MqttClient } from "mqtt/*";
import SensorCard from "../../components/SensorCard";
import ServoMotorCard from "../../components/ServoMotorCard";

interface Payload {
  camera: number;
  esp_connect_ws: number | boolean;
  sensor_presence: number;
  belt_moving: number;
}

const Dashboard = () => {
  const [mqttClient, setMqttClient] = useState<MqttClient | undefined>(
    undefined,
  );

  const [sensorStatus, setsensorStatus] = useState<Payload>({
    belt_moving: 0,
    camera: 0,
    esp_connect_ws: 0,
    sensor_presence: 0,
  });

  const [servoAngle, setServoAngle] = useState(90);

  useEffect(() => {
    const client = getMqttClient();

    setMqttClient(client);

    return () => {
      mqttClient?.end();
    };
  }, []);

  useEffect(() => {
    if (mqttClient) {
      mqttClient.subscribe("payload/ser/info", (err) => {
        if (!err) {
          console.log("Subscribed to topic payload/ser/info");
        } else {
          console.error("Subscription error:", err);
        }
      });

      mqttClient.on("message", (topic, message) => {
        if (topic === "payload/ser/info") {
          const object: Payload = JSON.parse(message.toString());
          setsensorStatus(object);
        }
      });
    }
  }, [mqttClient]);

  const onChangeAngle = (newAngle: number) => {
    setServoAngle(newAngle);
    mqttClient?.publish("servo/control", `${newAngle}`);
  };

  return (
    <div className="content mh-100">
      <Card className="h-100 dashboard-card max d-flex flex-column">
        <CameraCard />
        <SensorCard
          beltMoving={!!sensorStatus.belt_moving}
          camera={!!sensorStatus.camera}
          espConnectedWs={!!sensorStatus.esp_connect_ws}
          sensorPresence={!!sensorStatus.sensor_presence}
        />
        <ServoMotorCard angle={servoAngle} onChangeAngle={onChangeAngle} />
      </Card>
    </div>
  );
};

export default Dashboard;
