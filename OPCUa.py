# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from asyncua import Client, Node
# from typing import List, Optional, Dict, Any
# import asyncio
# from fastapi.middleware.cors import CORSMiddleware
#
# app = FastAPI()
#
# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
#
# # Request model for OPC UA connection
# class OPCUAConnection(BaseModel):
#     url: str
#     port: str
#     anonymous: bool
#     username: Optional[str] = None
#     password: Optional[str] = None
#
#
# # Response model for node information
# class NodeInfo(BaseModel):
#     nodeId: str
#     browseName: str
#     nodeClass: str
#     children: List[Dict[str, Any]] = []
#
#
#
# # Global client variable
# client = None
#
#
# async def browse_node(node: Node) -> Dict[str, Any]:
#     """Recursively browse nodes and their children"""
#     try:
#         browse_name = (await node.read_browse_name()).Name
#         node_class = (await node.read_node_class()).name
#         node_id = node.nodeid.to_string()
#
#         children = []
#         for child in await node.get_children():
#             child_info = await browse_node(child)
#             children.append(child_info)
#
#         return {
#             "nodeId": node_id,
#             "browseName": browse_name,
#             "nodeClass": node_class,
#             "children": children,
#
#         }
#     except Exception as e:
#         print(f"Error browsing node: {str(e)}")
#         return {
#             "nodeId": "error",
#             "browseName": str(e),
#             "nodeClass": "error",
#             "children": []
#         }
#
#
# @app.post("/connect")
# async def connect_to_opcua(connection: OPCUAConnection):
#     global client
#
#     try:
#         # Check if the URL already contains the port
#         if ':' in connection.url.split('/')[-1]:
#             full_url = connection.url
#         else:
#             # Construct the complete URL with port
#             full_url = f"{connection.url}:{connection.port}"
#
#         print(f"Attempting to connect to: {full_url}")  # Debug print
#
#         # Create new client instance
#         client = Client(full_url)
#
#         # Set up authentication
#         if not connection.anonymous:
#             if not connection.username or not connection.password:
#                 raise HTTPException(status_code=400, detail="Username and password required when anonymous is false")
#             client.set_user(connection.username)
#             client.set_password(connection.password)
#
#         # Connect to the server
#         await client.connect()
#
#         # Get the root node and browse its children
#         root = client.get_root_node()
#         node_hierarchy = await browse_node(root)
#
#         return {
#             "status": "Connected",
#             "message": "Successfully connected to OPC UA server",
#             "nodeHierarchy": node_hierarchy
#         }
#
#     except Exception as e:
#         if client:
#             await client.disconnect()
#         raise HTTPException(status_code=500, detail=f"Failed to connect: {str(e)}")
#
#
# @app.post("/disconnect")
# async def disconnect_from_opcua():
#     global client
#     try:
#         if client:
#             await client.disconnect()
#             client = None
#             return {"status": "Disconnected", "message": "Successfully disconnected from OPC UA server"}
#         return {"status": "Not Connected", "message": "No active connection to disconnect"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to disconnect: {str(e)}")
#
#
# @app.get("/browse/{node_id}")
# async def browse_specific_node(node_id: str):
#     global client
#     try:
#         if not client:
#             raise HTTPException(status_code=400, detail="Not connected to any OPC UA server")
#
#         node = client.get_node(node_id)
#         node_info = await browse_node(node)
#         return node_info
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to browse node: {str(e)}")
#
#
# # Error handler for generic exceptions
# @app.exception_handler(Exception)
# async def generic_exception_handler(request, exc):
#     return {
#         "status": "error",
#         "message": str(exc)
#     }
#
# if __name__ == "__main__":
#     import uvicorn
#
#     uvicorn.run(app, host="localhost", port=8003)

