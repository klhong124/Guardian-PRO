#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>

const char* ssid = "AXE";
const char* password = "erickwan";

WebServer server(80);

const int DoorLock = 2;
const int DoorState = 36;

void handleRoot() {
  server.send(200, "text/plain", "hello from esp32!");
}

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
}

void setup(void) {
  pinMode(DoorLock, OUTPUT); //set up D2 pin
  digitalWrite(DoorLock, 0); // lock D2
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp32")) {
    Serial.println("MDNS responder started");
  }

// server routes
  server.on("/", handleRoot);
  server.onNotFound(handleNotFound);

// server function
  server.on("/door/unlock", []() {
    digitalWrite(DoorLock, 1);
    delay(500);
    digitalWrite(DoorLock, 1);
    server.send(200, "text/plain", "this works as well");
  });
    server.on("/door", []() {
     server.send(200, "text/plane", String(analogRead(DoorState)));
  });

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void) {
  server.handleClient();
}
