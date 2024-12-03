// import React, { useState } from 'react';
// import { X, Save, RefreshCw } from 'lucide-react';

// const NetworkSettingsModal = ({ isOpen, onClose }) => {
//   const [settings, setSettings] = useState({
//     ipAddress: '192.168.1.100',
//     subnetMask: '255.255.255.0',
//     gateway: '192.168.1.1',
//     portNumber: '502',
//     timeout: '1000',
//     retries: '3'
//   });

//   const [connectionResults, setConnectionResults] = useState({
//     status: 'No connection attempt made',
//     data: []
//   });

//   if (!isOpen) return null;

//   const handleChange = (field, value) => {
//     setSettings(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSave = () => {
//     console.log('Saving network settings:', settings);
//     onClose();
//   };

//   const handleTest = () => {
//     // Simulated connection test - replace with actual connection logic
//     console.log('Testing network connection with settings:', settings);
//     setConnectionResults({
//       status: 'Connection successful',
//       data: [
//         { id: 1, value: 'Retrieved data point 1' },
//         { id: 2, value: 'Retrieved data point 2' },
//         { id: 3, value: 'Retrieved data point 3' }
//         // Add more data points as needed
//       ]
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
//       <div className="relative w-full max-w-lg mx-auto bg-white rounded-lg shadow-xl 
//                       sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
//         <div className="p-4 sm:p-6 md:p-8">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-4 sm:p-4 border-b border-gray-200 bg-blue-900 rounded-t-lg">
//             <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
//               Network Settings
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
//             >
//               <X size={20} className="sm:w-6 sm:h-6" />
//             </button>
//           </div>

//           {/* Form */}
//           <div className="space-y-4 md:space-y-6">
//             {/* Grid layout for larger screens */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   IP Address
//                 </label>
//                 <input
//                   type="text"
//                   value={settings.ipAddress}
//                   onChange={(e) => handleChange('ipAddress', e.target.value)}
//                   className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Subnet Mask
//                 </label>
//                 <input
//                   type="text"
//                   value={settings.subnetMask}
//                   onChange={(e) => handleChange('subnetMask', e.target.value)}
//                   className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Gateway
//                 </label>
//                 <input
//                   type="text"
//                   value={settings.gateway}
//                   onChange={(e) => handleChange('gateway', e.target.value)}
//                   className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Port Number
//                 </label>
//                 <input
//                   type="text"
//                   value={settings.portNumber}
//                   onChange={(e) => handleChange('portNumber', e.target.value)}
//                   className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Timeout (ms)
//                 </label>
//                 <input
//                   type="text"
//                   value={settings.timeout}
//                   onChange={(e) => handleChange('timeout', e.target.value)}
//                   className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Retries
//                 </label>
//                 <input
//                   type="text"
//                   value={settings.retries}
//                   onChange={(e) => handleChange('retries', e.target.value)}
//                   className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
//                 />
//               </div>

//               {/* Connection Results Box */}
//               <div className="space-y-2 md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Connection Result
//                 </label>
//                 <div className="w-full h-32 overflow-y-auto border border-gray-300 rounded-md p-3 bg-gray-50">
//                   <div className="text-sm">
//                     <div className={`font-medium ${connectionResults.status.includes('successful') ? 'text-green-600' : 'text-gray-600'}`}>
//                       {connectionResults.status}
//                     </div>
//                     {connectionResults.data.map(item => (
//                       <div key={item.id} className="mt-1 text-gray-600">
//                         {item.value}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
//             <button
//               onClick={handleTest}
//               className="flex items-center justify-center px-4 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm sm:text-base w-full sm:w-auto"
//             >
//               <RefreshCw size={16} className="mr-2" />
//               Test Connection
//             </button>
//             <button
//               onClick={handleSave}
//               className="flex items-center justify-center px-4 py-2 sm:py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
//             >
//               <Save size={16} className="mr-2" />
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NetworkSettingsModal;


// import React, { useState } from 'react';
// import { X, RefreshCw } from 'lucide-react';
// import axios from 'axios';

// const NetworkSettingsModal = ({ isOpen, onClose }) => {
//   const [settings, setSettings] = useState({
//     ip_address: '172.18.10.15',
//     port: 502,
//     unit_id: 1
//   });

//   const [connectionResult, setConnectionResult] = useState({
//     status: 'No connection attempt made',
//     connection_id: null
//   });
//   const [isConnecting, setIsConnecting] = useState(false);