# ''''''''''''''''''below is the working code  ''''''''''''''''''''
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from asyncua import Client, Node
# from typing import List, Optional, Dict, Any
# import asyncio
# from fastapi.middleware.cors import CORSMiddleware
#
# app = FastAPI()
#
# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
#
# # Request model for OPC UA connection
# class OPCUAConnection(BaseModel):
#     url: str
#     port: str
#     anonymous: bool
#     username: Optional[str] = None
#     password: Optional[str] = None
#
#
# # Response model for node information
# class NodeInfo(BaseModel):
#     nodeId: str
#     browseName: str
#     nodeClass: str
#     nodeValue: Optional[Any] = None
#     children: List[Dict[str, Any]] = []
#
#
#
# # Global client variable
# client = None
#
#
# async def browse_node(node: Node, node_value=None) -> Dict[str, Any]:
#     """Recursively browse nodes and their children"""
#     try:
#         browse_name = (await node.read_browse_name()).Name
#         node_class = (await node.read_node_class()).name
#         node_id = node.nodeid.to_string()
#
#         children = []
#         for child in await node.get_children():
#             child_info = await browse_node(child)
#             children.append(child_info)
#
#         return {
#             "nodeId": node_id,
#             "browseName": browse_name,
#             "nodeClass": node_class,
#             "nodeValue": node_value,
#             "children": children,
#
#         }
#     except Exception as e:
#         print(f"Error browsing node: {str(e)}")
#         return {
#             "nodeId": "error",
#             "browseName": str(e),
#             "nodeClass": "error",
#             "nodeValue": None,
#             "children": []
#         }
#
#
# @app.post("/connect")
# async def connect_to_opcua(connection: OPCUAConnection):
#     global client
#
#     try:
#         # Check if the URL already contains the port
#         if ':' in connection.url.split('/')[-1]:
#             full_url = connection.url
#         else:
#             # Construct the complete URL with port
#             full_url = f"{connection.url}:{connection.port}"
#
#         print(f"Attempting to connect to: {full_url}")  # Debug print
#
#         # Create new client instance
#         client = Client(full_url)
#
#         # Set up authentication
#         if not connection.anonymous:
#             if not connection.username or not connection.password:
#                 raise HTTPException(status_code=400, detail="Username and password required when anonymous is false")
#             client.set_user(connection.username)
#             client.set_password(connection.password)
#
#         # Connect to the server
#         await client.connect()
#
#         # Get the root node and browse its children
#         root = client.get_root_node()
#         node_hierarchy = await browse_node(root)
#
#         return {
#             "status": "Connected",
#             "message": "Successfully connected to OPC UA server",
#             "nodeHierarchy": node_hierarchy
#         }
#
#     except Exception as e:
#         if client:
#             await client.disconnect()
#         raise HTTPException(status_code=500, detail=f"Failed to connect: {str(e)}")
#
#
# @app.post("/disconnect")
# async def disconnect_from_opcua():
#     global client
#     try:
#         if client:
#             await client.disconnect()
#             client = None
#             return {"status": "Disconnected", "message": "Successfully disconnected from OPC UA server"}
#         return {"status": "Not Connected", "message": "No active connection to disconnect"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to disconnect: {str(e)}")
#
#
# @app.get("/browse/{node_id}")
# async def browse_specific_node(node_id: str):
#     global client
#     try:
#         if not client:
#             raise HTTPException(status_code=400, detail="Not connected to any OPC UA server")
#
#         node = client.get_node(node_id)
#         node_info = await browse_node(node)
#         return node_info
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to browse node: {str(e)}")
#
#
# # Error handler for generic exceptions
# @app.exception_handler(Exception)
# async def generic_exception_handler(request, exc):
#     return {
#         "status": "error",
#         "message": str(exc)
#     }
#
# if __name__ == "__main__":
#     import uvicorn
#
#     uvicorn.run(app, host="localhost", port=8003)



