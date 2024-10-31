#include <BluetoothSerial.h>
#include <WiFi.h>
#include <PubSubClient.h>

BluetoothSerial SerialBT;
WiFiClient espClient;
PubSubClient client(espClient);

// Configuración WiFi y MQTT
const char* ssid = "TuSSID";
const char* password = "TuPassword";
const char* mqtt_server = "IP_Raspberry_Pi";

void setup() {
  Serial.begin(115200);
  
  // Configuración Bluetooth
  SerialBT.begin("ArduinoBT"); // Nombre del dispositivo Bluetooth
  Serial.println("Bluetooth iniciado. Esperando conexión...");
  
  // Configuración WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Conectado a WiFi");

  // Configuración MQTT
  client.setServer(mqtt_server, 1883);
  reconnectMQTT();
}

void reconnectMQTT() {
  while (!client.connected()) {
    if (client.connect("ArduinoClient")) {
      Serial.println("Conectado al servidor MQTT");
    } else {
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  // Enviar datos desde el Bluetooth
  if (SerialBT.available()) {
    String data = SerialBT.readString();
    Serial.println("Datos recibidos por Bluetooth: " + data);

    // Envía datos a la Raspberry Pi
    if (client.publish("sensor/datos", data.c_str())) {
      Serial.println("Datos enviados a Raspberry Pi");
    }
  }
}