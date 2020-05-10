#include <ESP8266WiFi.h>
#include <MQTT.h>

// Your Wi-Fi Details
const char* ssid = "<WiFi SSID>";
const char* password = "<WiFi Password>";
const int ledOne = D1;
const int ledTwo = D3;
const int ledThree = D5;
const String deviceTopic = "/device";
const String serverTopic = "/appliance";

WiFiClient client;
MQTTClient mqtt;

void messageReceived(String &topic, String &payload) {
  Serial.println(topic + ": " + payload);

  if (topic == "/checking-connection") {
    mqtt.publish("/device-connected", "");
    return;
  }
  
  if(payload=="\"OneOn\""){
    digitalWrite(ledOne, HIGH);
    Serial.println("LED ONE ON.");
    mqtt.publish(deviceTopic, "1N");
  }
  else if(payload=="\"OneOff\""){
    digitalWrite(ledOne, LOW);
    Serial.println("LED ONE OFF.");
    mqtt.publish(deviceTopic, "1F");
  }
  else if(payload=="\"TwoOn\""){
    digitalWrite(ledTwo, HIGH);
    Serial.println("LED Two ON.");
    mqtt.publish(deviceTopic, "2N");
  }
  else if(payload=="\"TwoOff\""){
    digitalWrite(ledTwo, LOW);
    Serial.println("LED Two OFF.");
    mqtt.publish(deviceTopic, "2F");
  }
  else if(payload=="\"ThreeOn\""){
    digitalWrite(ledThree, HIGH);
    Serial.println("LED Three ON.");
    mqtt.publish(deviceTopic, "3N");
  }
  else if(payload=="\"ThreeOff\""){
    digitalWrite(ledThree, LOW);
    Serial.println("LED Three OFF.");
    mqtt.publish(deviceTopic, "3F");
  }
}

void setup() {
  Serial.begin(115200);
  
  pinMode(ledOne, OUTPUT);
  pinMode(ledTwo, OUTPUT);
  pinMode(ledThree, OUTPUT);
  
  delay(2000);
  Serial.print("Connecting to WiFi");
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.print("\nConnected to WiFi!!");
  
  // Change the key, secret, and broker service if required.
  mqtt.begin("public.cloud.shiftr.io", client);
  mqtt.onMessage(messageReceived);

  Serial.print("\nEstablishing MQTT Connection");
  while (!mqtt.connect("NodeMCU", "<MQTT-Broker-Key>", "<MQTT-Broker-Secret>")) {
    Serial.print(".");
    delay(1000); 
  }
  Serial.print("\nMQTT Connection Established!!");
  mqtt.subscribe(serverTopic);
  mqtt.subscribe("/checking-connection");

  mqtt.publish("/connected", "Connected.");
}

void loop() {
  mqtt.loop();
  delay(10);
}