# '''''''''''''''''''''''''new code'''''''''''''''''''//
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from asyncua import Client, Node
# from typing import List, Optional, Dict, Any
# import asyncio
# from fastapi.middleware.cors import CORSMiddleware
#
# app = FastAPI()
#
# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
#
# # Request model for OPC UA connection
# class OPCUAConnection(BaseModel):
#     url: str
#     port: str
#     anonymous: bool
#     username: Optional[str] = None
#     password: Optional[str] = None
#
#
# # Request model for node details fetching
# class NodeDetailsRequest(BaseModel):
#     nodeId: str
#     namespace: Optional[int] = None
#     server: Optional[str] = None
#     read_value: bool = True
#     read_attributes: bool = True
#
#
# # Comprehensive response model for node information
# class NodeInfo(BaseModel):
#     nodeId: str
#     browseName: str
#     nodeClass: str
#     nodeValue: Optional[Any] = None
#     nodeAttributes: Dict[str, Any] = {}
#     children: List[Dict[str, Any]] = []
#     dataType: Optional[str] = None
#     description: Optional[str] = None
#
#
# # Global client variable
# client = None
#
#
# async def fetch_node_details(node: Node) -> Dict[str, Any]:
#     """Fetch comprehensive details for a given node"""
#     try:
#         # Read basic node properties
#         browse_name = (await node.read_browse_name()).Name
#         node_class = (await node.read_node_class()).name
#         node_id = node.nodeid.to_string()
#
#         # Initialize details dictionary
#         node_details = {
#             "nodeId": node_id,
#             "browseName": browse_name,
#             "nodeClass": node_class,
#             "nodeAttributes": {},
#             "nodeValue": None,
#             "dataType": None,
#             "description": None
#         }
#
#         # Try to read node value
#         try:
#             node_value = await node.read_value()
#             node_details["nodeValue"] = node_value
#         except Exception as value_error:
#             node_details["nodeValue"] = f"Could not read value: {str(value_error)}"
#
#         # Read additional node attributes
#         try:
#             description = await node.read_description()
#             node_details["description"] = description.Text if description else None
#         except Exception:
#             node_details["description"] = None
#
#         # Read data type if applicable
#         try:
#             data_type_node = await node.read_data_type()
#             node_details["dataType"] = data_type_node.to_string()
#         except Exception:
#             node_details["dataType"] = None
#
#         # Read additional attributes
#         additional_attributes = [
#             'AccessLevel', 'UserAccessLevel', 'MinimumSamplingInterval',
#             'Historizing', 'EventNotifier'
#         ]
#
#         for attr in additional_attributes:
#             try:
#                 attr_value = await node.read_attribute(getattr(ua.AttributeIds, attr))
#                 node_details["nodeAttributes"][attr] = str(attr_value.Value.Value)
#             except Exception:
#                 pass
#
#         # Recursively browse children
#         children = []
#         try:
#             for child in await node.get_children():
#                 child_info = await fetch_node_details(child)
#                 children.append(child_info)
#             node_details["children"] = children
#         except Exception as child_error:
#             node_details["children"] = []
#             print(f"Error fetching children: {str(child_error)}")
#
#         return node_details
#
#     except Exception as e:
#         print(f"Error in fetch_node_details: {str(e)}")
#         return {
#             "nodeId": "error",
#             "browseName": str(e),
#             "nodeClass": "error",
#             "nodeValue": None,
#             "nodeAttributes": {},
#             "children": []
#         }
#
#
# @app.post("/connect")
# async def connect_to_opcua(connection: OPCUAConnection):
#     global client
#
#     try:
#         # Check if the URL already contains the port
#         if ':' in connection.url.split('/')[-1]:
#             full_url = connection.url
#         else:
#             # Construct the complete URL with port
#             full_url = f"{connection.url}:{connection.port}"
#
#         print(f"Attempting to connect to: {full_url}")  # Debug print
#
#         # Create new client instance
#         client = Client(full_url)
#
#         # Set up authentication
#         if not connection.anonymous:
#             if not connection.username or not connection.password:
#                 raise HTTPException(status_code=400, detail="Username and password required when anonymous is false")
#             client.set_user(connection.username)
#             client.set_password(connection.password)
#
#         # Connect to the server
#         await client.connect()
#
#         # Get the root node and browse its children
#         root = client.get_root_node()
#         node_hierarchy = await fetch_node_details(root)
#
#         return {
#             "status": "Connected",
#             "message": "Successfully connected to OPC UA server",
#             "nodeHierarchy": node_hierarchy
#         }
#
#     except Exception as e:
#         if client:
#             await client.disconnect()
#         raise HTTPException(status_code=500, detail=f"Failed to connect: {str(e)}")
#
#
# @app.post("/disconnect")
# async def disconnect_from_opcua():
#     global client
#     try:
#         if client:
#             await client.disconnect()
#             client = None
#             return {"status": "Disconnected", "message": "Successfully disconnected from OPC UA server"}
#         return {"status": "Not Connected", "message": "No active connection to disconnect"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to disconnect: {str(e)}")
#
#
# @app.post("/node-details")
# async def get_node_details(request: NodeDetailsRequest):
#     global client
#     try:
#         if not client:
#             raise HTTPException(status_code=400, detail="Not connected to any OPC UA server")
#
#         # Construct node identifier based on provided parameters
#         if request.namespace is not None:
#             # If namespace is provided, construct node ID with namespace
#             node_id = f"ns={request.namespace};{request.nodeId}"
#         else:
#             node_id = request.nodeId
#
#         # If server is specified, prepend server information
#         if request.server:
#             node_id = f"s={request.server};{node_id}"
#
#         # Get the node
#         node = client.get_node(node_id)
#
#         # Fetch comprehensive node details
#         node_info = await fetch_node_details(node)
#
#         return node_info
#
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to fetch node details: {str(e)}")
#
#
# @app.get("/browse/{node_id}")
# async def browse_specific_node(node_id: str):
#     global client
#     try:
#         if not client:
#             raise HTTPException(status_code=400, detail="Not connected to any OPC UA server")
#
#         node = client.get_node(node_id)
#         node_info = await fetch_node_details(node)
#         return node_info
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to browse node: {str(e)}")
#
#
# # Error handler for generic exceptions
# @app.exception_handler(Exception)
# async def generic_exception_handler(request, exc):
#     return {
#         "status": "error",
#         "message": str(exc)
#     }
#
#
# if __name__ == "__main__":
#     import uvicorn
#     import asyncua.ua as ua
#
#     uvicorn.run(app, host="localhost", port=8003)



