#include "esp_camera.h"
#include <WiFi.h>
#include <Stepper.h>
#include <ArduinoJson.h>
#include <ArduinoWebsockets.h>
#include "esp_timer.h"
#include "img_converters.h"
#include "Arduino.h"
#include "fb_gfx.h"
#include "soc/soc.h" //disable brownout problems
#include "soc/rtc_cntl_reg.h"  //disable brownout problems
#include "esp_http_server.h"
#include "driver/gpio.h"
#include <PubSubClient.h>

#define CAMERA_MODEL_AI_THINKER  // Has PSRAM

#define PWDN_GPIO_NUM  32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM  0
#define SIOD_GPIO_NUM  26
#define SIOC_GPIO_NUM  27

#define Y9_GPIO_NUM    35
#define Y8_GPIO_NUM    34
#define Y7_GPIO_NUM    39
#define Y6_GPIO_NUM    36
#define Y5_GPIO_NUM    21
#define Y4_GPIO_NUM    19
#define Y3_GPIO_NUM    18
#define Y2_GPIO_NUM    5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM  23
#define PCLK_GPIO_NUM  22

// 4 for flash led or 33 for normal led
#define LED_GPIO_NUM   4


// ===========================
// Enter your WiFi credentials
// ===========================
const char* ssid = "MEI";
const char* password = "205M20E15I";

const char* websockets_server_host = "192.168.1.203"; //CHANGE HERE
const uint16_t websockets_server_port = 5000; // OPTIONAL CHANGE

using namespace websockets;
WebsocketsClient client;

camera_fb_t * fb = NULL;
size_t _jpg_buf_len = 0;
uint8_t * _jpg_buf = NULL;
uint8_t state = 0;

void onMessageCallback(WebsocketsMessage message) {
  Serial.print("Got Message: ");
  Serial.println(message.data());
}


void startCameraServerEmb();
void setupLedFlash(int pin);

// ================
// Presence Sensor
// ================

const int PIN_TO_SENSOR_PRESENCE = 12;  //GPIO12
int pinStateCurrent = LOW;              // current state of pin
int pinStatePrevious = LOW;             // previous state of pin


// ================
// Step Motor
// ================
const int PIN_1_TO_STEP_MOTOR = 13;  //GPIO13
const int PIN_2_TO_STEP_MOTOR = 15;  //GPIO15
const int PIN_3_TO_STEP_MOTOR = 14;  //GPIO14
const int PIN_4_TO_STEP_MOTOR = 2;   //GPIO12

const int stepsPerRevolution = 500;

Stepper myStepper(stepsPerRevolution,
                  PIN_1_TO_STEP_MOTOR,
                  PIN_3_TO_STEP_MOTOR,
                  PIN_2_TO_STEP_MOTOR,
                  PIN_4_TO_STEP_MOTOR);

unsigned long motionDetectedTime = 0;
const unsigned long motorRunDuration = 15*1000; // 10 seconds
int isAbleToDetectMotion = 1;


// ================
// Mqtt
// ================
WiFiClient espClient;
PubSubClient clientMqtt(espClient);

const char* mqtt_server = "test.mosquitto.org";
const int mqtt_port = 1883; // Porta padrão do MQTT

void setup() { 
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();

  // Presence Sensor

  pinMode(PIN_TO_SENSOR_PRESENCE, INPUT);

  // Step Motor

  myStepper.setSpeed(60);

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 10000000; // Reduzir a frequência para 10MHz
  config.frame_size = FRAMESIZE_UXGA;
  config.pixel_format = PIXFORMAT_JPEG;  // for streaming
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 15;
  config.fb_count = 2;

  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("camera init FAIL: 0x%x", err);
    return;
  }
  sensor_t * s = esp_camera_sensor_get();
  
  // Configurações específicas do sensor (ajustes opcionais)
  s->set_brightness(s, 1);    // Ajusta o brilho (varia de -2 a 2)
  s->set_contrast(s, 1);      // Ajusta o contraste (varia de -2 a 2)
  s->set_saturation(s, -2);   // Ajusta a saturação (varia de -2 a 2)
  s->set_vflip(s, 1);         // Inverte verticalmente a imagem, se necessário
  s->set_special_effect(s, 0); // Efeito especial (0 - sem efeito)
  s->set_whitebal(s, 1);      // Ativa balanço de branco
  s->set_awb_gain(s, 1);      // Ativa ganho automático do balanço de branco
  s->set_wb_mode(s, 0);       // Define o modo de balanço de branco
  s->set_exposure_ctrl(s, 1); // Controle de exposição
  s->set_aec2(s, 1);          // Ativa o controle de exposição automático
  s->set_ae_level(s, 0);      // Define o nível de exposição (varia de -2 a 2)
  s->set_aec_value(s, 300);   // Define o valor de exposição (varia de 0 a 1200)
  s->set_gain_ctrl(s, 1);     // Controle de ganho
  s->set_agc_gain(s, 0);      // Ganho automático
  s->set_gainceiling(s, (gainceiling_t)0); // Define o teto do ganho
  s->set_bpc(s, 0);           // Correção de pixel defeituoso
  s->set_wpc(s, 1);           // Correção de pixel branco
  s->set_raw_gma(s, 1);       // Correção gama
  s->set_lenc(s, 1);          // Correção de lente
  s->set_hmirror(s, 0);       // Espelha a imagem horizontalmente
  s->set_dcw(s, 1);           // Downsize EN
  s->set_colorbar(s, 0);      // Barra de cores para teste