//   if (!isOpen) return null;

//   const handleConnect = async () => {
//     setIsConnecting(true);
//     setConnectionResult({
//       status: 'Attempting to connect...',
//       connection_id: null
//     });

//     try {
//       const response = await axios.post('http://localhost:8000/connect', settings);
      
//       if (response.data.status === 'success') {
//         setConnectionResult({
//           status: 'success',
//           connection_id: response.data.connection_id
//         });
//         console.log('Connected successfully:', response.data);
//       } else {
//         throw new Error('Connection failed');
//       }
//     } catch (error) {
//       setConnectionResult({
//         status: 'failed',
//         connection_id: null,
//         error: error.response?.data?.message || error.message || 'Connection failed'
//       });
//       console.error('Connection error:', error);
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg w-full max-w-md">
//         <div className="flex items-center justify-between p-4 bg-blue-900 rounded-t-lg">
//           <h2 className="text-xl font-semibold text-white">Network Settings</h2>
//           <button 
//             onClick={onClose}
//             className="text-white hover:text-gray-200"
//             disabled={isConnecting}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               IP Address
//             </label>
//             <input
//               type="text"
//               value={settings.ip_address}
//               onChange={(e) => setSettings({...settings, ip_address: e.target.value})}
//               className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//               disabled={isConnecting}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Port
//             </label>
//             <input
//               type="number"
//               value={settings.port}
//               onChange={(e) => setSettings({...settings, port: parseInt(e.target.value)})}
//               className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//               disabled={isConnecting}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Unit ID
//             </label>
//             <input
//               type="number"
//               value={settings.unit_id}
//               onChange={(e) => setSettings({...settings, unit_id: parseInt(e.target.value)})}
//               className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//               disabled={isConnecting}
//               min="0"
//               max="255"
//             />
//           </div>

//           <div className="mt-4">
//             <div className={`p-3 rounded border ${
//               connectionResult.status === 'success'
//                 ? 'bg-green-50 border-green-200' 
//                 : connectionResult.status === 'failed'
//                   ? 'bg-red-50 border-red-200'
//                   : 'bg-gray-50 border-gray-200'
//             }`}>
//               <p className={`text-sm ${
//                 connectionResult.status === 'success'
//                   ? 'text-green-700'
//                   : connectionResult.status === 'failed'
//                     ? 'text-red-700'
//                     : 'text-gray-700'
//               }`}>
//                 {connectionResult.status === 'success' 
//                   ? `Connected successfully (ID: ${connectionResult.connection_id})`
//                   : connectionResult.status === 'failed'
//                     ? `Connection failed: ${connectionResult.error}`
//                     : connectionResult.status
//                 }
//               </p>
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end space-x-3">
//             <button
//               onClick={handleConnect}
//               disabled={isConnecting}
//               className={`
//                 flex items-center px-4 py-2 rounded
//                 ${isConnecting 
//                   ? 'bg-blue-400 cursor-not-allowed' 
//                   : 'bg-blue-600 hover:bg-blue-700'}
//                 text-white focus:outline-none focus:ring-2 focus:ring-blue-500
//               `}
//             >
//               <RefreshCw 
//                 size={16} 
//                 className={`mr-2 ${isConnecting ? 'animate-spin' : ''}`} 
//               />
//               {isConnecting ? 'Connecting...' : 'Connect'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NetworkSettingsModal;


//below is the first working code where read anad write dats is showing in response in network not in box in frontend
// import React, { useState, useEffect, useRef } from 'react';
// import { X, RefreshCw, ChevronDown } from 'lucide-react';

// const NetworkSettingsModal = ({ isOpen, onClose }) => {
//   const [settings, setSettings] = useState({
//     ip_address: '172.18.10.15',
//     port: 502,
//     unit_id: 1
//   });

//   const [connectionResult, setConnectionResult] = useState({
//     status: 'No connection attempt made',
//     connection_id: null
//   });
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [selectedOperation, setSelectedOperation] = useState(null);
//   const [readParams, setReadParams] = useState({
//     address: 0,
//     count: 1,
//     function_code: 1
//   });
//   const [writeParams, setWriteParams] = useState({
//     address: 0,
//     values: [],
//     function_code: 5
//   });
//   const [operationResult, setOperationResult] = useState(null);
//   const wsRef = useRef(null);

//   useEffect(() => {
//     wsRef.current = new WebSocket('ws://localhost:8002/ws');