# '''''''''''''''''''''''''
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from asyncua import Client, Node, ua
# from typing import List, Optional, Dict, Any
# import asyncio
# from fastapi.middleware.cors import CORSMiddleware
#
# # Initialize FastAPI app
# app = FastAPI()
#
# # Add CORS middleware to allow cross-origin requests
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
#
# # Request model for OPC UA connection parameters
# class OPCUAConnection(BaseModel):
#     url: str
#     port: str
#     anonymous: bool
#     username: Optional[str] = None
#     password: Optional[str] = None
#
#
# # Response model for node information
# class NodeInfo(BaseModel):
#     nodeId: str
#     browseName: str
#     nodeClass: str
#     nodeValue: Optional[Any] = None
#     children: List[Dict[str, Any]] = []
#
#
# # Global client variable to maintain connection state
# client = None
#
#
# async def browse_node(node: Node) -> Dict[str, Any]:
#     """
#     Recursively browse nodes and their children.
#     Returns complete information about each node including values and child nodes.
#     """
#     try:
#         # Read basic node information
#         browse_name = (await node.read_browse_name()).Name
#         node_class = (await node.read_node_class()).name
#         node_id = node.nodeid.to_string()
#
#         # Attempt to read the node's value
#         try:
#             node_value = await node.read_value()
#             # Handle variant arrays and special data types
#             if isinstance(node_value, ua.Variant):
#                 node_value = node_value.Value
#         except Exception as value_error:
#             print(f"Warning: Could not read value for node {node_id}: {str(value_error)}")
#             node_value = None
#
#         # Recursively get all children
#         children = []
#         try:
#             for child in await node.get_children():
#                 child_info = await browse_node(child)
#                 children.append(child_info)
#         except Exception as child_error:
#             print(f"Warning: Error getting children for node {node_id}: {str(child_error)}")
#
#         # Return complete node information
#         return {
#             "nodeId": node_id,
#             "browseName": browse_name,
#             "nodeClass": node_class,
#             "nodeValue": node_value,
#             "children": children,
#         }
#
#     except Exception as e:
#         print(f"Error browsing node: {str(e)}")
#         return {
#             "nodeId": "error",
#             "browseName": str(e),
#             "nodeClass": "error",
#             "nodeValue": None,
#             "children": []
#         }
#
#
# def parse_node_id(node_id_str: str) -> ua.NodeId:
#     """
#     Parse node ID string into NodeId object.
#     Handles all formats:
#     - Pure numeric (e.g., "1234")
#     - i=X format (e.g., "i=2315")
#     - s=X format (e.g., "s=MyVariable")
#     - ns=X;s=Y format (e.g., "ns=1;s=Session_3622924953.SessionDiagnostics.QueryNextCount")
#     - ns=X;i=Y format (e.g., "ns=2;i=1234")
#     """
#     try:
#         # Case 1: Pure numeric ID (default namespace 0)
#         if node_id_str.isdigit():
#             return ua.NodeId(int(node_id_str))
#
#         # Case 2: i=X format
#         if node_id_str.startswith("i="):
#             return ua.NodeId(int(node_id_str[2:]))
#
#         # Case 3: s=X format
#         if node_id_str.startswith("s="):
#             return ua.NodeId(node_id_str[2:], 0)
#
#         # Case 4: Namespace format (ns=X;...)
#         if node_id_str.startswith("ns="):
#             parts = node_id_str.split(";")
#             if len(parts) != 2:
#                 raise ValueError("Invalid namespace format")
#
#             namespace = int(parts[0].split("=")[1])
#             identifier_part = parts[1]
#
#             # Handle string identifiers (including Session_* paths)
#             if identifier_part.startswith("s="):
#                 full_string = identifier_part[2:]
#                 return ua.NodeId(full_string, namespace)
#
#             # Handle numeric identifiers in namespace
#             elif identifier_part.startswith("i="):
#                 return ua.NodeId(int(identifier_part[2:]), namespace)
#
#         # Default case: treat as string identifier
#         return ua.NodeId(node_id_str)
#
#     except Exception as e:
#         raise ValueError(f"Invalid node ID format '{node_id_str}': {str(e)}")
#
#
# @app.post("/connect")
# async def connect_to_opcua(connection: OPCUAConnection):
#     """
#     Connect to OPC UA server and return complete node hierarchy.
#     """
#     global client
#
#     try:
#         # Construct complete URL
#         if ':' in connection.url.split('/')[-1]:
#             full_url = connection.url
#         else:
#             full_url = f"{connection.url}:{connection.port}"
#
#         print(f"Attempting to connect to: {full_url}")
#
#         # Create new client instance
#         client = Client(full_url)
#
#         # Configure authentication
#         if not connection.anonymous:
#             if not connection.username or not connection.password:
#                 raise HTTPException(
#                     status_code=400,
#                     detail="Username and password required when anonymous is false"
#                 )
#             client.set_user(connection.username)
#             client.set_password(connection.password)
#
#         # Connect to server
#         await client.connect()
#
#         # Get and browse root node
#         root = client.get_root_node()
#         node_hierarchy = await browse_node(root)
#
#         return {
#             "status": "Connected",
#             "message": "Successfully connected to OPC UA server",
#             "nodeHierarchy": node_hierarchy
#         }
#
#     except Exception as e:
#         # Ensure client is disconnected on error
#         if client:
#             await client.disconnect()
#         raise HTTPException(status_code=500, detail=f"Failed to connect: {str(e)}")
#
#
# @app.post("/disconnect")
# async def disconnect_from_opcua():
#     """
#     Disconnect from OPC UA server.
#     """
#     global client
#     try:
#         if client:
#             await client.disconnect()
#             client = None
#             return {
#                 "status": "Disconnected",
#                 "message": "Successfully disconnected from OPC UA server"
#             }
#         return {
#             "status": "Not Connected",
#             "message": "No active connection to disconnect"
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to disconnect: {str(e)}")
#
#
# @app.get("/browse/{node_id}")
# async def browse_specific_node(node_id: str):
#     """
#     Browse a specific node and return its complete information.
#     Supports all node ID formats including session diagnostics nodes.
#     """
#     global client
#     try:
#         if not client:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Not connected to any OPC UA server"
#             )
#
#         # Parse node ID and get node
#         node_id_obj = parse_node_id(node_id)
#         node = client.get_node(node_id_obj)
#
#         # Get complete node information
#         node_info = await browse_node(node)
#         return node_info
#
#     except ValueError as ve:
#         raise HTTPException(status_code=400, detail=str(ve))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to browse node: {str(e)}")
#
#
# # Generic error handler
# @app.exception_handler(Exception)
# async def generic_exception_handler(request, exc):
#     return {
#         "status": "error",
#         "message": str(exc)
#     }
#
#
# # Run the server if executed directly
# if __name__ == "__main__":
#     import uvicorn
#
#     uvicorn.run(app, host="localhost", port=8003)




