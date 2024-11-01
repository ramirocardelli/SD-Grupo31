#include <WiFi.h>
#include <PubSubClient.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

// Constants
const char* ssid = "XXXXXXX";
const char* password = "XXXXXXXX";
const char* mqtt_server = "192.168.0.142";
const int mqtt_port = 1883;

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

  // Connect to MQTT broker
  client.setServer(mqtt_server, mqtt_port);
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Connected to MQTT");
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
  
  // Prepare the message
  String message = "{\n  checkpointID: \"" + checkpointID + "\",\n  animals: [\n";

  // Loop through found devices
  for (int i = 0; i < foundDevices->getCount(); i++) {
    BLEAdvertisedDevice device = foundDevices->getDevice(i);
    String deviceName = device.getName().c_str();
    String deviceAddress = device.getAddress().toString().c_str();
    int rssi = device.getRSSI(); // Get the RSSI value

    // Add device info to the message
    message += "    { id: '" + deviceAddress + "', rssi: " + String(rssi) + " }";
    
    if (i < foundDevices->getCount() - 1) {
      message += ",\n"; // New line for the next device
    }
  }

  message += "\n  ]\n}";
  pBLEScan->clearResults(); // Clear scan results

  // Publish the list of devices to the MQTT topic
  if (client.connected()) {
    client.publish("devices", devices.c_str());
    Serial.println("Published to MQTT:");
    Serial.println(devices);
  } else {
    Serial.println("MQTT connection lost. Attempting to reconnect...");
    if (client.connect("ESP32Client")) {
      Serial.println("Reconnected to MQTT");
    }
  }

  // Wait 10 seconds before next scan
  delay(10000);
}