//     wsRef.current.onopen = () => {
//       console.log('WebSocket connection established');
//     };

//     wsRef.current.onmessage = (event) => {
//       const response = JSON.parse(event.data);
//       handleWebSocketResponse(response);
//     };

//     wsRef.current.onerror = (error) => {
//       console.error('WebSocket error:', error);
//       setConnectionResult({
//         status: 'failed',
//         connection_id: null,
//         error: 'WebSocket connection error'
//       });
//     };

//     wsRef.current.onclose = () => {
//       console.log('WebSocket connection closed');
//     };

//     return () => {
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
//     };
//   }, []);

//   const handleWebSocketResponse = (response) => {
//     if (response.type === 'read' || response.type === 'write') {
//       setOperationResult(response);
//     } else {
//       if (response.status === 'success') {
//         setConnectionResult({
//           status: 'success',
//           connection_id: response.connection_id
//         });
//       } else {
//         setConnectionResult({
//           status: 'failed',
//           connection_id: null,
//           error: response.message || 'Connection failed'
//         });
//       }
//       setIsConnecting(false);
//     }
//   };

//   const handleConnect = () => {
//     if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
//       setConnectionResult({
//         status: 'failed',
//         connection_id: null,
//         error: 'WebSocket is not connected'
//       });
//       return;
//     }

//     setIsConnecting(true);
//     setConnectionResult({
//       status: 'Attempting to connect...',
//       connection_id: null
//     });

//     wsRef.current.send(JSON.stringify({
//       type: 'connect',
//       data: settings
//     }));
//   };

//   const handleRead = () => {
//     if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
//       setOperationResult({ status: 'error', message: 'WebSocket is not connected' });
//       return;
//     }

//     wsRef.current.send(JSON.stringify({
//       type: 'read',
//       data: readParams
//     }));
//   };

//   const handleWrite = () => {
//     if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
//       setOperationResult({ status: 'error', message: 'WebSocket is not connected' });
//       return;
//     }

//     // Convert string of comma-separated values to array of numbers
//     const processedValues = writeParams.values.split(',').map(v => 
//       writeParams.function_code === 5 || writeParams.function_code === 15 
//         ? Boolean(parseInt(v.trim()))
//         : parseInt(v.trim())
//     );

//     wsRef.current.send(JSON.stringify({
//       type: 'write',
//       data: {
//         ...writeParams,
//         values: processedValues
//       }
//     }));
//   };

//   const handleDisconnect = () => {
//     if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
//       console.error('WebSocket is not connected');
//       return;
//     }

//     wsRef.current.send(JSON.stringify({
//       type: 'disconnect',
//       data: {}
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg w-full max-w-md">
//         <div className="flex items-center justify-between p-4 bg-blue-900 rounded-t-lg">
//           <h2 className="text-xl font-semibold text-white">Network Settings</h2>
//           <button 
//             onClick={() => {
//               handleDisconnect();
//               onClose();
//             }}
//             className="text-white hover:text-gray-200"
//             disabled={isConnecting}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-6 space-y-4">
//           {/* Connection Settings */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 IP Address
//               </label>
//               <input
//                 type="text"
//                 value={settings.ip_address}
//                 onChange={(e) => setSettings({...settings, ip_address: e.target.value})}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                 disabled={isConnecting || connectionResult.status === 'success'}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Port
//               </label>
//               <input
//                 type="number"
//                 value={settings.port}
//                 onChange={(e) => setSettings({...settings, port: parseInt(e.target.value)})}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                 disabled={isConnecting || connectionResult.status === 'success'}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Unit ID
//               </label>
//               <input
//                 type="number"
//                 value={settings.unit_id}
//                 onChange={(e) => setSettings({...settings, unit_id: parseInt(e.target.value)})}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                 disabled={isConnecting || connectionResult.status === 'success'}
//                 min="0"
//                 max="255"
//               />
//             </div>
//           </div>

//           {/* Connection Status */}
//           <div className={`p-3 rounded border ${
//             connectionResult.status === 'success'
//               ? 'bg-green-50 border-green-200' 
//               : connectionResult.status === 'failed'
//                 ? 'bg-red-50 border-red-200'
//                 : 'bg-gray-50 border-gray-200'
//           }`}>
//             <p className={`text-sm ${
//               connectionResult.status === 'success'
//                 ? 'text-green-700'
//                 : connectionResult.status === 'failed'
//                   ? 'text-red-700'
//                   : 'text-gray-700'
//             }`}>
//               {connectionResult.status === 'success' 
//                 ? `Connected successfully `
//                 : connectionResult.status === 'failed'
//                   ? `Connection failed: ${connectionResult.error}`
//                   : connectionResult.status
//               }
//             </p>
//           </div>