# browsing only particular nodes using different node identifier''''''''''''''''

# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from asyncua import Client, Node, ua
# from typing import List, Optional, Dict, Any
# import asyncio
# from fastapi.middleware.cors import CORSMiddleware
#
# # Initialize FastAPI app
# app = FastAPI()
#
# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

#
# # Request models
# class OPCUAConnection(BaseModel):
#     url: str
#     port: str
#     anonymous: bool
#     username: Optional[str] = None
#     password: Optional[str] = None
#
#
# class NodeInfo(BaseModel):
#     nodeId: str
#     browseName: str
#     nodeClass: str
#     nodeValue: Optional[Any] = None
#     children: List[Dict[str, Any]] = []
#
#
# # Global client variable
# client = None
#
#
# async def browse_node(node: Node) -> Dict[str, Any]:
#     """
#     Get detailed information about a specific node and its immediate children.
#     """
#     try:
#         # Read basic node information
#         browse_name = (await node.read_browse_name()).Name
#         node_class = (await node.read_node_class()).name
#         node_id = node.nodeid.to_string()
#
#         # Read node value
#         try:
#             node_value = await node.read_value()
#             if isinstance(node_value, ua.Variant):
#                 node_value = node_value.Value
#         except Exception as value_error:
#             print(f"Warning: Could not read value for node {node_id}: {str(value_error)}")
#             node_value = None
#
#         # Get immediate children information
#         children = []
#         try:
#             for child in await node.get_children():
#                 child_browse_name = (await child.read_browse_name()).Name
#                 child_node_id = child.nodeid.to_string()
#                 child_node_class = (await child.read_node_class()).name
#
#                 children.append({
#                     "nodeId": child_node_id,
#                     "browseName": child_browse_name,
#                     "nodeClass": child_node_class
#                 })
#         except Exception as child_error:
#             print(f"Warning: Error getting children for node {node_id}: {str(child_error)}")
#
#         return {
#             "nodeId": node_id,
#             "browseName": browse_name,
#             "nodeClass": node_class,
#             "nodeValue": node_value,
#             "children": children
#         }
#
#     except Exception as e:
#         print(f"Error browsing node: {str(e)}")
#         return {
#             "nodeId": "error",
#             "browseName": str(e),
#             "nodeClass": "error",
#             "nodeValue": None,
#             "children": []
#         }
#
#
# def parse_node_id(node_id_str: str) -> ua.NodeId:
#     """
#     Parse various node ID formats into NodeId object.
#     """
#     try:
#         # Pure numeric ID (default namespace 0)
#         if node_id_str.isdigit():
#             return ua.NodeId(int(node_id_str))
#
#         # i=X format
#         if node_id_str.startswith("i="):
#             return ua.NodeId(int(node_id_str[2:]))
#
#         # s=X format
#         if node_id_str.startswith("s="):
#             return ua.NodeId(node_id_str[2:], 0)
#
#         # Namespace format (ns=X;...)
#         if node_id_str.startswith("ns="):
#             parts = node_id_str.split(";")
#             if len(parts) != 2:
#                 raise ValueError("Invalid namespace format")
#
#             namespace = int(parts[0].split("=")[1])
#             identifier_part = parts[1]
#
#             if identifier_part.startswith("s="):
#                 return ua.NodeId(identifier_part[2:], namespace)
#             elif identifier_part.startswith("i="):
#                 return ua.NodeId(int(identifier_part[2:]), namespace)
#
#         # Default: treat as string identifier
#         return ua.NodeId(node_id_str)
#
#     except Exception as e:
#         raise ValueError(f"Invalid node ID format '{node_id_str}': {str(e)}")
#
#
# @app.post("/connect")
# async def connect_to_opcua(connection: OPCUAConnection):
#     """
#     Connect to OPC UA server without returning complete hierarchy.
#     """
#     global client
#
#     try:
#         # Construct URL
#         full_url = f"{connection.url}:{connection.port}" if ':' not in connection.url.split('/')[-1] else connection.url
#         print(f"Attempting to connect to: {full_url}")
#
#         # Create client
#         client = Client(full_url)
#
#         # Set authentication
#         if not connection.anonymous:
#             if not connection.username or not connection.password:
#                 raise HTTPException(
#                     status_code=400,
#                     detail="Username and password required when anonymous is false"
#                 )
#             client.set_user(connection.username)
#             client.set_password(connection.password)
#
#         # Connect
#         await client.connect()
#
#         return {
#             "status": "Connected",
#             "message": "Successfully connected to OPC UA server"
#         }
#
#     except Exception as e:
#         if client:
#             await client.disconnect()
#         raise HTTPException(status_code=500, detail=f"Failed to connect: {str(e)}")
#
#
# @app.post("/disconnect")
# async def disconnect_from_opcua():
#     """
#     Disconnect from OPC UA server.
#     """
#     global client
#     try:
#         if client:
#             await client.disconnect()
#             client = None
#             return {
#                 "status": "Disconnected",
#                 "message": "Successfully disconnected from OPC UA server"
#             }
#         return {
#             "status": "Not Connected",
#             "message": "No active connection to disconnect"
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to disconnect: {str(e)}")
#
#
# @app.get("/browse/{node_id}")
# async def browse_specific_node(node_id: str):
#     """
#     Browse a specific node by its ID and return detailed information.
#     """
#     global client
#     try:
#         if not client:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Not connected to any OPC UA server"
#             )
#
#         node_id_obj = parse_node_id(node_id)
#         node = client.get_node(node_id_obj)
#         node_info = await browse_node(node)
#         return node_info
#
#     except ValueError as ve:
#         raise HTTPException(status_code=400, detail=str(ve))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to browse node: {str(e)}")
#
#
# # Generic error handler
# @app.exception_handler(Exception)
# async def generic_exception_handler(request, exc):
#     return {
#         "status": "error",
#         "message": str(exc)
#     }
#
#
# if __name__ == "__main__":
#     import uvicorn
#
#     uvicorn.run(app, host="localhost", port=8004)

