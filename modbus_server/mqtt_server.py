import asyncio
import json
from typing import List, Optional, Dict

import paho.mqtt.client as mqtt
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# FastAPI app instance
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MQTT client and global variables
client = mqtt.Client()
connected = False
received_topics: Dict[str, Dict[str, any]] = {}


# MQTT Callbacks
def on_connect(client, userdata, flags, rc):
    global connected
    print(f"Connected with result code {rc}")
    connected = True
    client.subscribe('#')  # Subscribe to all topics


def on_message(client, userdata, msg):
    global received_topics
    topic = msg.topic
    message = msg.payload.decode()
    qos = msg.qos
    print(f"Received message on topic {topic}: {message} (QoS: {qos})")
    received_topics[topic] = {"message": message, "qos": qos}


# Set MQTT callbacks
client.on_connect = on_connect
client.on_message = on_message


# Pydantic models
class MqttConnectionParams(BaseModel):
    broker: str
    port: int
    username: Optional[str] = None
    password: Optional[str] = None


class TopicSubscriptionWithQoS(BaseModel):
    topic: str
    qos: Optional[int] = 0


class PublishMessage(BaseModel):
    topic: str
    message: str
    qos: Optional[int] = 0


# WebSocket connection and message handler
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            # Receive data from the WebSocket
            data = await websocket.receive_json()

            # Handle different types of messages
            message_type = data.get('type')

            if message_type == 'connect':
                # Handle MQTT connection
                connection_params = MqttConnectionParams(**data['params'])

                try:
                    # Reset received topics
                    global received_topics
                    received_topics = {}

                    # Set credentials if provided
                    if connection_params.username and connection_params.password:
                        client.username_pw_set(connection_params.username, connection_params.password)

                    # Connect to broker
                    client.connect(connection_params.broker, connection_params.port, 60)

                    # Start MQTT loop in a separate thread
                    mqtt_thread = asyncio.create_task(run_mqtt_loop())

                    # Send connection success response
                    await websocket.send_json({
                        'type': 'connect_response',
                        'success': True,
                        'message': f"Connected to {connection_params.broker} on port {connection_params.port}"
                    })

                except Exception as e:
                    await websocket.send_json({
                        'type': 'connect_response',
                        'success': False,
                        'message': f"Error connecting to broker: {str(e)}"
                    })

            elif message_type == 'get_topics':
                # Get available topics
                if not connected:
                    await websocket.send_json({
                        'type': 'topics_response',
                        'error': 'Not connected to MQTT broker'
                    })
                else:
                    if received_topics:
                        await websocket.send_json({
                            'type': 'topics_response',
                            'available_topics': list(received_topics.keys())
                        })
                    else:
                        await websocket.send_json({
                            'type': 'topics_response',
                            'message': 'No topics have been received yet.'
                        })

            elif message_type == 'subscribe':
                # Subscribe to topics
                if not connected:
                    await websocket.send_json({
                        'type': 'subscribe_response',
                        'error': 'Not connected to MQTT broker'
                    })
                else:
                    try:
                        subscriptions = data.get('subscriptions', [])
                        response = {'type': 'subscribe_response', 'subscribed_topics': [], 'messages': []}

                        for subscription in subscriptions:
                            topic = subscription.get('topic')
                            qos = subscription.get('qos', 0)

                            # Subscribe to the topic
                            client.subscribe(topic, qos=qos)
                            response['subscribed_topics'].append(topic)

                            # Check for received messages
                            topic_data = received_topics.get(topic)
                            if topic_data:
                                response['messages'].append({
                                    'topic': topic,
                                    'message': topic_data['message'],
                                    'qos': topic_data['qos']
                                })
                            else:
                                response['messages'].append({
                                    'topic': topic,
                                    'message': 'No message received yet.',
                                    'qos': 'N/A'
                                })

                        await websocket.send_json(response)

                    except Exception as e:
                        await websocket.send_json({
                            'type': 'subscribe_response',
                            'error': f'Error subscribing to topics: {str(e)}'
                        })

            elif message_type == 'publish':
                # Publish a message
                if not connected:
                    await websocket.send_json({
                        'type': 'publish_response',
                        'error': 'Not connected to MQTT broker'
                    })
                else:
                    try:
                        publish_params = PublishMessage(**data)
                        qos_level = int(publish_params.qos)

                        if qos_level not in [0, 1, 2]:
                            await websocket.send_json({
                                'type': 'publish_response',
                                'error': 'Invalid QoS level. It must be 0, 1, or 2.'
                            })
                            continue

                        # Publish the message
                        client.publish(publish_params.topic, publish_params.message, qos=qos_level)

                        await websocket.send_json({
                            'type': 'publish_response',
                            'success': True,
                            'message': f"Message '{publish_params.message}' published to topic '{publish_params.topic}' with QoS {qos_level}"
                        })

                    except Exception as e:
                        await websocket.send_json({
                            'type': 'publish_response',
                            'error': f'Error publishing message: {str(e)}'
                        })

    except WebSocketDisconnect:
        print("WebSocket connection closed")
    finally:
        # Cleanup if needed
        client.disconnect()


async def run_mqtt_loop():
    """Run the MQTT client loop in a separate thread"""
    client.loop_start()
    while True:
        await asyncio.sleep(1)


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8003)