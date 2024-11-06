#include <WiFi.h>
#include <PubSubClient.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

// Constants
const char* ssid = "Personal-C0C";
const char* password = "3FB3C12C0C";
const char* mqtt_server = "192.168.0.110";
const int mqtt_port = 1883;
const char* mqtt_user = "admin";    // Usuario para MQTT
const char* mqtt_password = "admin"; // Contraseña para MQTT

String macAddress;

WiFiClient espClient;
PubSubClient client(espClient);

BLEScan* pBLEScan;
const int scanTime = 10; // In seconds

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Obtener la dirección MAC después de la conexión a WiFi
  macAddress = WiFi.macAddress();

  // Connect to MQTT broker
client.setServer(mqtt_server, mqtt_port);
while (!client.connected()) {
  Serial.println("Connecting to MQTT...");
  // Intentar conectarse usando el usuario y la contraseña
  if (client.connect("ESP32Client", mqtt_user, mqtt_password)) {
    Serial.println("Connected to MQTT");
    client.subscribe("checkpoint");
    Serial.println("Subscribed to topic: checkpoint");
  } else {
    Serial.print("Failed with state ");
    Serial.print(client.state());
    delay(2000);
  }
}

  // Initialize BLE
  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); // Create BLE scan object
}

void loop() {
  // Scan for Bluetooth devices
  Serial.println("Scanning for BLE devices...");
  BLEScanResults *foundDevices = pBLEScan->start(scanTime, false);
  int totalDevices = foundDevices->getCount();
  int batchSize = 10;

  for (int batchStart = 0; batchStart < totalDevices; batchStart += batchSize) {
    // Preparar el mensaje para la tanda actual
    String message = "{\n  \"checkpointID\": \"" + macAddress + "\",\n  \"animals\": [\n";;

    // Agregar dispositivos en la tanda actual
    for (int i = batchStart; i < min(batchStart + batchSize, totalDevices); i++) {
      BLEAdvertisedDevice device = foundDevices->getDevice(i);
      String deviceAddress = device.getAddress().toString().c_str();
      int rssi = device.getRSSI(); // Obtener el valor de RSSI

      // Añadir información del dispositivo al mensaje
      if (rssi>=-80){
        message += "{ \"id\": \"" + deviceAddress + "\", \"rssi\": " + String(rssi) + " }";
      }
      
      // Agregar coma y nueva línea para cada dispositivo excepto el último
      if (i < min(batchStart + batchSize, totalDevices) - 1) {
        message += ",\n";
      }
    }

    message += "\n  ]\n}";

    // Publicar el mensaje en el tema MQTT si está conectado
    if (client.connected()) {
      client.publish("checkpoint", message.c_str());
      Serial.println("Published to MQTT:");
      Serial.println(message);
    } else {
      Serial.println("MQTT connection lost. Attempting to reconnect...");
      if (client.connect("ESP32Client")) {
        Serial.println("Reconnected to MQTT");
      }
    }

    // Esperar un segundo entre tandas para evitar sobrecargar el cliente MQTT
    delay(1000);
  }

  // Limpiar los resultados del escaneo y esperar 10 segundos antes del siguiente escaneo
  pBLEScan->clearResults();
  delay(10000);
}