# this below code is using fastapi endpoints
# from fastapi import FastAPI, HTTPException, Body
# from pydantic import BaseModel
# from opcua import Client, ua
# import uvicorn
#
# from fastapi.middleware.cors import CORSMiddleware
#
# # Initialize FastAPI app
# app = FastAPI()
#
# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
#
# # Store the connection client globally
# connected_client = None
# global_connection_params = None  # Renamed global variable to avoid conflict
#
#
# class ConnectionParams(BaseModel):
#     url: str
#     username: str
#     password: str
#
#
# class NodeRequest(BaseModel):
#     node_id: str
#
#
# def read_parameter_value(client, node_id):
#     try:
#         # Read the value of the parameter node
#         parameter_node = client.get_node(node_id)
#         parameter_value = parameter_node.get_value()
#         return parameter_value
#     except Exception as e:
#         print("Error reading parameter value:", e)
#         return None
#
#
# def get_node_description(client, node_id):
#     try:
#         # Get node's description (e.g., display name)
#         node = client.get_node(node_id)
#         description = node.get_display_name().Text
#         return description
#     except Exception as e:
#         print("Error getting node description:", e)
#         return None
#
#
# def check_if_folder(client, node_id):
#     try:
#         # Check if the node is a folder or a parameter
#         node = client.get_node(node_id)
#         # In OPC UA, Folders are often instances of the FolderType or similar types
#         if node.get_node_class() == ua.NodeClass.Object:
#             # Here you can check more specific types like FolderType if needed
#             return True
#         return False
#     except Exception as e:
#         print("Error checking if node is a folder:", e)
#         return False
#
#
# @app.post("/connect/")
# async def connect_to_server(connection_params: ConnectionParams):
#     global connected_client, global_connection_params  # Use the renamed global variable
#     try:
#         # Only connect if we haven't connected yet
#         if connected_client is None:
#             # Create a new client instance
#             connected_client = Client(connection_params.url)
#             connected_client.set_user(connection_params.username)
#             connected_client.set_password(connection_params.password)
#
#             # Connect to the server
#             connected_client.connect()
#
#             # Store the connection parameters for future use
#             global_connection_params = connection_params  # Store it in the global variable
#
#             return {"status": "connected", "message": f"Successfully connected to {connection_params.url}"}
#         else:
#             return {"status": "already_connected", "message": "Already connected to the server."}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Error connecting to server: {str(e)}")
#
#
# @app.post("/read-node/")
# async def read_node_value(node_request: NodeRequest):
#     global connected_client
#     try:
#         # Ensure the client is connected
#         if connected_client is None:
#             raise HTTPException(status_code=400, detail="Not connected to the server yet. Please connect first.")
#
#         # Check if the node is a folder
#         if check_if_folder(connected_client, node_request.node_id):
#             # If it's a folder, get its description
#             description = get_node_description(connected_client, node_request.node_id)
#             return {"node_id": node_request.node_id, "description": description, "type": "folder"}
#         else:
#             # If it's a parameter, fetch its value
#             node_value = read_parameter_value(connected_client, node_request.node_id)
#             if node_value is not None:
#                 return {"node_id": node_request.node_id, "value": node_value, "type": "parameter"}
#             else:
#                 raise HTTPException(status_code=400, detail="Error reading node value.")
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Error reading node: {str(e)}")
#
#
# if __name__ == "__main__":
#     uvicorn.run(app, host="localhost", port=8004)


