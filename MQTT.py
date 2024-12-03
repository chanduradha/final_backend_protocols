# ''''''''''''''''''see this below code is using fastapi endpoints''''''''''''''''''''''''''''''
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import paho.mqtt.client as mqtt
# import threading
# from typing import List, Optional
# from fastapi.middleware.cors import CORSMiddleware
# # FastAPI app instance
# app = FastAPI()
#
#
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
# # MQTT client instance
# client = mqtt.Client()
# connected = False  # Track connection status
# received_topics = {}  # Store topics and the messages received for them
#
#
# # Callback when the connection to the broker is established
# def on_connect(client, userdata, flags, rc):
#     global connected
#     print(f"Connected with result code {rc}")
#     connected = True
#
#     # Subscribe to wildcard topic to capture all topics
#     client.subscribe('#')  # The '#' wildcard subscribes to all topics
#
#
# # Callback when a message is received from a subscribed topic
# def on_message(client, userdata, msg):
#     global received_topics
#     topic = msg.topic
#     message = msg.payload.decode()  # Decode the payload
#     qos = msg.qos  # Get the QoS level
#     print(f"Received message on topic {topic}: {message} (QoS: {qos})")
#     # Store the message and QoS level in the dictionary with the topic as the key
#     received_topics[topic] = {"message": message, "qos": qos}
#
#
# # Pydantic model to receive connection parameters
# class MqttConnectionParams(BaseModel):
#     broker: str
#     port: int
#     username: Optional[str] = None
#     password: Optional[str] = None
#
#
# # Pydantic model to receive topics for subscription
# class TopicsToSubscribe(BaseModel):
#     topics: List[str]
#
#
# class TopicSubscriptionWithQoS(BaseModel):
#     topic: str
#     qos: Optional[int] = 0  # Default to QoS 0 if not provided
#
#
# class TopicsToSubscribeWithQoS(BaseModel):
#     subscriptions: List[TopicSubscriptionWithQoS]
#
#
# # Pydantic model to handle publishing new message
# class PublishMessage(BaseModel):
#     topic: str
#     message: str
#     qos: Optional[int] = 0  # Default QoS level is 0
#
#
# # API endpoint for connecting to MQTT broker
# @app.post("/connect")
# async def connect_to_mqtt(params: MqttConnectionParams):
#     global client, connected, received_topics
#
#     # Reset received topics for each new connection
#     received_topics = {}
#
#     # Set the username and password if provided
#     if params.username and params.password:
#         client.username_pw_set(params.username, params.password)
#
#     # Set callback functions
#     client.on_connect = on_connect
#     client.on_message = on_message
#
#     try:
#         # Establish connection to MQTT broker
#         client.connect(params.broker, params.port, 60)
#         # Start the network loop in a separate thread to handle incoming messages
#         threading.Thread(target=client.loop_forever, daemon=True).start()
#
#         return {"success": True, "message": f"Connected to {params.broker} on port {params.port}."}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error connecting to broker: {str(e)}")
#
#
# # API endpoint to get all topics received messages from
# @app.get("/topics")
# async def get_available_topics():
#     if not connected:
#         raise HTTPException(status_code=400, detail="Not connected to MQTT broker yet.")
#
#     # Return only the list of topic names that have received messages
#     if received_topics:
#         return {"available_topics": list(received_topics.keys())}
#     else:
#         return {"message": "No topics have been received yet."}
#
#
# # API endpoint to subscribe to one or more topics and display recent messages
# @app.post("/subscribe")
# async def subscribe_to_topics(params: TopicsToSubscribeWithQoS):
#     if not connected:
#         raise HTTPException(status_code=400, detail="Not connected to MQTT broker yet.")
#
#     try:
#         # Subscribe to the specified topics and collect the most recent messages
#         response = {"subscribed_topics": [], "messages": []}
#         for subscription in params.subscriptions:
#             # Subscribe to the topic with the provided QoS level
#             client.subscribe(subscription.topic, qos=subscription.qos)
#             response["subscribed_topics"].append(subscription.topic)
#
#             # Check if there's a received message for the topic and include it in the response
#             data = received_topics.get(subscription.topic, None)
#             if data:
#                 response["messages"].append({
#                     "topic": subscription.topic,
#                     "message": data["message"],
#                     "qos": data["qos"]
#                 })
#             else:
#                 response["messages"].append(
#                     {"topic": subscription.topic, "message": "No message received yet.", "qos": "N/A"})
#
#         return response
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error subscribing to topics: {str(e)}")
#
#
# # API endpoint to publish a new message to a specified topic
# @app.post("/publish")
# async def publish_message(params: PublishMessage):
#     if not connected:
#         raise HTTPException(status_code=400, detail="Not connected to MQTT broker yet.")
#
#     try:
#         # Publish the message to the specified topic with the given QoS level
#         # Ensure the QoS level is an integer (0, 1, or 2)
#         qos_level = int(params.qos)
#
#         if qos_level not in [0, 1, 2]:
#             raise HTTPException(status_code=400, detail="Invalid QoS level. It must be 0, 1, or 2.")
#
#         # Publish the message
#         client.publish(params.topic, params.message, qos=qos_level)
#
#         return {"success": True,
#                 "message": f"Message '{params.message}' published to topic '{params.topic}' with QoS {qos_level}."}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error publishing message: {str(e)}")
#
#
# if __name__ == "__main__":
#     import uvicorn
#
#     uvicorn.run(app, host="localhost", port=8003)

#''''''''''''''''''''''' below code is using websocket endpoint'''''''''''''''''''''''''''''''''''''''''''''''''''''
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