// Setup LED FLash if LED pin is defined in camera_pins.h
#if defined(LED_GPIO_NUM)
  setupLedFlash(LED_GPIO_NUM);
#endif

  WiFi.begin(ssid, password);
  WiFi.setSleep(false);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  // Setting Mqtt Client
  clientMqtt.setServer(mqtt_server, mqtt_port);

  //Client WebSocket
  client.onMessage(onMessageCallback);
  bool connected = client.connect(websockets_server_host, websockets_server_port, "/socket.io/?transport=websocket");
  if (!connected) {
    Serial.println("WS connect failed!");
    Serial.println(WiFi.localIP());
    state = 3;
    return;
  }
  if (state == 3) {
    return;
  }

  Serial.println("WS OK");
  client.send("hello from ESP32 camera stream!");
}

void loop() {
  if (!clientMqtt.connected()) {
    reconnect();
  }
  clientMqtt.loop();
  
  // Montando o JSON
  StaticJsonDocument<200> doc; 

  if (client.available()) {
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("img capture failed");
      esp_camera_fb_return(fb);
      ESP.restart();
    }
    client.sendBinary((const char*) fb->buf, fb->len);
    Serial.println("image sent");
    doc["camera"]=1;
    doc["esp_connected_ws"]=1;
    esp_camera_fb_return(fb);
    client.poll();
  } else {
    bool connected = client.connect(websockets_server_host, websockets_server_port, "/socket.io/?transport=websocket");
    doc["esp_connected_ws"]=connected;
    doc["camera"]=0;
    Serial.print("Retry Connection result = ");
    Serial.print(connected);
    Serial.println(" ");
  }

  unsigned long currentTime = millis();

  if(isAbleToDetectMotion==1){
    pinStateCurrent = digitalRead(PIN_TO_SENSOR_PRESENCE);
    doc["sensor_presence"]=pinStateCurrent==HIGH? 1: 0;
    //Serial.print("pinStateCurrent = ");
    //Serial.print(pinStateCurrent);
    //Serial.println("");

    if (pinStateCurrent == HIGH) { // Detect motion
      Serial.println("Motion detected!");
      motionDetectedTime = currentTime; // Record the time motion was detected      
    }
  }


  if (currentTime - motionDetectedTime < motorRunDuration) {
    //Serial.println("Rotating motor!");
    myStepper.step(stepsPerRevolution / 10); // Rotate 36 degrees every loop iteration (to make full revolution in ~1 second)
    isAbleToDetectMotion = 0;
    doc["belt_moving"]=1;
  } else {
    isAbleToDetectMotion = 1;
    //Serial.println("Stop the motor!");
    myStepper.step(0); // Stop the motor
    doc["belt_moving"]=0;
  }

  char jsonBuffer[256]; 
  serializeJson(doc, jsonBuffer); 

  Serial.print("Enviando JSON: ");
  Serial.println(jsonBuffer);

  // Sending information to mqtt broker
  clientMqtt.publish("payload/ser/info", jsonBuffer);
}


void reconnect() {
  while (!clientMqtt.connected()) {
    Serial.print("Tentando conectar ao MQTT...");
    if (clientMqtt.connect("SisEmbRec")) {
      Serial.println("Conectado");
    } else {
      Serial.print("Falha, rc=");
      Serial.print(clientMqtt.state());
      Serial.println(" Tente novamente em 5 segundos");
      delay(5000);
    }
  }
}