#
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from opcua import Client, ua
# import uvicorn
# import json
# import asyncio
#
# # Initialize FastAPI app
# app = FastAPI()
#
# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
# # Store the connection client globally
# connected_client = None
# global_connection_params = None
#
#
# class ConnectionParams(BaseModel):
#     url: str
#     username: str
#     password: str
#
#
# class NodeRequest(BaseModel):
#     node_id: str
#
#
# def read_parameter_value(client, node_id):
#     try:
#         # Read the value of the parameter node
#         parameter_node = client.get_node(node_id)
#         parameter_value = parameter_node.get_value()
#         return parameter_value
#     except Exception as e:
#         print("Error reading parameter value:", e)
#         return None
#
#
# def get_node_description(client, node_id):
#     try:
#         # Get node's description (e.g., display name)
#         node = client.get_node(node_id)
#         description = node.get_display_name().Text
#         return description
#     except Exception as e:
#         print("Error getting node description:", e)
#         return None
#
#
# def check_if_folder(client, node_id):
#     try:
#         # Check if the node is a folder or a parameter
#         node = client.get_node(node_id)
#         # In OPC UA, Folders are often instances of the FolderType or similar types
#         if node.get_node_class() == ua.NodeClass.Object:
#             # Here you can check more specific types like FolderType if needed
#             return True
#         return False
#     except Exception as e:
#         print("Error checking if node is a folder:", e)
#         return False
#
#
# async def connect_to_opc_server(connection_params):
#     global connected_client, global_connection_params
#     try:
#         # Only connect if we haven't connected yet
#         if connected_client is None:
#             # Create a new client instance
#             connected_client = Client(connection_params['url'])
#             connected_client.set_user(connection_params['username'])
#             connected_client.set_password(connection_params['password'])
#
#             # Connect to the server
#             connected_client.connect()
#
#             # Store the connection parameters for future use
#             global_connection_params = connection_params
#
#             return {"status": "connected", "message": f"Successfully connected to {connection_params['url']}"}
#         else:
#             return {"status": "already_connected", "message": "Already connected to the server."}
#     except Exception as e:
#         return {"status": "error", "message": f"Error connecting to server: {str(e)}"}
#
#
# async def read_opc_node(node_id):
#     global connected_client
#     try:
#         # Ensure the client is connected
#         if connected_client is None:
#             return {"status": "error", "message": "Not connected to the server yet. Please connect first."}
#
#         # Check if the node is a folder
#         if check_if_folder(connected_client, node_id):
#             # If it's a folder, get its description
#             description = get_node_description(connected_client, node_id)
#             return {"node_id": node_id, "description": description, "type": "folder", "status": "success"}
#         else:
#             # If it's a parameter, fetch its value
#             node_value = read_parameter_value(connected_client, node_id)
#             if node_value is not None:
#                 return {"node_id": node_id, "value": node_value, "type": "parameter", "status": "success"}
#             else:
#                 return {"status": "error", "message": "Error reading node value."}
#     except Exception as e:
#         return {"status": "error", "message": f"Error reading node: {str(e)}"}
#
#
# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     try:
#         while True:
#             # Receive message from client
#             data = await websocket.receive_text()
#             message = json.loads(data)
#
#             # Handle different types of WebSocket requests
#             if message['type'] == 'connect':
#                 # Extract connection parameters
#                 connection_result = await connect_to_opc_server({
#                     'url': message['url'],
#                     'username': message['username'],
#                     'password': message['password']
#                 })
#                 await websocket.send_text(json.dumps(connection_result))
#
#             elif message['type'] == 'read_node':
#                 # Read node value
#                 node_result = await read_opc_node(message['node_id'])
#                 await websocket.send_text(json.dumps(node_result))
#
#             else:
#                 # Invalid message type
#                 await websocket.send_text(json.dumps({
#                     'status': 'error',
#                     'message': 'Invalid message type'
#                 }))
#
#     except WebSocketDisconnect:
#         print("WebSocket connection closed")
#     except Exception as e:
#         print(f"Error in WebSocket: {e}")
#         await websocket.close()
#
#
# if __name__ == "__main__":
#     uvicorn.run(app, host="localhost", port=8004)


