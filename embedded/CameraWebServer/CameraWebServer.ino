#include "esp_camera.h"
#include <WiFi.h>
#include <Stepper.h>
#include <ArduinoWebsockets.h>
#include "esp_timer.h"
#include "img_converters.h"
#include "Arduino.h"
#include "fb_gfx.h"
#include "soc/soc.h" //disable brownout problems
#include "soc/rtc_cntl_reg.h"  //disable brownout problems
#include "esp_http_server.h"
#include "driver/gpio.h"

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
const uint16_t websockets_server_port = 3001; // OPTIONAL CHANGE

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
  config.xclk_freq_hz = 10000000;
  config.frame_size = FRAMESIZE_UXGA;
  config.pixel_format = PIXFORMAT_JPEG;  // for streaming
  //config.pixel_format = PIXFORMAT_RGB565; // for face detection/recognition
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  if (config.pixel_format == PIXFORMAT_JPEG) {
    if (psramFound()) {
      config.jpeg_quality = 10;
      config.fb_count = 2;
      config.grab_mode = CAMERA_GRAB_LATEST;
    } else {
      // Limit the frame size when PSRAM is not available
      config.frame_size = FRAMESIZE_SVGA;
      config.fb_location = CAMERA_FB_IN_DRAM;
    }
  }

  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("camera init FAIL: 0x%x", err);
    return;
  }
  sensor_t * s = esp_camera_sensor_get();
  // initial sensors are flipped vertically and colors are a bit saturated
  if (s->id.PID == OV3660_PID) {
    s->set_vflip(s, 1);        // flip it back
    s->set_brightness(s, 1);   // up the brightness just a bit
    s->set_saturation(s, -2);  // lower the saturation
  }
  // drop down frame size for higher initial frame rate
  if (config.pixel_format == PIXFORMAT_JPEG) {
    s->set_framesize(s, FRAMESIZE_QVGA);
  }

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
  client.onMessage(onMessageCallback);
  bool connected = client.connect(websockets_server_host, websockets_server_port, "/");
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
   if (client.available()) {
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("img capture failed");
      esp_camera_fb_return(fb);
      ESP.restart();
    }
    client.sendBinary((const char*) fb->buf, fb->len);
    Serial.println("image sent");
    esp_camera_fb_return(fb);
    client.poll();
  } else {
    bool connected = client.connect(websockets_server_host, websockets_server_port, "/");
    Serial.print("Retry Connection result = ");
    Serial.print(connected);
    Serial.println(" ");
  }

  unsigned long currentTime = millis();

  if(isAbleToDetectMotion==1){
    pinStateCurrent = digitalRead(PIN_TO_SENSOR_PRESENCE);
    //Serial.print("pinStateCurrent = ");
    //Serial.print(pinStateCurrent);
    //Serial.println("");

    if (pinStateCurrent == HIGH) { // Detect motion
      //Serial.println("Motion detected!");
      motionDetectedTime = currentTime; // Record the time motion was detected
    }
  }


  if (currentTime - motionDetectedTime < motorRunDuration) {
    //Serial.println("Rotating motor!");
    myStepper.step(stepsPerRevolution / 10); // Rotate 36 degrees every loop iteration (to make full revolution in ~1 second)
    isAbleToDetectMotion = 0;
  } else {
    isAbleToDetectMotion = 1;
    //Serial.println("Stop the motor!");
    myStepper.step(0); // Stop the motor
  }

  delay(100); // Small delay to reduce noise and debounce
}


