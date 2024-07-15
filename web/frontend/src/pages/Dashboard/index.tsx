import { Card } from "react-bootstrap";
import "./styles.scss";
import CameraCard from "../../components/CameraCard";
import { getMqttClient } from "../../services/mqtt.service";
import { useEffect, useState } from "react";
import { MqttClient } from "mqtt/*";
import SensorCard from "../../components/SensorCard";

const Dashboard = () => {
  const [mqttClient, setMqttClient] = useState<MqttClient | undefined>(
    undefined,
  );

  useEffect(() => {
    const client = getMqttClient();

    setMqttClient(client);

    return () => {
      mqttClient?.end();
    };
  }, []);

  return (
    <div className="content mh-100">
      <Card className="h-100 mh-100 dashboard-card max d-flex flex-column">
        <CameraCard />
        <SensorCard
          beltMoving={true}
          camera={true}
          espConnectedWs={true}
          sensorPresence={true}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
