from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from pymodbus.client import ModbusTcpClient
from typing import List, Dict, Optional
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections
modbus_clients: Dict[str, ModbusTcpClient] = {}
websocket_connections: Dict[str, WebSocket] = {}


class ModbusCommand:
    def __init__(self, command_type: str, data: dict):
        self.command_type = command_type
        self.data = data


async def handle_connect(websocket: WebSocket, data: dict) -> dict:
    try:
        ip_address = data.get('ip_address')
        port = data.get('port', 502)

        client = ModbusTcpClient(
            host=ip_address,
            port=port
        )

        if not client.connect():
            return {"status": "error", "message": "Failed to connect to the Modbus server"}

        connection_id = f"{ip_address}:{port}"
        modbus_clients[connection_id] = client
        websocket_connections[connection_id] = websocket

        return {"status": "success", "connection_id": connection_id}
    except Exception as e:
        return {"status": "error", "message": str(e)}


async def handle_read(data: dict) -> dict:
    try:
        connection_id = next(iter(modbus_clients.keys()))  # Get the first (and should be only) connection
        client = modbus_clients.get(connection_id)

        if not client:
            return {"status": "error", "message": "No active connection found"}

        address = data.get('address')
        count = data.get('count', 1)
        function_code = data.get('function_code')

        # Map function codes to their respective read operations
        function_code_map = {
            1: client.read_coils,
            2: client.read_discrete_inputs,
            3: client.read_holding_registers,
            4: client.read_input_registers
        }

        if function_code not in function_code_map:
            return {"status": "error", "message": f"Invalid function code. Must be between 1-4. Got: {function_code}"}

        read_function = function_code_map[function_code]
        response = read_function(address, count)

        if response.isError():
            return {"status": "error", "message": "Failed to read data"}

        # Return bits for coils and discrete inputs, registers for the rest
        if function_code in [1, 2]:
            return {"status": "success", "values": response.bits[:count]}
        else:
            return {"status": "success", "values": response.registers}

    except Exception as e:
        return {"status": "error", "message": str(e)}


async def handle_write(data: dict) -> dict:
    try:
        connection_id = next(iter(modbus_clients.keys()))  # Get the first (and should be only) connection
        client = modbus_clients.get(connection_id)

        if not client:
            return {"status": "error", "message": "No active connection found"}

        address = data.get('address')
        values = data.get('values', [])
        function_code = data.get('function_code')

        # Map function codes to their respective write operations and validate request
        if function_code == 5:  # Write single coil
            if len(values) != 1:
                return {"status": "error", "message": "Single coil write requires exactly one value"}
            response = client.write_coil(address, bool(values[0]))

        elif function_code == 6:  # Write single register
            if len(values) != 1:
                return {"status": "error", "message": "Single register write requires exactly one value"}
            response = client.write_register(address, values[0])

        elif function_code == 15:  # Write multiple coils
            response = client.write_coils(address, [bool(v) for v in values])

        elif function_code == 16:  # Write multiple registers
            response = client.write_registers(address, values)

        else:
            return {"status": "error", "message": "Invalid function code. Must be 5, 6, 15, or 16 for writing"}

        if response.isError():
            return {"status": "error", "message": "Failed to write data"}

        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


async def handle_disconnect() -> dict:
    try:
        for connection_id, client in modbus_clients.items():
            client.close()
        modbus_clients.clear()
        websocket_connections.clear()
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.websocket("/ws/tcp")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            command = json.loads(data)

            # Process different command types
            if command['type'] == 'connect':
                response = await handle_connect(websocket, command['data'])
            elif command['type'] == 'read':
                response = await handle_read(command['data'])
            elif command['type'] == 'write':
                response = await handle_write(command['data'])
            elif command['type'] == 'disconnect':
                response = await handle_disconnect()
            else:
                response = {"status": "error", "message": "Unknown command type"}

            # Send response back to client
            await websocket.send_json(response)

    except WebSocketDisconnect:
        # Clean up on disconnect
        await handle_disconnect()
    except Exception as e:
        await websocket.send_json({"status": "error", "message": str(e)})
        await handle_disconnect()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8002)
