import paho.mqtt.client as mqtt
import random
import time

# MQTT Broker details
broker = "localhost"  # Broker running locally
port = 1883
topics = ["sensor/temperature", "sensor/humidity", "device/status", "sensor/pressure"]

# Set MQTT credentials
username = "GOKUL"
password = "12345"

# Callback function when connected to the broker
def on_connect(client, userdata, flags, rc):
    if rc != 0:
        print(f"Connection failed with result code {rc}. Check your credentials or broker settings.")
        client.disconnect()  # Disconnect if connection failed
    else:
        print(f"Connected with result code {rc}")

# Initialize MQTT Client
client = mqtt.Client()

# Set the username and password for authentication
client.username_pw_set(username, password)

# Set the on_connect callback function
client.on_connect = on_connect

# Connect to the broker
try:
    client.connect(broker, port, 60)
except Exception as e:
    print(f"Error connecting to the broker: {e}")
    exit(1)

# Start the loop to handle the communication
client.loop_start()

try:
    while True:
        # Generate random data and publish to random topics
        for topic in topics:
            if topic == "sensor/temperature":
                payload = f"{random.uniform(20.0, 30.0):.2f}"  # Random temperature between 20 and 30
            elif topic == "sensor/humidity":
                payload = f"{random.uniform(40.0, 60.0):.2f}"  # Random humidity between 40% and 60%
            elif topic == "device/status":
                payload = random.choice(["online", "offline", "maintenance"])  # Random device status
            elif topic == "sensor/pressure":
                payload = f"{random.uniform(980.0, 1050.0):.2f}"  # Random pressure between 980 and 1050 hPa

            print(f"Publishing to topic {topic}: {payload}")
            client.publish(topic, payload)

        # Wait for 5 seconds before publishing new values
        time.sleep(5)

except KeyboardInterrupt:
    print("Publishing stopped.")
    client.loop_stop()
    client.disconnect()
