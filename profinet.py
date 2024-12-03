# import snap7
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from typing import Optional, List
# from fastapi.middleware.cors import CORSMiddleware
# import struct
#
# # FastAPI instance
# app = FastAPI()
# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
# # Pydantic model to validate the connection configuration from the frontend
# class ConnectionConfig(BaseModel):
#     device_ip: str
#     rack: int = 0
#     slot: int = 0
#
#
# # Pydantic model for each variable in the Data Block (DB)
# class DataFieldConfig(BaseModel):
#     offset: int  # Starting byte in the DB
#     data_type: str  # Type of data: 'int', 'real', 'bool', 'string', 'char', etc.
#     string_length: Optional[int] = None  # Optional field for string length if fixed-length string
#
#
# # Pydantic model for data read configuration (generic for various data sources)
# class DataReadConfig(BaseModel):
#     data_source: str  # 'db', 'input', 'output', or 'memory'
#     db_number: Optional[int] = 1  # Data Block number (if reading from DB)
#     fields: List[DataFieldConfig]  # List of fields to read, each with an offset and data type
#
#
# # Function to connect to the PLC (or any device) using Snap7
# def connect_to_device(ip: str, rack: int, slot: int) -> snap7.client.Client:
#     try:
#         # Create Snap7 client instance
#         client = snap7.client.Client()
#
#         # Connect to the device (PLC) using IP, Rack, and Slot
#         client.connect(ip, rack, slot)
#
#         return client
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Failed to connect to device: {str(e)}")
#
#
# # Connection endpoint to establish connection
# @app.post("/connect")
# async def connect_device(config: ConnectionConfig):
#     try:
#         # Attempt to connect to the PLC
#         client = connect_to_device(config.device_ip, config.rack, config.slot)
#
#         # Store the client in a global or session-based storage
#         # For this example, we'll store it as a global variable. This is not ideal for production systems.
#         global plc_client
#         plc_client = client
#
#         return {"status": "success", "message": "Connection successful"}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
#
#
# # Function to read and interpret data from the PLC (based on user input for offset and type)
# def read_and_interpret_data(client: snap7.client.Client, config: DataReadConfig):
#     try:
#         if config.data_source == "db":
#             # Read data from a Data Block
#             result = client.db_read(config.db_number, 0, max([field.offset for field in config.fields]) + 10)
#         elif config.data_source == "input":
#             # Read from input area (I)
#             result = client.read_area(snap7.types.Areas.INPUTS, 0, 0,
#                                       max([field.offset for field in config.fields]) + 10)
#         elif config.data_source == "output":
#             # Read from output area (Q)
#             result = client.read_area(snap7.types.Areas.OUTPUTS, 0, 0,
#                                       max([field.offset for field in config.fields]) + 10)
#         elif config.data_source == "memory":
#             # Read from memory area (M)
#             result = client.read_area(snap7.types.Areas.MK, 0, 0, max([field.offset for field in config.fields]) + 10)
#         else:
#             raise HTTPException(status_code=400,
#                                 detail="Invalid data source. Choose 'db', 'input', 'output', or 'memory'.")
#
#         # Interpret the raw bytes in the DB based on the provided fields' data types
#         interpreted_data = []
#
#         for field in config.fields:
#             byte_index = field.offset
#             if field.data_type == "int":
#                 # Interpret as signed 16-bit integer (INT)
#                 if byte_index + 2 <= len(result):
#                     value = struct.unpack_from('>h', result, byte_index)[0]
#                     interpreted_data.append({'offset': field.offset, 'type': 'int', 'value': value})
#                     byte_index += 2
#             elif field.data_type == "real":
#                 # Interpret as 32-bit float (REAL)
#                 if byte_index + 4 <= len(result):
#                     value = struct.unpack_from('>f', result, byte_index)[0]
#                     interpreted_data.append({'offset': field.offset, 'type': 'real', 'value': value})
#                     byte_index += 4
#             elif field.data_type == "bool":
#                 # Interpret as single byte boolean (BOOL)
#                 if byte_index + 1 <= len(result):
#                     value = bool(result[byte_index])
#                     interpreted_data.append({'offset': field.offset, 'type': 'bool', 'value': value})
#                     byte_index += 1
#             elif field.data_type == "string":
#                 # Handle string data type (either null-terminated or fixed length)
#                 if field.string_length:
#                     # Fixed-length string
#                     if byte_index + field.string_length <= len(result):
#                         string_value = result[byte_index:byte_index + field.string_length].decode('ascii',
#                                                                                                   errors='ignore').strip()
#                         interpreted_data.append({'offset': field.offset, 'type': 'string', 'value': string_value})
#                         byte_index += field.string_length
#                     else:
#                         raise HTTPException(status_code=400, detail="Fixed-length string exceeds available bytes.")
#                 else:
#                     # Null-terminated string
#                     null_byte_index = result[byte_index:].find(b'\x00')
#                     if null_byte_index != -1:
#                         string_value = result[byte_index:byte_index + null_byte_index].decode('ascii', errors='ignore')
#                         interpreted_data.append({'offset': field.offset, 'type': 'string', 'value': string_value})
#                         byte_index += null_byte_index
#                     else:
#                         raise HTTPException(status_code=400,
#                                             detail="Null-terminated string not found within available bytes.")
#             elif field.data_type == "char":
#                 # Interpret as a single byte character (CHAR)
#                 if byte_index + 1 <= len(result):
#                     char_value = chr(result[byte_index])  # Decode as a character
#                     interpreted_data.append({'offset': field.offset, 'type': 'char', 'value': char_value})
#                     byte_index += 1
#             else:
#                 raise HTTPException(status_code=400, detail=f"Unsupported data type: {field.data_type}")
#
#         return interpreted_data
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Error reading data: {str(e)}")
#
#
# # Data read endpoint to retrieve data from the PLC
# @app.post("/read_data")
# async def read_data(config: DataReadConfig):
#     try:
#         # Ensure the client exists (i.e., the connection is established)
#         if 'plc_client' not in globals():
#             raise HTTPException(status_code=400, detail="PLC is not connected. Please connect first.")
#
#         # Read and interpret the data from the specified source
#         data = read_and_interpret_data(plc_client, config)
#
#         return {"status": "success", "data": data}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
#
#
# if __name__ == "__main__":
#     import uvicorn
#
#     uvicorn.run(app, host="localhost", port=8000)
# ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

