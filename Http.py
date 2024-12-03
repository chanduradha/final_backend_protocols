# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import httpx
# from typing import Optional
#
# # FastAPI app instance
# app = FastAPI()
#
#
# # Pydantic model to handle user input
# class ServerRequest(BaseModel):
#     url: str  # The URL to connect to the target server
#     method: str  # The HTTP method (GET, POST, PUT, DELETE)
#     data: Optional[dict] = None  # Optional data for POST/PUT requests
#
#
# # Function to handle GET request
# async def send_get_request(url: str):
#     async with httpx.AsyncClient() as client:
#         try:
#             response = await client.get(url)
#             response.raise_for_status()  # Raise an error if the response is not successful
#             return response.json() if response.headers.get("Content-Type") == "application/json" else response.text
#         except httpx.RequestError as exc:
#             raise HTTPException(status_code=500, detail=f"Error connecting to server: {exc}")
#         except httpx.HTTPStatusError as exc:
#             raise HTTPException(status_code=exc.response.status_code,
#                                 detail=f"HTTP error occurred: {exc.response.text}")
#
#
# # Function to handle POST request
# async def send_post_request(url: str, data: dict):
#     async with httpx.AsyncClient() as client:
#         try:
#             response = await client.post(url, json=data)
#             response.raise_for_status()
#             return response.json() if response.headers.get("Content-Type") == "application/json" else response.text
#         except httpx.RequestError as exc:
#             raise HTTPException(status_code=500, detail=f"Error connecting to server: {exc}")
#         except httpx.HTTPStatusError as exc:
#             raise HTTPException(status_code=exc.response.status_code,
#                                 detail=f"HTTP error occurred: {exc.response.text}")
#
#
# # Function to handle PUT request
# async def send_put_request(url: str, data: dict):
#     async with httpx.AsyncClient() as client:
#         try:
#             response = await client.put(url, json=data)
#             response.raise_for_status()
#             return response.json() if response.headers.get("Content-Type") == "application/json" else response.text
#         except httpx.RequestError as exc:
#             raise HTTPException(status_code=500, detail=f"Error connecting to server: {exc}")
#         except httpx.HTTPStatusError as exc:
#             raise HTTPException(status_code=exc.response.status_code,
#                                 detail=f"HTTP error occurred: {exc.response.text}")
#
#
# # Function to handle DELETE request
# async def send_delete_request(url: str):
#     async with httpx.AsyncClient() as client:
#         try:
#             response = await client.delete(url)
#             response.raise_for_status()
#             return response.json() if response.headers.get("Content-Type") == "application/json" else response.text
#         except httpx.RequestError as exc:
#             raise HTTPException(status_code=500, detail=f"Error connecting to server: {exc}")
#         except httpx.HTTPStatusError as exc:
#             raise HTTPException(status_code=exc.response.status_code,
#                                 detail=f"HTTP error occurred: {exc.response.text}")
#
#
# # Main endpoint to handle user input for server URL, method, and data
# @app.post("/perform-operation/")
# async def perform_operation(request: ServerRequest):
#     """
#     Endpoint to connect to an HTTP server with user-specified URL, HTTP method, and optional data.
#     """
#     try:
#         # Handle based on the method specified
#         if request.method.upper() == "GET":
#             result = await send_get_request(request.url)
#             return {"status_code": " sucessfully retreived", "data": result}
#
#         elif request.method.upper() == "POST":
#             if not request.data:
#                 raise HTTPException(status_code=400, detail="Data is required for POST request.")
#             result = await send_post_request(request.url, request.data)
#             return {"status_code": "data is posted", "data": result}
#
#         elif request.method.upper() == "PUT":
#             if not request.data:
#                 raise HTTPException(status_code=400, detail="Data is required for PUT request.")
#             result = await send_put_request(request.url, request.data)
#             return {"status_code": "data is updated", "data": result}
#
#         elif request.method.upper() == "DELETE":
#             result = await send_delete_request(request.url)
#             return {"message": "Resource deleted", "data": result}
#
#         else:
#             raise HTTPException(status_code=400, detail="Invalid HTTP method provided.")
#
#     except HTTPException as exc:
#         raise exc
#     except Exception as exc:
#         raise HTTPException(status_code=500, detail=f"Unexpected error occurred: {str(exc)}")
#
#
# # To run the FastAPI app, use the command:
# # uvicorn main:app --reload
# if __name__ == "__main__":
#     import uvicorn
#
#     uvicorn.run(app, host="localhost", port=8006)

# ''''''''''''''''  below is the websocket code ''''''''''''''''''
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