import mqtt from "mqtt";

const brokerUrl = "ws://broker.emqx.io:8083/mqtt";
const options = {
  clientId: "react-mqtt-client",
};

const getMqttClient = () => {
  const client = mqtt.connect(brokerUrl, options);

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
  });

  client.on("error", (err) => {
    console.error("MQTT connection error:", err);
  });

  return client;
};

export { getMqttClient };
