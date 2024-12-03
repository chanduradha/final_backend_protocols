
//'''working code below  '''''//
// import React, { useState } from 'react';
// import axios from 'axios';
// import { X, CheckCircle2, XCircle } from 'lucide-react';

// const OPCUAServerModal = ({ isOpen, onClose }) => {
//   const [formData, setFormData] = useState({
//     endpointUrl: 'opc.tcp://172.18.28.35:4840',
//     serverPort: '4840',
//     enableAnonymous: true,
//     username: 'OpcUaClient',
//     password: '12345678'
//   });

//   const [connectionResult, setConnectionResult] = useState(null);
//   const [browseResult, setBrowseResult] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleConnect = async () => {
//     setIsLoading(true);
//     setError(null);
//     setConnectionResult(null);
//     setBrowseResult(null);

//     try {
//       // Connection request
//       const connectionResponse = await axios.post('http://localhost:8003/connect', {
//         url: formData.endpointUrl,
//         port: formData.serverPort,
//         anonymous: formData.enableAnonymous,
//         username: formData.username,
//         password: formData.password
//       }, {
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json'
//         }
//       });

//       setConnectionResult(connectionResponse.data);

//       // If connection is successful, browse root node
//       if (connectionResponse.data.status === 'Connected') {
//         const browseResponse = await axios.get(`http://localhost:8003/browse/i%3D87`);
//         setBrowseResult(browseResponse.data);
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || error.message || 'An unexpected error occurred');
//       setConnectionResult(null);
//       setBrowseResult(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
//           <h2 className="text-xl font-semibold text-indigo-950">OPC UA Server Configuration</h2>
//           <button
//             onClick={onClose}
//             className="p-1 hover:bg-indigo-100 rounded-full transition-colors"
//           >
//             <X className="text-gray-500" size={20} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6">
//           {/* Configuration Section */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium text-indigo-900">Server Configuration</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Endpoint URL
//                 </label>
//                 <input
//                   type="text"
//                   name="endpointUrl"
//                   value={formData.endpointUrl}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Server Port
//                 </label>
//                 <input
//                   type="text"
//                   name="serverPort"
//                   value={formData.serverPort}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>

//             {/* Authentication Settings */}
//             <div className="space-y-4">
//               <div className="flex items-center mb-4">
//                 <input
//                   type="checkbox"
//                   name="enableAnonymous"
//                   checked={formData.enableAnonymous}
//                   onChange={handleInputChange}
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label className="ml-2 block text-sm text-gray-700">
//                   Enable Anonymous Access
//                 </label>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Username
//                   </label>
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleInputChange}
//                     disabled={formData.enableAnonymous}
//                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 
//                       ${formData.enableAnonymous ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     disabled={formData.enableAnonymous}
//                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 
//                       ${formData.enableAnonymous ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Connect Button */}
//             <div className="mt-4">
//               <button
//                 onClick={handleConnect}
//                 disabled={isLoading}
//                 className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md transition-colors 
//                   ${isLoading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-indigo-600 hover:bg-indigo-700'}`}
//               >
//                 {isLoading ? 'Connecting...' : 'Connect'}
//               </button>
//             </div>

//             {/* Error Display */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 p-3 rounded-md flex items-center text-red-700">
//                 <XCircle className="mr-2 text-red-500" />
//                 {error}
//               </div>
//             )}
//           </div>

//           {/* Results Section */}
//           <div className="grid md:grid-cols-2 gap-4">
//             {/* Connection Result Box */}
//             <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
//               <h3 className="text-lg font-semibold mb-3 flex items-center">
//                 {connectionResult?.status === 'Connected' 
//                   ? <CheckCircle2 className="mr-2 text-green-500" /> 
//                   : <XCircle className="mr-2 text-red-500" />}
//                 Connection Result
//               </h3>
//               {connectionResult ? (
//                 <pre className="text-sm bg-gray-50 p-2 rounded">
//                   {JSON.stringify(connectionResult, null, 2)}
//                 </pre>
//               ) : (
//                 <p className="text-gray-500">No connection attempt made</p>
//               )}
//             </div>

//             {/* Browse Result Box */}
//             <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
//               <h3 className="text-lg font-semibold mb-3">Browse Result</h3>
//               {browseResult ? (
//                 <pre className="text-sm bg-gray-50 p-2 rounded">
//                   {JSON.stringify(browseResult, null, 2)}
//                 </pre>
//               ) : (
//                 <p className="text-gray-500">No browse result available</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OPCUAServerModal;


import React, { useState, useEffect, useRef } from 'react';
import { XIcon } from 'lucide-react';