//           {/* Operation Selection (enabled only when connected) */}
//           {connectionResult.status === 'success' && (
//             <div className="space-y-4">
//               <select
//                 value={selectedOperation || ''}
//                 onChange={(e) => setSelectedOperation(e.target.value)}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Operation</option>
//                 <option value="read">Read</option>
//                 <option value="write">Write</option>
//               </select>

//               {/* Read Parameters */}
//               {selectedOperation === 'read' && (
//                 <div className="space-y-4 p-4 border rounded">
//                   <h3 className="font-medium">Read Parameters</h3>
//                   <div>
//                     <label className="block text-sm text-gray-700 mb-1">Address</label>
//                     <input
//                       type="number"
//                       value={readParams.address}
//                       onChange={(e) => setReadParams({...readParams, address: parseInt(e.target.value)})}
//                       className="w-full p-2 border rounded"
//                       min="0"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm text-gray-700 mb-1">Count</label>
//                     <input
//                       type="number"
//                       value={readParams.count}
//                       onChange={(e) => setReadParams({...readParams, count: parseInt(e.target.value)})}
//                       className="w-full p-2 border rounded"
//                       min="1"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm text-gray-700 mb-1">Function Code</label>
//                     <select
//                       value={readParams.function_code}
//                       onChange={(e) => setReadParams({...readParams, function_code: parseInt(e.target.value)})}
//                       className="w-full p-2 border rounded"
//                     >
//                       <option value="1">1 - Read Coils</option>
//                       <option value="2">2 - Read Discrete Inputs</option>
//                       <option value="3">3 - Read Holding Registers</option>
//                       <option value="4">4 - Read Input Registers</option>
//                     </select>
//                   </div>
//                   <button
//                     onClick={handleRead}
//                     className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//                   >
//                     Read
//                   </button>
//                 </div>
//               )}

//               {/* Write Parameters */}
//               {selectedOperation === 'write' && (
//                 <div className="space-y-4 p-4 border rounded">
//                   <h3 className="font-medium">Write Parameters</h3>
//                   <div>
//                     <label className="block text-sm text-gray-700 mb-1">Address</label>
//                     <input
//                       type="number"
//                       value={writeParams.address}
//                       onChange={(e) => setWriteParams({...writeParams, address: parseInt(e.target.value)})}
//                       className="w-full p-2 border rounded"
//                       min="0"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm text-gray-700 mb-1">Values (comma-separated)</label>
//                     <input
//                       type="text"
//                       value={writeParams.values}
//                       onChange={(e) => setWriteParams({...writeParams, values: e.target.value})}
//                       className="w-full p-2 border rounded"
//                       placeholder="e.g., 1,0,1 or 42,43,44"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm text-gray-700 mb-1">Function Code</label>
//                     <select
//                       value={writeParams.function_code}
//                       onChange={(e) => setWriteParams({...writeParams, function_code: parseInt(e.target.value)})}
//                       className="w-full p-2 border rounded"
//                     >
//                       <option value="5">5 - Write Single Coil</option>
//                       <option value="6">6 - Write Single Register</option>
//                       <option value="15">15 - Write Multiple Coils</option>
//                       <option value="16">16 - Write Multiple Registers</option>
//                     </select>
//                   </div>
//                   <button
//                     onClick={handleWrite}
//                     className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//                   >
//                     Write
//                   </button>
//                 </div>
//               )}

