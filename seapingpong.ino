#include <WiFiClientSecure.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiUdp.h>
#include <ESP8266WiFiType.h>
#include <ESP8266WiFiAP.h>
#include <WiFiClient.h>
#include <WiFiServer.h>
#include <ESP8266WiFiScan.h>
#include <ESP8266WiFiGeneric.h>
#include <ESP8266WiFiSTA.h>

#include "Arduino.h"

unsigned long time_start;  
class PingPongButton
{
public:
  String Id;
  int Pin;
  
  unsigned long BtnPressDown;
  int BtnState;
  
  PingPongButton(String id, int pin)
  {
    Id = id;
    Pin = pin;
    
    BtnPressDown = 0;
    BtnState = HIGH;
  }
};

PingPongButton g_btns[] = {
    PingPongButton("a", D1),
    PingPongButton("b", D3),
    PingPongButton("reset", D5)
  };


void setup() {
  Serial.begin(9600);
  BlinkOff();
  for (int i = 0; i < 3; i++)
  {
    Serial.println("Setting " + g_btns[i].Id + " on " + String(g_btns[i].Pin) + " to INPUT");
    pinMode(g_btns[i].Pin, INPUT);
  }

  pinMode(D7, OUTPUT);
  time_start = millis();
  ConnectWifi();
}

void ProcessButton(int i)
{
  int newBtnState = digitalRead(g_btns[i].Pin);
  if (g_btns[i].BtnState != newBtnState)
  {
      if (newBtnState == HIGH)
      {
          // low -> high == release
          digitalWrite(D7, LOW);
          unsigned int duration = millis() - g_btns[i].BtnPressDown;
          ReportScore(duration, g_btns[i].Id);
          delay(10);
      }
      else
      {
          // high -> low == press
          digitalWrite(D7, HIGH);
          g_btns[i].BtnPressDown = millis();
      }
      
      g_btns[i].BtnState = newBtnState;
  }
}

void loop() {
    for (int i = 0; i < 3; i++)
    {
      ProcessButton(i);
      delay(10);
    }
    delay(10);
}

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

ESP8266WiFiMulti WiFiMulti;

void ConnectWifi()
{
  WiFi.persistent(false);

  Serial.println("MAC address is ");
  (WiFi.macAddress());

  WiFiMulti.addAP("ssid", "password");
  
  Serial.println("Connecting");
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected!");
  Serial.println(WiFi.localIP().toString());
}

void ReportScore(int duration, String btnId)
{
  String scoreUrl = String("http://seapingpong.cfapps.io/score");
  Serial.println("Score URL: " + scoreUrl);
  
  HTTPClient http;
  http.begin(scoreUrl);
  http.addHeader("Content-Type", "application/json");
  int statusCode = http.POST("{ \"btn_id\":\"" + btnId + "\",\"duration\":\"" + String(duration) + "\"}");
  Serial.print("http.POST() returned: ");
  Serial.println(String(statusCode));

  if (statusCode < 0)
  {
    http.end();
    return;
  }

  String resp = http.getString();
  Serial.print("response: ");
  Serial.println(resp);
  http.end();  
}

