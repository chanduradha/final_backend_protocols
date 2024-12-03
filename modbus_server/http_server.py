
import asyncio
import json
import httpx
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Optional

app = FastAPI()


class ServerRequest(BaseModel):
    url: str
    method: str
    data: Optional[dict] = None


async def send_get_request(url: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            return response.json() if response.headers.get("Content-Type") == "application/json" else response.text
        except Exception as exc:
            return {"error": str(exc)}


async def send_post_request(url: str, data: dict):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=data)
            response.raise_for_status()
            return response.json() if response.headers.get("Content-Type") == "application/json" else response.text
        except Exception as exc:
            return {"error": str(exc)}


async def send_put_request(url: str, data: dict):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.put(url, json=data)
            response.raise_for_status()
            return response.json() if response.headers.get("Content-Type") == "application/json" else response.text
        except Exception as exc:
            return {"error": str(exc)}


async def send_delete_request(url: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.delete(url)
            response.raise_for_status()
            return response.json() if response.headers.get("Content-Type") == "application/json" else response.text
        except Exception as exc:
            return {"error": str(exc)}


@app.websocket("/ws/perform-network-operation")
async def websocket_network_operation(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive the operation request via WebSocket
            request_text = await websocket.receive_text()
            request_data = json.loads(request_text)

            # Extract required fields
            url = request_data.get('url')
            method = request_data.get('method', '').upper()
            data = request_data.get('data')

            # Validate request
            if not url or not method:
                await websocket.send_json({
                    "error": "Invalid request. URL and method are required.",
                    "status": "error"
                })
                continue

            # Perform the appropriate HTTP request based on method
            try:
                if method == "GET":
                    result = await send_get_request(url)
                    await websocket.send_json({
                        "status_code": "successfully retrieved",
                        "data": result
                    })
                elif method == "POST":
                    if not data:
                        await websocket.send_json({
                            "error": "Data is required for POST request",
                            "status": "error"
                        })
                        continue
                    result = await send_post_request(url, data)
                    await websocket.send_json({
                        "status_code": "data is posted",
                        "data": result
                    })
                elif method == "PUT":
                    if not data:
                        await websocket.send_json({
                            "error": "Data is required for PUT request",
                            "status": "error"
                        })
                        continue
                    result = await send_put_request(url, data)
                    await websocket.send_json({
                        "status_code": "data is updated",
                        "data": result
                    })
                elif method == "DELETE":
                    result = await send_delete_request(url)
                    await websocket.send_json({
                        "status_code": "resource deleted",
                        "data": result
                    })
                else:
                    await websocket.send_json({
                        "error": f"Unsupported method: {method}",
                        "status": "error"
                    })
            except Exception as e:
                await websocket.send_json({
                    "error": str(e),
                    "status": "error"
                })

    except WebSocketDisconnect:
        print("WebSocket connection closed")


# To run the FastAPI app, use the command:
# uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8006)