//               {/* Operation Result */}
//               {operationResult && (
//                 <div className={`p-3 rounded border ${
//                   operationResult.status === 'success'
//                     ? 'bg-green-50 border-green-200'
//                     : 'bg-red-50 border-red-200'
//                 }`}>
//                   <p className={`text-sm ${
//                     operationResult.status === 'success'
//                       ? 'text-green-700'
//                       : 'text-red-700'
//                   }`}>
//                     {operationResult.status === 'success'
//                       ? `Operation successful${operationResult.values ? `: ${JSON.stringify(operationResult.values)}` : ''}`
//                       : `Operation failed: ${operationResult.message}`
//                     }
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Connect Button */}
//           {connectionResult.status !== 'success' && (
//             <div className="mt-6 flex justify-end space-x-3">
//               <button
//                 onClick={handleConnect}
//                 disabled={isConnecting}
//                 className={`
//                   flex items-center px-4 py-2 rounded
//                   ${isConnecting 
//                     ? 'bg-blue-400 cursor-not-allowed' 
//                     : 'bg-blue-600 hover:bg-blue-700'}
//                   text-white focus:outline-none focus:ring-2 focus:ring-blue-500
//                 `}
//               >
//                 <RefreshCw 
//                   size={16} 
//                   className={`mr-2 ${isConnecting ? 'animate-spin' : ''}`} 
//                 />
//                 {isConnecting ? 'Connecting...' : 'Connect'}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NetworkSettingsModal;

