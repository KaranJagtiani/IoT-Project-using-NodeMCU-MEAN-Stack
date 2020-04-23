#include <ESP8266WiFi.h>
#include <MQTT.h>

// Your Wi-Fi Details
const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";
const int ledOne = D2;
const int ledTwo = D5;
const int ledThree = D6;

WiFiClient client;
MQTTClient mqtt;

void connect() {
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.print("Connected!!");
  
  Serial.print("\nEstablishing MQTT Connection");
  while (!mqtt.connect("NodeMCU", "broker_key", "broker_secret")) {
    Serial.print(".");
    delay(1000); 
  }
  Serial.print("\nConnection Established!!");
  
  mqtt.subscribe("/appliance");
}

void messageReceived(String &topic, String &payload) {
  Serial.println(payload);
  
  if(payload=="\"OneOn\""){
    digitalWrite(ledOne, HIGH);
    Serial.println("LED ONE ON.");
  }
  if(payload=="\"OneOff\""){
    digitalWrite(ledOne, LOW);
    Serial.println("LED ONE OFF.");
  }
  if(payload=="\"TwoOn\""){
    digitalWrite(ledTwo, HIGH);
    Serial.println("LED Two ON.");
  }
  if(payload=="\"TwoOff\""){
    digitalWrite(ledTwo, LOW);
    Serial.println("LED Two OFF.");
  }
  if(payload=="\"ThreeOn\""){
    digitalWrite(ledThree, HIGH);
    Serial.println("LED Three ON.");
  }
  if(payload=="\"ThreeOff\""){
    digitalWrite(ledThree, LOW);
    Serial.println("LED Three OFF.");
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  pinMode(ledOne, OUTPUT);
  pinMode(ledTwo, OUTPUT);
  pinMode(ledThree, OUTPUT);
  // Using shiftr.io as the broker service for MQTT protocol.
  mqtt.begin("broker.shiftr.io", client);
  mqtt.onMessage(messageReceived);
  connect();
}

void loop() {
  mqtt.loop();
  delay(10);
}