# import asyncio
# import websockets
# import json
# import snap7
# import struct
# from starlette.middleware.cors import CORSMiddleware
# from starlette.applications import Starlette
# from starlette.routing import WebSocketRoute
#
#
# class PLCConnection:
#     def __init__(self):
#         self.client = None
#         self.websocket = None
#
#     async def connect_to_device(self, ip, rack=0, slot=0):
#         """
#         Attempt to connect to the PLC device
#
#         Args:
#             ip (str): IP address of the PLC
#             rack (int, optional): Rack number. Defaults to 0.
#             slot (int, optional): Slot number. Defaults to 0.
#
#         Returns:
#             dict: Connection status and message
#         """
#         try:
#             # Create Snap7 client instance
#             self.client = snap7.client.Client()
#
#             # Attempt connection
#             connection_result = self.client.connect(ip, rack, slot)
#
#             # Check if connection was successful
#             if connection_result:
#                 return {
#                     'status': 'success',
#                     'message': f'Successfully connected to PLC at {ip}'
#                 }
#             else:
#                 return {
#                     'status': 'error',
#                     'message': 'Failed to establish connection with PLC'
#                 }
#         except Exception as e:
#             return {
#                 'status': 'error',
#                 'message': f'Connection failed: {str(e)}'
#             }
#
#     async def read_and_interpret_data(self, data_source, db_number, fields):
#         """
#         Read and interpret data from the PLC
#
#         Args:
#             data_source (str): Source of data (db, input, output, memory)
#             db_number (int): Database number
#             fields (list): List of fields to read
#
#         Returns:
#             dict: Interpreted data or error message
#         """
#         try:
#             # Verify PLC connection
#             if not self.client:
#                 return {
#                     'status': 'error',
#                     'message': 'Not connected to PLC'
#                 }
#
#             # Determine max offset to read
#             max_offset = max([field['offset'] for field in fields]) + 10
#
#             # Read data from the specified source
#             if data_source == "db":
#                 result = self.client.db_read(db_number, 0, max_offset)
#             elif data_source == "input":
#                 result = self.client.read_area(snap7.types.Areas.INPUTS, 0, 0, max_offset)
#             elif data_source == "output":
#                 result = self.client.read_area(snap7.types.Areas.OUTPUTS, 0, 0, max_offset)
#             elif data_source == "memory":
#                 result = self.client.read_area(snap7.types.Areas.MK, 0, 0, max_offset)
#             else:
#                 return {
#                     'status': 'error',
#                     'message': 'Invalid data source'
#                 }
#
#             # Interpret the raw bytes
#             interpreted_data = []
#             for field in fields:
#                 byte_index = field['offset']
#                 data_type = field['data_type']
#
#                 try:
#                     if data_type == "int":
#                         value = struct.unpack_from('>h', result, byte_index)[0]
#                         interpreted_data.append({
#                             'offset': byte_index,
#                             'type': 'int',
#                             'value': value
#                         })
#                     elif data_type == "real":
#                         value = struct.unpack_from('>f', result, byte_index)[0]
#                         interpreted_data.append({
#                             'offset': byte_index,
#                             'type': 'real',
#                             'value': value
#                         })
#                     elif data_type == "bool":
#                         value = bool(result[byte_index])
#                         interpreted_data.append({
#                             'offset': byte_index,
#                             'type': 'bool',
#                             'value': value
#                         })
#                     elif data_type == "char":
#                         value = chr(result[byte_index])
#                         interpreted_data.append({
#                             'offset': byte_index,
#                             'type': 'char',
#                             'value': value
#                         })
#                     else:
#                         return {
#                             'status': 'error',
#                             'message': f'Unsupported data type: {data_type}'
#                         }
#                 except (IndexError, struct.error) as e:
#                     return {
#                         'status': 'error',
#                         'message': f'Error reading field at offset {byte_index}: {str(e)}'
#                     }
#
#             return {
#                 'status': 'success',
#                 'data': interpreted_data
#             }
#         except Exception as e:
#             return {
#                 'status': 'error',
#                 'message': str(e)
#             }
#
#
# async def websocket_endpoint(websocket):
#     """
#     Main WebSocket endpoint for handling PLC connections and data reading
#
#     Args:
#         websocket (WebSocket): Incoming WebSocket connection
#     """
#     plc = PLCConnection()
#     plc.websocket = websocket
#
#     try:
#         await websocket.accept()
#
#         async for message in websocket.receive_text():
#             try:
#                 # Parse incoming JSON message
#                 data = json.loads(message)
#
#                 if data['type'] == 'connect':
#                     # Handle connection request
#                     connection_result = await plc.connect_to_device(
#                         data.get('url', ''),
#                         data.get('rack', 0),
#                         data.get('slot', 0)
#                     )
#
#                     # Send connection result back to client
#                     await websocket.send_text(json.dumps(connection_result))
#
#                 elif data['type'] == 'read_node':
#                     # Handle data reading request
#                     read_result = await plc.read_and_interpret_data(
#                         data.get('data_source', 'db'),
#                         data.get('db_number', 1),
#                         data.get('fields', [])
#                     )
#
#                     # Send read result back to client
#                     await websocket.send_text(json.dumps(read_result))
#
#             except json.JSONDecodeError:
#                 await websocket.send_text(json.dumps({
#                     'status': 'error',
#                     'message': 'Invalid JSON format'
#                 }))
#             except KeyError as e:
#                 await websocket.send_text(json.dumps({
#                     'status': 'error',
#                     'message': f'Missing required field: {str(e)}'
#                 }))
#             except Exception as e:
#                 await websocket.send_text(json.dumps({
#                     'status': 'error',
#                     'message': str(e)
#                 }))
#
#     except websockets.exceptions.ConnectionClosed:
#         print("WebSocket connection closed")
#     except Exception as e:
#         print(f"WebSocket error: {e}")
#     finally:
#         # Ensure client is closed if it exists
#         if plc.client:
#             plc.client.disconnect()
#
# # Create Starlette app with WebSocket route
# app = Starlette(routes=[
#     WebSocketRoute("/ws", websocket_endpoint)  # Note the /ws path
# ])
#
# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )
#
# # Use uvicorn to run the app
# if __name__ == "__main__":
#     import uvicorn
#
#     uvicorn.run(app, host="localhost", port=8009)

# //''''''''''''''''below code is using websocket ''''''''''''''''''''''''''
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