import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, ChevronDown } from 'lucide-react';
import ResponseTable from './ResponseTable';
const NetworkSettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    ip_address: '172.18.10.15',
    port: 502,
    unit_id: 1
  });

  const [connectionResult, setConnectionResult] = useState({
    status: 'No connection attempt made',
    connection_id: null
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [readParams, setReadParams] = useState({
    address: 0,
    count: 1,
    function_code: 1
  });
  const [writeParams, setWriteParams] = useState({
    address: 0,
    values: [],
    function_code: 5
  });
  const [operationResult, setOperationResult] = useState(null);
  const [responseLog, setResponseLog] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:8002/ws/tcp');

    wsRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    wsRef.current.onmessage = (event) => {
      const response = JSON.parse(event.data);
      handleWebSocketResponse(response);
      // Add timestamp to response log
      setResponseLog(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        data: response
      }]);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionResult({
        status: 'failed',
        connection_id: null,
        error: 'WebSocket connection error'
      });
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketResponse = (response) => {
    if (response.type === 'read' || response.type === 'write') {
      setOperationResult(response);
    } else {
      if (response.status === 'success') {
        setConnectionResult({
          status: 'success',
          connection_id: response.connection_id
        });
      } else {
        setConnectionResult({
          status: 'failed',
          connection_id: null,
          error: response.message || 'Connection failed'
        });
      }
      setIsConnecting(false);
    }
  };

  const handleConnect = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setConnectionResult({
        status: 'failed',
        connection_id: null,
        error: 'WebSocket is not connected'
      });
      return;
    }

    setIsConnecting(true);
    setConnectionResult({
      status: 'Attempting to connect...',
      connection_id: null
    });

    wsRef.current.send(JSON.stringify({
      type: 'connect',
      data: settings
    }));
  };

  const handleRead = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setOperationResult({ status: 'error', message: 'WebSocket is not connected' });
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'read',
      data: readParams
    }));
  };

  const handleWrite = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setOperationResult({ status: 'error', message: 'WebSocket is not connected' });
      return;
    }

    const processedValues = writeParams.values.split(',').map(v => 
      writeParams.function_code === 5 || writeParams.function_code === 15 
        ? Boolean(parseInt(v.trim()))
        : parseInt(v.trim())
    );

    wsRef.current.send(JSON.stringify({
      type: 'write',
      data: {
        ...writeParams,
        values: processedValues
      }
    }));
  };

  const handleDisconnect = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'disconnect',
      data: {}
    }));
    
    setResponseLog([]); // Clear response log on disconnect
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
    <div className="bg-white rounded-lg w-full max-w-7xl my-8 flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-900 rounded-t-lg">
        <h2 className="text-xl font-semibold text-white">Network Settings</h2>
        <button 
          onClick={() => {
            handleDisconnect();
            onClose();
          }}
          className="text-white hover:text-gray-200"
          disabled={isConnecting}
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Connection Settings */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
            <input
              type="text"
              value={settings.ip_address}
              onChange={(e) => setSettings({...settings, ip_address: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              disabled={isConnecting || connectionResult.status === 'success'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input
              type="number"
              value={settings.port}
              onChange={(e) => setSettings({...settings, port: parseInt(e.target.value)})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              disabled={isConnecting || connectionResult.status === 'success'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit ID</label>
            <input
              type="number"
              value={settings.unit_id}
              onChange={(e) => setSettings({...settings, unit_id: parseInt(e.target.value)})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              disabled={isConnecting || connectionResult.status === 'success'}
              min="0"
              max="255"
            />
          </div>
        </div>

        {/* Connection Status */}
        <div className={`p-3 rounded border ${
          connectionResult.status === 'success'
            ? 'bg-green-50 border-green-200' 
            : connectionResult.status === 'failed'
              ? 'bg-red-50 border-red-200'
              : 'bg-gray-50 border-gray-200'
        }`}>
          <p className={`text-sm ${
            connectionResult.status === 'success'
              ? 'text-green-700'
              : connectionResult.status === 'failed'
                ? 'text-red-700'
                : 'text-gray-700'
          }`}>
            {connectionResult.status === 'success' 
              ? 'Connected successfully'
              : connectionResult.status === 'failed'
                ? `Connection failed: ${connectionResult.error}`
                : connectionResult.status
            }
          </p>
        </div>

        {/* Operation Selection and Side-by-Side Layout */}
        {connectionResult.status === 'success' && (
          <>
            <select
              value={selectedOperation || ''}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="w-100 p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Operation</option>
              <option value="read">Read</option>
              <option value="write">Write</option>
            </select>

            <div className="grid grid-cols-2 gap-6">
              {/* Left Side - Parameters */}
              <div>
                {selectedOperation === 'read' && (
                  <div className="space-y-4 p-4 border rounded">
                    <h3 className="font-medium">Read Parameters</h3>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Address</label>
                      <input
                        type="number"
                        value={readParams.address}
                        onChange={(e) => setReadParams({...readParams, address: parseInt(e.target.value)})}
                        className="w-full p-2 border rounded"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Count</label>
                      <input
                        type="number"
                        value={readParams.count}
                        onChange={(e) => setReadParams({...readParams, count: parseInt(e.target.value)})}
                        className="w-full p-2 border rounded"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Function Code</label>
                      <select
                        value={readParams.function_code}
                        onChange={(e) => setReadParams({...readParams, function_code: parseInt(e.target.value)})}
                        className="w-full p-2 border rounded"
                      >
                        <option value="1">1 - Read Coils</option>
                        <option value="2">2 - Read Discrete Inputs</option>
                        <option value="3">3 - Read Holding Registers</option>
                        <option value="4">4 - Read Input Registers</option>
                      </select>
                    </div>
                    <button
                      onClick={handleRead}
                      className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                      Read
                    </button>
                  </div>
                )}

                {selectedOperation === 'write' && (
                  <div className="space-y-4 p-4 border rounded">
                    <h3 className="font-medium">Write Parameters</h3>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Address</label>
                      <input
                        type="number"
                        value={writeParams.address}
                        onChange={(e) => setWriteParams({...writeParams, address: parseInt(e.target.value)})}
                        className="w-full p-2 border rounded"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Values (comma-separated)</label>
                      <input
                        type="text"
                        value={writeParams.values}
                        onChange={(e) => setWriteParams({...writeParams, values: e.target.value})}
                        className="w-full p-2 border rounded"
                        placeholder="e.g., 1,0,1 or 42,43,44"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Function Code</label>
                      <select
                        value={writeParams.function_code}
                        onChange={(e) => setWriteParams({...writeParams, function_code: parseInt(e.target.value)})}
                        className="w-full p-2 border rounded"
                      >
                        <option value="5">5 - Write Single Coil</option>
                        <option value="6">6 - Write Single Register</option>
                        <option value="15">15 - Write Multiple Coils</option>
                        <option value="16">16 - Write Multiple Registers</option>
                      </select>
                    </div>
                    <button
                      onClick={handleWrite}
                      className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                      Write
                    </button>
                  </div>
                )}
              </div>

              <ResponseTable responseLog={responseLog} />
            </div>

         
            {/* Operation Result */}
            {operationResult && (
              <div className={`p-3 rounded border ${
                operationResult.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm ${
                  operationResult.status === 'success'
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  {operationResult.status === 'success'
                    ? `Operation successful${operationResult.values ? `: ${JSON.stringify(operationResult.values)}` : ''}`
                    : `Operation failed: ${operationResult.message}`
                  }
                </p>
              </div>
            )}
          </>
        )}

        {/* Connect Button */}
        {connectionResult.status !== 'success' && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`
                flex items-center px-4 py-2 rounded
                ${isConnecting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}
                text-white focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            >
              <RefreshCw 
                size={16} 
                className={`mr-2 ${isConnecting ? 'animate-spin' : ''}`} 
              />
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default NetworkSettingsModal;