const OPCUAServerModal = ({ isOpen, onClose }) => {
  // State variables
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nodeIds, setNodeIds] = useState(['']);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [nodeInfos, setNodeInfos] = useState([]);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket reference
  const websocketRef = useRef(null);

  // Connect to WebSocket on component mount
  useEffect(() => {
    // Create WebSocket connection
    connectToWebSocket();

    // Cleanup on unmount
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  // Connect to WebSocket
  const connectToWebSocket = () => {
    try {
      websocketRef.current = new WebSocket('ws://localhost:8004/ws');

      // WebSocket event handlers
      websocketRef.current.onopen = () => {
        console.log('WebSocket Connected');
      };

      websocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Handle connection response
        if (data.status === 'connected' || data.status === 'already_connected') {
          setConnectionStatus(data.message);
          setError('');
          setIsConnected(true); // Set connected state
        }
        
        // Handle node reading response
        if (data.status === 'success') {
          // Update nodeInfos to support multiple node responses
          setNodeInfos(prevInfos => {
            const existingIndex = prevInfos.findIndex(info => info.node_id === data.node_id);
            if (existingIndex !== -1) {
              // Update existing node info
              const updatedInfos = [...prevInfos];
              updatedInfos[existingIndex] = data;
              return updatedInfos;
            } else {
              // Add new node info
              return [...prevInfos, data];
            }
          });
          setError('');
        }
        
        // Handle errors
        if (data.status === 'error') {
          setError(`Error: ${data.message}`);
        }
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setError('WebSocket connection failed. Please check your server URL and try again.');
      };

      websocketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setConnectionStatus('');
        setNodeInfos([]);
        setIsConnected(false); // Reset connected state
        setError('WebSocket connection closed. Please try again.');
      };
    } catch (err) {
      console.error('Error connecting to WebSocket:', err);
      setError('Failed to connect to WebSocket. Please check your server URL and try again.');
    }
  };

  // Connect to OPC UA server
  const handleConnect = () => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({
        type: 'connect',
        url: serverUrl,
        username: username,
        password: password
      }));
    }
  };

  // Browse Node
  const handleBrowseNode = () => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      nodeIds.forEach(nodeId => {
        if (nodeId.trim()) {
          websocketRef.current.send(JSON.stringify({
            type: 'read_node',
            node_id: nodeId.trim()
          }));
        }
      });
    }
  };

  // Add a new node ID input
  const addNodeIdInput = () => {
    setNodeIds([...nodeIds, '']);
  };

  // Update a specific node ID
  const updateNodeId = (index, value) => {
    const newNodeIds = [...nodeIds];
    newNodeIds[index] = value;
    setNodeIds(newNodeIds);
  };

  // Remove a specific node ID input
  const removeNodeIdInput = (index) => {
    const newNodeIds = nodeIds.filter((_, i) => i !== index);
    setNodeIds(newNodeIds);

    // Remove the corresponding node information
    setNodeInfos(prevInfos => prevInfos.filter(info => info.node_id !== nodeIds[index]));
  };

  // Close Modal
  const handleCloseModal = () => {
    onClose();
  };

  return (
    <>
    {isOpen && (
  <div
    className="fixed inset-0 bg-black opacity-50 z-50"
    onClick={(e) => e.stopPropagation()}
  ></div>
)}
      {isOpen && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white p-5 rounded-lg shadow-lg ${connectionStatus ? 'w-[1200px] max-w-[90%]' : 'w-[400px] max-w-[90%]'} z-50 max-h-[800px] overflow-y-auto flex`}
        >

            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <XIcon size={24} />
            </button>
          <div className="w-1/2 pr-4 ">
            <h2 className="text-center  text-xl mb-4   ">
              {connectionStatus ? 'Connection Results' : 'Node Information'}
            </h2>

            {connectionStatus && (
              <div className="bg-green-100 text-green-800 p-3 mb-4 rounded ">
                {connectionStatus}
              </div>
            )}

            {error && (
              <div className=" text-red-800 p-3 mb-4 rounded ">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Server URL"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                className="w-[300px] p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-[300px] p-2 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-[300px] p-2 border border-gray-300 rounded"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleConnect}
                  className="w-[300px] p-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Connect
                </button>
                <button
                  onClick={handleBrowseNode}
                  className="w-[300px] p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Browse Node(s)
                </button>

                {/* <button
                    onClick={handleCloseModal}
                    className="w-[100px] p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Close
                  </button> */}
              </div>
            </div>
          </div>

          <div className="w-1/2 pl-4 ">
            <div className="max-h-[400px] overflow-y-auto" >
              {nodeInfos.map((nodeInfo, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded mb-4"
                >
                  <h3 className="text-lg font-semibold mb-2">Node Details</h3>
                  {nodeInfo.type === 'folder' && (
                    <p>
                      <strong>Type:</strong> Folder
                    </p>
                  )}
                  {nodeInfo.type === 'parameter' && (
                    <div>
                      <p>
                        <strong>Type:</strong> Parameter
                      </p>
                      <p>
                        <strong>Value:</strong> {JSON.stringify(nodeInfo.value)}
                      </p>
                    </div>
                  )}
                  {nodeInfo.description && (
                    <p>
                      <strong>Description:</strong> {nodeInfo.description}
                    </p>
                  )}
                  <p>
                    <strong>Node ID:</strong> {nodeInfo.node_id}
                  </p>
                </div>
              ))}
            </div>

            {isConnected && (
              <div>
                <div className="flex flex-col space-y-4 max-h-[200px] overflow-y-auto ">
                  {nodeIds.map((nodeId, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder={`Enter Node ID ${index + 1}`}
                        value={nodeId}
                        onChange={(e) => updateNodeId(index, e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded"
                      />
                      {index > 0 && (
                        <button
                          onClick={() => removeNodeIdInput(index)}
                          className="bg-red-500 text-white p-2 rounded"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={addNodeIdInput}
                    className="w-[150px] p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Node ID
                  </button>
                 
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OPCUAServerModal;