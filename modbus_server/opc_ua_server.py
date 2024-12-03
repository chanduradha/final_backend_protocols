from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from opcua import Client, ua
import uvicorn
import json
import asyncio
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store the connection client globally
connected_client = None
global_connection_params = None


class ConnectionParams(BaseModel):
    url: str
    username: str
    password: str


class NodeRequest(BaseModel):
    node_id: str


def read_parameter_value(client, node_id):
    try:
        if client is None:
            logger.error("Client is None when trying to read parameter value")
            return None

        # Read the value of the parameter node
        try:
            parameter_node = client.get_node(node_id)
            if parameter_node is None:
                logger.error(f"Could not get node for node_id: {node_id}")
                return None

            parameter_value = parameter_node.get_value()
            return parameter_value
        except Exception as e:
            logger.error(f"Error getting node or value for {node_id}: {e}")
            return None
    except Exception as e:
        logger.error(f"Unexpected error in read_parameter_value: {e}")
        return None


def get_node_description(client, node_id):
    try:
        if client is None:
            logger.error("Client is None when trying to get node description")
            return None

        # Get node's description (e.g., display name)
        try:
            node = client.get_node(node_id)
            if node is None:
                logger.error(f"Could not get node for node_id: {node_id}")
                return None

            description = node.get_display_name().Text
            return description
        except Exception as e:
            logger.error(f"Error getting node description for {node_id}: {e}")
            return None
    except Exception as e:
        logger.error(f"Unexpected error in get_node_description: {e}")
        return None


def check_if_folder(client, node_id):
    try:
        if client is None:
            logger.error("Client is None when checking if node is a folder")
            return False

        # Check if the node is a folder or a parameter
        try:
            node = client.get_node(node_id)
            if node is None:
                logger.error(f"Could not get node for node_id: {node_id}")
                return False

            # In OPC UA, Folders are often instances of the FolderType or similar types
            return node.get_node_class() == ua.NodeClass.Object
        except Exception as e:
            logger.error(f"Error checking node class for {node_id}: {e}")
            return False
    except Exception as e:
        logger.error(f"Unexpected error in check_if_folder: {e}")
        return False


async def connect_to_opc_server(connection_params):
    global connected_client, global_connection_params
    try:
        # Only connect if we haven't connected yet
        if connected_client is None:
            try:
                # Create a new client instance
                connected_client = Client(connection_params['url'])

                # Set credentials if provided
                if connection_params.get('username'):
                    connected_client.set_user(connection_params['username'])
                if connection_params.get('password'):
                    connected_client.set_password(connection_params['password'])

                # Connect to the server
                connected_client.connect()

                # Store the connection parameters for future use
                global_connection_params = connection_params

                logger.info(f"Successfully connected to {connection_params['url']}")
                return {"status": "connected", "message": f"Successfully connected to {connection_params['url']}"}
            except Exception as connect_error:
                logger.error(f"Connection error: {connect_error}")
                return {"status": "error", "message": f"Error connecting to server: {str(connect_error)}"}
        else:
            logger.info("Already connected to the server")
            return {"status": "already_connected", "message": "Already connected to the server."}
    except Exception as e:
        logger.error(f"Unexpected error in connect_to_opc_server: {e}")
        return {"status": "error", "message": f"Unexpected error: {str(e)}"}


async def read_opc_node(node_id):
    global connected_client
    try:
        # Ensure the client is connected
        if connected_client is None:
            logger.error("Not connected to the server")
            return {"status": "error", "message": "Not connected to the server yet. Please connect first."}

        # Check if the node is a folder
        try:
            if check_if_folder(connected_client, node_id):
                # If it's a folder, get its description
                description = get_node_description(connected_client, node_id)
                return {"node_id": node_id, "description": description, "type": "folder", "status": "success"}
            else:
                # If it's a parameter, fetch its value
                node_value = read_parameter_value(connected_client, node_id)
                if node_value is not None:
                    return {"node_id": node_id, "value": node_value, "type": "parameter", "status": "success"}
                else:
                    return {"status": "error", "message": "Error reading node value."}
        except Exception as node_error:
            logger.error(f"Error processing node {node_id}: {node_error}")
            return {"status": "error", "message": f"Error processing node: {str(node_error)}"}
    except Exception as e:
        logger.error(f"Unexpected error in read_opc_node: {e}")
        return {"status": "error", "message": f"Unexpected error reading node: {str(e)}"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)

            # Handle different types of WebSocket requests
            if message['type'] == 'connect':
                # Extract connection parameters
                connection_result = await connect_to_opc_server({
                    'url': message['url'],
                    'username': message.get('username', ''),
                    'password': message.get('password', '')
                })
                await websocket.send_text(json.dumps(connection_result))

            elif message['type'] == 'read_node':
                # Read node value
                node_result = await read_opc_node(message['node_id'])
                await websocket.send_text(json.dumps(node_result))

            else:
                # Invalid message type
                logger.warning(f"Invalid message type: {message['type']}")
                await websocket.send_text(json.dumps({
                    'status': 'error',
                    'message': 'Invalid message type'
                }))

    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
    except Exception as e:
        logger.error(f"Error in WebSocket: {e}")
        await websocket.close()


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8004)