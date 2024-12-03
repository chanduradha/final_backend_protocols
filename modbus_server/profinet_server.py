import snap7
import asyncio
import json
import struct
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

# FastAPI instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic model to validate the connection configuration from the frontend
class ConnectionConfig(BaseModel):
    device_ip: str
    rack: int = 0
    slot: int = 0


# Pydantic model for each variable in the Data Block (DB)
class DataFieldConfig(BaseModel):
    offset: int  # Starting byte in the DB
    data_type: str  # Type of data: 'int', 'real', 'bool', 'string', 'char', etc.
    string_length: Optional[int] = None  # Optional field for string length if fixed-length string


# Pydantic model for data read configuration (generic for various data sources)
class DataReadConfig(BaseModel):
    data_source: str  # 'db', 'input', 'output', or 'memory'
    db_number: Optional[int] = 1  # Data Block number (if reading from DB)
    fields: List[DataFieldConfig]  # List of fields to read, each with an offset and data type


# Global variable to store PLC client
plc_client = None


# Function to connect to the PLC (or any device) using Snap7
def connect_to_device(ip: str, rack: int, slot: int) -> snap7.client.Client:
    try:
        # Create Snap7 client instance
        client = snap7.client.Client()

        # Connect to the device (PLC) using IP, Rack, and Slot
        client.connect(ip, rack, slot)

        return client
    except Exception as e:
        raise Exception(f"Failed to connect to device: {str(e)}")


# Function to read and interpret data from the PLC (based on user input for offset and type)
def read_and_interpret_data(client: snap7.client.Client, config: DataReadConfig):
    try:
        if config.data_source == "db":
            # Read data from a Data Block
            result = client.db_read(config.db_number, 0, max([field.offset for field in config.fields]) + 10)
        elif config.data_source == "input":
            # Read from input area (I)
            result = client.read_area(snap7.types.Areas.INPUTS, 0, 0,
                                      max([field.offset for field in config.fields]) + 10)
        elif config.data_source == "output":
            # Read from output area (Q)
            result = client.read_area(snap7.types.Areas.OUTPUTS, 0, 0,
                                      max([field.offset for field in config.fields]) + 10)
        elif config.data_source == "memory":
            # Read from memory area (M)
            result = client.read_area(snap7.types.Areas.MK, 0, 0, max([field.offset for field in config.fields]) + 10)
        else:
            raise Exception("Invalid data source. Choose 'db', 'input', 'output', or 'memory'.")

        # Interpret the raw bytes in the DB based on the provided fields' data types
        interpreted_data = []

        for field in config.fields:
            byte_index = field.offset
            if field.data_type == "int":
                # Interpret as signed 16-bit integer (INT)
                if byte_index + 2 <= len(result):
                    value = struct.unpack_from('>h', result, byte_index)[0]
                    interpreted_data.append({'offset': field.offset, 'type': 'int', 'value': value})
                    byte_index += 2
            elif field.data_type == "real":
                # Interpret as 32-bit float (REAL)
                if byte_index + 4 <= len(result):
                    value = struct.unpack_from('>f', result, byte_index)[0]
                    interpreted_data.append({'offset': field.offset, 'type': 'real', 'value': value})
                    byte_index += 4
            elif field.data_type == "bool":
                # Interpret as single byte boolean (BOOL)
                if byte_index + 1 <= len(result):
                    value = bool(result[byte_index])
                    interpreted_data.append({'offset': field.offset, 'type': 'bool', 'value': value})
                    byte_index += 1
            elif field.data_type == "string":
                # Handle string data type (either null-terminated or fixed length)
                if field.string_length:
                    # Fixed-length string
                    if byte_index + field.string_length <= len(result):
                        string_value = result[byte_index:byte_index + field.string_length].decode('ascii',
                                                                                                  errors='ignore').strip()
                        interpreted_data.append({'offset': field.offset, 'type': 'string', 'value': string_value})
                        byte_index += field.string_length
                    else:
                        raise Exception("Fixed-length string exceeds available bytes.")
                else:
                    # Null-terminated string
                    null_byte_index = result[byte_index:].find(b'\x00')
                    if null_byte_index != -1:
                        string_value = result[byte_index:byte_index + null_byte_index].decode('ascii', errors='ignore')
                        interpreted_data.append({'offset': field.offset, 'type': 'string', 'value': string_value})
                        byte_index += null_byte_index
                    else:
                        raise Exception("Null-terminated string not found within available bytes.")
            elif field.data_type == "char":
                # Interpret as a single byte character (CHAR)
                if byte_index + 1 <= len(result):
                    char_value = chr(result[byte_index])  # Decode as a character
                    interpreted_data.append({'offset': field.offset, 'type': 'char', 'value': char_value})
                    byte_index += 1
            else:
                raise Exception(f"Unsupported data type: {field.data_type}")

        return interpreted_data
    except Exception as e:
        raise Exception(f"Error reading data: {str(e)}")


# WebSocket endpoint for connection
@app.websocket("/ws/connect")
async def websocket_connect(websocket: WebSocket):
    global plc_client
    await websocket.accept()

    try:
        # Wait for connection configuration
        data = await websocket.receive_json()
        config = ConnectionConfig(**data)

        # Connect to the device
        plc_client = connect_to_device(config.device_ip, config.rack, config.slot)

        # Send connection success message
        await websocket.send_json({
            "status": "success",
            "message": "Connection successful"
        })

    except Exception as e:
        await websocket.send_json({
            "status": "error",
            "message": str(e)
        })
        await websocket.close()


# WebSocket endpoint for data reading
@app.websocket("/ws/read_data")
async def websocket_read_data(websocket: WebSocket):
    global plc_client
    await websocket.accept()

    try:
        # Ensure PLC client exists
        if plc_client is None:
            await websocket.send_json({
                "status": "error",
                "message": "PLC is not connected. Please connect first."
            })
            await websocket.close()
            return

        # Wait for read configuration
        data = await websocket.receive_json()
        config = DataReadConfig(**data)

        # Read and interpret data
        result = read_and_interpret_data(plc_client, config)

        # Send data back
        await websocket.send_json({
            "status": "success",
            "data": result
        })

    except Exception as e:
        await websocket.send_json({
            "status": "error",
            "message": str(e)
        })
        await websocket.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8009)