# '''''''''''''below code is using websocket '''''''''''''''''''''

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from opcua import Client, ua
import uvicorn
import json
import asyncio

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
        # Read the value of the parameter node
        parameter_node = client.get_node(node_id)
        parameter_value = parameter_node.get_value()
        return parameter_value
    except Exception as e:
        print("Error reading parameter value:", e)
        return None


def get_node_description(client, node_id):
    try:
        # Get node's description (e.g., display name)
        node = client.get_node(node_id)
        description = node.get_display_name().Text
        return description
    except Exception as e:
        print("Error getting node description:", e)
        return None


def check_if_folder(client, node_id):
    try:
        # Check if the node is a folder or a parameter
        node = client.get_node(node_id)
        # In OPC UA, Folders are often instances of the FolderType or similar types
        if node.get_node_class() == ua.NodeClass.Object:
            # Here you can check more specific types like FolderType if needed
            return True
        return False
    except Exception as e:
        print("Error checking if node is a folder:", e)
        return False


async def connect_to_opc_server(connection_params):
    global connected_client, global_connection_params
    try:
        # Only connect if we haven't connected yet
        if connected_client is None:
            # Create a new client instance
            connected_client = Client(connection_params['url'])
            connected_client.set_user(connection_params['username'])
            connected_client.set_password(connection_params['password'])

            # Connect to the server
            connected_client.connect()

            # Store the connection parameters for future use
            global_connection_params = connection_params

            return {"status": "connected", "message": f"Successfully connected to {connection_params['url']}"}
        else:
            return {"status": "already_connected", "message": "Already connected to the server."}
    except Exception as e:
        return {"status": "error", "message": f"Error connecting to server: {str(e)}"}


async def read_opc_node(node_id):
    global connected_client
    try:
        # Ensure the client is connected
        if connected_client is None:
            return {"status": "error", "message": "Not connected to the server yet. Please connect first."}

        # Check if the node is a folder
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
    except Exception as e:
        return {"status": "error", "message": f"Error reading node: {str(e)}"}


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
                    'username': message['username'],
                    'password': message['password']
                })
                await websocket.send_text(json.dumps(connection_result))

            elif message['type'] == 'read_node':
                # Read node value
                node_result = await read_opc_node(message['node_id'])
                await websocket.send_text(json.dumps(node_result))

            else:
                # Invalid message type
                await websocket.send_text(json.dumps({
                    'status': 'error',
                    'message': 'Invalid message type'
                }))

    except WebSocketDisconnect:
        print("WebSocket connection closed")
    except Exception as e:
        print(f"Error in WebSocket: {e}")
        await websocket.close()


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8004)