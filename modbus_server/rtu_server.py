from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import minimalmodbus
import serial
import struct
import logging
import json
from typing import Dict, Set

# Initialize FastAPI app
app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModbusConfig(BaseModel):
    port: str
    slave_address: int
    baudrate: int
    parity: str
    stopbits: int
    timeout: int

class ReadRegisterConfig(BaseModel):
    function_code: int
    register_range_start: int
    register_range_end: int
    combine_registers: bool = True
    endianess: str = "little"

# Store active connections and their configurations
class ConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.connection_configs: Dict[WebSocket, dict] = {}
        self.instruments: Dict[WebSocket, minimalmodbus.Instrument] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        if websocket in self.connection_configs:
            del self.connection_configs[websocket]
        if websocket in self.instruments:
            try:
                self.instruments[websocket].serial.close()
            except:
                pass
            del self.instruments[websocket]

    async def connect_modbus(self, websocket: WebSocket, config: dict):
        try:
            # Mapping of parity values
            parity_map = {
                'even': serial.PARITY_EVEN,
                'odd': serial.PARITY_ODD,
                'none': serial.PARITY_NONE
            }

            # Set up the Modbus RTU device connection
            instrument = minimalmodbus.Instrument(
                config['port'],
                config['slave_address']
            )
            instrument.serial.baudrate = config['baudrate']
            instrument.serial.bytesize = 8
            instrument.serial.parity = parity_map.get(config['parity'], serial.PARITY_NONE)
            instrument.serial.stopbits = config['stopbits']
            instrument.serial.timeout = config['timeout']

            # Test read from register 142 to verify communication
            registers = instrument.read_registers(142, 2, functioncode=3)

            # Store the configuration and instrument
            self.connection_configs[websocket] = config
            self.instruments[websocket] = instrument

            # Send success message
            await websocket.send_json({
                "type": "connection_status",
                "status": "success",
                "message": "Connected to Modbus device successfully!"
            })

        except Exception as e:
            await websocket.send_json({
                "type": "connection_status",
                "status": "error",
                "message": f"Connection failed: {str(e)}"
            })

    @staticmethod
    def combine_registers_and_convert_to_float(registers, endianess="little"):
        """
        Combine two 16-bit Modbus registers into a 32-bit integer and convert to a float.
        """
        if endianess == "little":
            # Little Endian: First register is the most significant part
            int_value = (registers[0] << 16) + registers[1]
        else:
            # Big Endian: Second register is the most significant part
            int_value = (registers[1] << 16) + registers[0]

        # Convert the 32-bit integer to a float using IEEE 754 format
        float_value = struct.unpack('f', struct.pack('I', int_value))[0]
        return float_value

    async def read_registers(self, websocket: WebSocket, config: dict):
        """Read data from Modbus device using the specified configuration."""
        try:
            if websocket not in self.instruments:
                await websocket.send_json({
                    "type": "read_status",
                    "status": "error",
                    "message": "Not connected to any device"
                })
                return

            instrument = self.instruments[websocket]
            register_count = config['register_range_end'] - config['register_range_start'] + 1

            # Read the registers using the specified function code
            registers = instrument.read_registers(
                config['register_range_start'],
                register_count,
                functioncode=config['function_code']
            )

            # Process registers based on configuration
            result = []
            if config.get('combine_registers', True):
                # Combine registers into float values
                for i in range(0, len(registers), 2):
                    if i + 1 < len(registers):
                        combined_float = self.combine_registers_and_convert_to_float(
                            registers[i:i + 2],
                            config.get('endianess', 'little')
                        )
                        result.append({
                            "register_address": config['register_range_start'] + i,
                            "value": combined_float
                        })
            else:
                # Return individual register values
                for i, register in enumerate(registers):
                    result.append({
                        "register_address": config['register_range_start'] + i,
                        "value": register
                    })

            # Send success response with data
            await websocket.send_json({
                "type": "read_status",
                "status": "success",
                "message": "Data read successfully",
                "data": result
            })

        except minimalmodbus.ModbusException as e:
            await websocket.send_json({
                "type": "read_status",
                "status": "error",
                "message": f"Modbus Error: {str(e)}"
            })
        except Exception as e:
            await websocket.send_json({
                "type": "read_status",
                "status": "error",
                "message": f"Read failed: {str(e)}"
            })


manager = ConnectionManager()


@app.websocket("/ws/modbusrtu")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            if message['type'] == 'connect':
                await manager.connect_modbus(websocket, message['data'])

            elif message['type'] == 'disconnect':
                manager.disconnect(websocket)
                await websocket.send_json({
                    "type": "connection_status",
                    "status": "success",
                    "message": "Disconnected successfully"
                })

            elif message['type'] == 'read_registers':
                await manager.read_registers(websocket, message['data'])

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logging.error(f"WebSocket error: {str(e)}")
        try:
            await websocket.send_json({
                "type": "error",
                "message": f"Error: {str(e)}"
            })
        except:
            pass
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8005)