
import asyncio
import uvicorn
import multiprocessing
import time
import sys
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from opcua import Client, ua
import uvicorn
import json


# Add the current directory to Python path to ensure module imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

def run_rtu_server():
    try:
        uvicorn.run("rtu_server:app", host="localhost", port=8005, reload=False)
    except Exception as e:
        print(f"RTU Server error: {e}")

def run_tcp_server():
    try:
        uvicorn.run("tcp_server:app", host="localhost", port=8002, reload=False)
    except Exception as e:
        print(f"TCP Server error: {e}")

def run_profinet_server():
    try:
        uvicorn.run("profinet_server:app", host="localhost", port=8009, reload=False)
    except Exception as e:
        print(f"PLC Server error: {e}")

def run_http_server():
    try:
        uvicorn.run("http_server:app", host="localhost", port=8006, reload=False)
    except Exception as e:
        print(f"HTTP Server error: {e}")

def run_opc_ua_server():
    try:
        uvicorn.run("opc_ua_server:app", host="localhost", port=8004, reload=False)
    except Exception as e:
        print(f"opcua Server error: {e}")


def run_mqtt_server():
    try:
        uvicorn.run("mqtt_server:app", host="localhost", port=8003, reload=False)
    except Exception as e:
        print(f"mqtt Server error: {e}")
def main():
    # Create processes for each server
    rtu_process = multiprocessing.Process(target=run_rtu_server)
    tcp_process = multiprocessing.Process(target=run_tcp_server)
    profinet_server_process = multiprocessing.Process(target=run_profinet_server)
    http_server_process = multiprocessing.Process(target=run_http_server)
    opc_ua_server_process = multiprocessing.Process(target=run_opc_ua_server)
    mqtt_server_process = multiprocessing.Process(target=run_mqtt_server)

    try:
        # Start all servers
        rtu_process.start()
        tcp_process.start()
        profinet_server_process.start()
        http_server_process.start()
        opc_ua_server_process.start()
        mqtt_server_process.start()

        # Keep the main process alive
        while (rtu_process.is_alive() and tcp_process.is_alive() and profinet_server_process.is_alive() and http_server_process.is_alive() and opc_ua_server_process.is_alive() and mqtt_server_process.is_alive()):
            time.sleep(1)

    except KeyboardInterrupt:
        print("Stopping servers...")
    finally:
        # Terminate processes if they are still running
        rtu_process.terminate()
        tcp_process.terminate()
        profinet_server_process.terminate()
        http_server_process.terminate()
        # Wait for processes to actually stop
        rtu_process.join()
        tcp_process.join()
        profinet_server_process.join()
        http_server_process.join()
        opc_ua_server_process.join()
        mqtt_server_process.join()

if __name__ == "__main__":
    main()