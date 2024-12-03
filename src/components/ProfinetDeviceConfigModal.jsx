// import React, { useState } from 'react';
// import { Network, Database, Wifi, AlertTriangle } from 'lucide-react';

// const ProfinetDeviceConfigModal = ({ onClose }) => {
//   // Connection state
//   const [connectionStatus, setConnectionStatus] = useState('Not Connected');
//   const [connectionError, setConnectionError] = useState('');

//   // Connection parameters
//   const [deviceIP, setDeviceIP] = useState('');
//   const [rack, setRack] = useState(0);
//   const [slot, setSlot] = useState(0);

//   // Data reading parameters
//   const [dataSource, setDataSource] = useState('db');
//   const [dbNumber, setDbNumber] = useState(1);
//   const [fields, setFields] = useState([{ offset: 0, data_type: 'int' }]);

//   // Read data result
//   const [readResult, setReadResult] = useState(null);
//   const [readError, setReadError] = useState('');

//   // Add a new field to read
//   const addField = () => {
//     setFields([...fields, { offset: 0, data_type: 'int' }]);
//   };

//   // Remove a field
//   const removeField = (index) => {
//     const newFields = fields.filter((_, i) => i !== index);
//     setFields(newFields);
//   };

//   // Update a specific field
//   const updateField = (index, key, value) => {
//     const newFields = [...fields];
//     newFields[index][key] = key === 'offset' ? parseInt(value) || 0 : value;
//     setFields(newFields);
//   };

//   // Connect to PLC using REST endpoint
//   const connectToPLC = async () => {
//     if (!deviceIP) {
//       setConnectionError('Device IP is required');
//       return;
//     }

//     setConnectionError('');
//     setReadError('');
//     setReadResult(null);
//     setConnectionStatus('Connecting...');

//     try {
//       const response = await fetch('http://localhost:8000/connect', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           device_ip: deviceIP,
//           rack: parseInt(rack),
//           slot: parseInt(slot)
//         })
//       });

//       const data = await response.json();

//       if (data.status === 'success') {
//         setConnectionStatus('Connected to PLC');
//         setConnectionError('');
//       } else {
//         setConnectionError(data.message || 'Connection failed');
//         setConnectionStatus('Connection Failed');
//       }
//     } catch (error) {
//       console.error('Error connecting to PLC:', error);
//       setConnectionError('Failed to connect to PLC');
//       setConnectionStatus('Connection Failed');
//     }
//   };

//   // Read data from PLC using REST endpoint
//   const readPLCData = async () => {
//     if (connectionStatus !== 'Connected to PLC') {
//       setReadError('No active connection to PLC');
//       return;
//     }

//     if (fields.length === 0) {
//       setReadError('At least one field must be defined');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:8000/read_data', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           data_source: dataSource,
//           db_number: parseInt(dbNumber),
//           fields: fields.map(field => ({
//             offset: parseInt(field.offset),
//             data_type: field.data_type
//           }))
//         })
//       });

//       const data = await response.json();

//       if (data.status === 'success') {
//         setReadResult(data.data);
//         setReadError('');
//       } else {
//         setReadError(data.message || 'Failed to read data');
//         setReadResult(null);
//       }
//     } catch (error) {
//       console.error('Error reading PLC data:', error);
//       setReadError('Failed to read data from PLC');
//     }
//   };

//   const isConnected = connectionStatus === 'Connected to PLC';

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl relative">
//       <button 
//         onClick={onClose}
//         className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
//         aria-label="Close"
//       >
//         <span className="text-xl">×</span>
//       </button>
      
//       <div className="flex items-center mb-6">
//         <Network className="mr-3 text-indigo-600" size={32} />
//         <h2 className="text-2xl font-bold text-gray-900">PLC Data Reader</h2>
//       </div>

//       <div className="grid grid-cols-2 gap-6">
//         {/* Left side - Connection Section (always visible) */}
//         <div className="space-y-4 border p-4 rounded">
//           <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//             <Wifi className="mr-2 text-indigo-500" size={20} />
//             Device Connection
//           </h3>
          
//           <div className="space-y-2">
//             <label className="block text-sm text-gray-700">Device IP Address</label>
//             <input
//               type="text"
//               value={deviceIP}
//               onChange={(e) => setDeviceIP(e.target.value)}
//               className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
//               placeholder="e.g., 192.168.1.100"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm text-gray-700">Rack</label>
//               <input
//                 type="number"
//                 value={rack}
//                 onChange={(e) => setRack(parseInt(e.target.value) || 0)}
//                 min="0"
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-gray-700">Slot</label>
//               <input
//                 type="number"
//                 value={slot}
//                 onChange={(e) => setSlot(parseInt(e.target.value) || 0)}
//                 min="0"
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>

//           <button 
//             onClick={connectToPLC}
//             disabled={connectionStatus === 'Connecting...'}
//             className={`w-full p-2 rounded transition-colors ${
//               isConnected 
//                 ? 'bg-green-500 hover:bg-green-600' 
//                 : connectionStatus === 'Connecting...'
//                 ? 'bg-gray-400'
//                 : 'bg-indigo-500 hover:bg-indigo-600'
//             } text-white font-medium`}
//           >
//             {connectionStatus}
//           </button>
          
//           {connectionError && (
//             <div className="mt-2 p-2 bg-red-100 text-red-800 rounded flex items-center">
//               <AlertTriangle className="mr-2" size={20} />
//               {connectionError}
//             </div>
//           )}
//         </div>

//         {/* Right side - Data Reading Section (only visible after connection) */}
//         {isConnected ? (
//           <div className="space-y-4 border p-4 rounded">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <Database className="mr-2 text-indigo-500" size={20} />
//               Data Reading Configuration
//             </h3>

//             <div className="space-y-2">
//               <label className="block text-sm text-gray-700">Data Source</label>
//               <select
//                 value={dataSource}
//                 onChange={(e) => setDataSource(e.target.value)}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
//               >
//                 <option value="db">Database</option>
//                 <option value="input">Input</option>
//                 <option value="output">Output</option>
//                 <option value="memory">Memory</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm text-gray-700">DB Number</label>
//               <input
//                 type="number"
//                 value={dbNumber}
//                 onChange={(e) => setDbNumber(parseInt(e.target.value) || 0)}
//                 min="1"
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
//                 disabled={dataSource !== 'db'}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm text-gray-700">Fields</label>
//               {fields.map((field, index) => (
//                 <div key={index} className="flex space-x-2 items-center">
//                   <input
//                     type="number"
//                     placeholder="Offset"
//                     value={field.offset}
//                     onChange={(e) => updateField(index, 'offset', e.target.value)}
//                     min="0"
//                     className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
//                   />
//                   <select
//                     value={field.data_type}
//                     onChange={(e) => updateField(index, 'data_type', e.target.value)}
//                     className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="int">Integer</option>
//                     <option value="real">Real</option>
//                     <option value="bool">Boolean</option>
//                     <option value="char">Character</option>
//                     <option value="string">String</option>
//                   </select>
//                   {index > 0 && (
//                     <button 
//                       onClick={() => removeField(index)}
//                       className="text-red-500 hover:text-red-700 p-2"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <div className="flex space-x-2">
//               <button 
//                 onClick={addField}
//                 className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
//               >
//                 Add Field
//               </button>
//               <button 
//                 onClick={readPLCData}
//                 className="flex-1 bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600"
//               >
//                 Read Data
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4 border p-4 rounded opacity-50">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <Database className="mr-2 text-indigo-500" size={20} />
//               Data Reading Configuration
//             </h3>
//             <p className="text-gray-500">Please connect to a PLC first</p>
//           </div>
//         )}
//       </div>

//       {/* Results Section - Only visible after data is read */}
//       {isConnected && (readResult || readError) && (
//         <div className="mt-6 border p-4 rounded">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Results</h3>
          
//           {readError ? (
//             <div className="bg-red-100 text-red-800 p-2 rounded flex items-center">
//               <AlertTriangle className="mr-2" size={20} />
//               {readError}
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="border p-2 text-left">Offset</th>
//                     <th className="border p-2 text-left">Type</th>
//                     <th className="border p-2 text-left">Value</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {readResult.map((item, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="border p-2">{item.offset}</td>
//                       <td className="border p-2">{item.type}</td>
//                       <td className="border p-2">{item.value.toString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfinetDeviceConfigModal;


import React, { useState, useEffect } from 'react';
import { Network, Database, Wifi, AlertTriangle } from 'lucide-react';

const ProfinetDeviceConfigModal = ({ onClose }) => {
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState('Not Connected');
  const [connectionError, setConnectionError] = useState('');

  // WebSocket connection
  const [socket, setSocket] = useState(null);

  // Connection parameters
  const [deviceIP, setDeviceIP] = useState('');
  const [rack, setRack] = useState(0);
  const [slot, setSlot] = useState(0);

  // Data reading parameters
  const [dataSource, setDataSource] = useState('db');
  const [dbNumber, setDbNumber] = useState(1);
  const [fields, setFields] = useState([{ offset: 0, data_type: 'int' }]);

  // Read data result
  const [readResult, setReadResult] = useState(null);
  const [readError, setReadError] = useState('');

  // Add a new field to read
  const addField = () => {
    setFields([...fields, { offset: 0, data_type: 'int' }]);
  };

  // Remove a field
  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  // Update a specific field
  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = key === 'offset' ? parseInt(value) || 0 : value;
    setFields(newFields);
  };

  // Establish WebSocket connection for device connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8009/ws/connect');

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.status === 'success') {
        setConnectionStatus('Connected to PLC');
        setConnectionError('');
      } else {
        setConnectionError(data.message || 'Connection failed');
        setConnectionStatus('Connection Failed');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionError('WebSocket connection error');
      setConnectionStatus('Connection Failed');
    };

    setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Connect to PLC using WebSocket
  const connectToPLC = async () => {
    if (!deviceIP) {
      setConnectionError('Device IP is required');
      return;
    }

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setConnectionError('WebSocket is not connected');
      return;
    }

    setConnectionError('');
    setReadError('');
    setReadResult(null);
    setConnectionStatus('Connecting...');

    try {
      socket.send(JSON.stringify({
        device_ip: deviceIP,
        rack: parseInt(rack),
        slot: parseInt(slot)
      }));
    } catch (error) {
      console.error('Error connecting to PLC:', error);
      setConnectionError('Failed to connect to PLC');
      setConnectionStatus('Connection Failed');
    }
  };

  // Read data from PLC using WebSocket
  const readPLCData = async () => {
    if (connectionStatus !== 'Connected to PLC') {
      setReadError('No active connection to PLC');
      return;
    }

    if (fields.length === 0) {
      setReadError('At least one field must be defined');
      return;
    }

    // Create WebSocket for data reading
    const dataSocket = new WebSocket('ws://localhost:8009/ws/read_data');

    dataSocket.onopen = () => {
      dataSocket.send(JSON.stringify({
        data_source: dataSource,
        db_number: parseInt(dbNumber),
        fields: fields.map(field => ({
          offset: parseInt(field.offset),
          data_type: field.data_type
        }))
      }));
    };

    dataSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.status === 'success') {
        setReadResult(data.data);
        setReadError('');
      } else {
        setReadError(data.message || 'Failed to read data');
        setReadResult(null);
      }

      dataSocket.close();
    };

    dataSocket.onerror = (error) => {
      console.error('Error reading PLC data:', error);
      setReadError('Failed to read data from PLC');
      dataSocket.close();
    };
  };

  const isConnected = connectionStatus === 'Connected to PLC';

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        aria-label="Close"
      >
        <span className="text-xl">×</span>
      </button>
      
      <div className="flex items-center mb-6">
        <Network className="mr-3 text-indigo-600" size={32} />
        <h2 className="text-2xl font-bold text-gray-900">PLC Data Reader</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left side - Connection Section (always visible) */}
        <div className="space-y-4 border p-4 rounded">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Wifi className="mr-2 text-indigo-500" size={20} />
            Device Connection
          </h3>
          
          <div className="space-y-2">
            <label className="block text-sm text-gray-700">Device IP Address</label>
            <input
              type="text"
              value={deviceIP}
              onChange={(e) => setDeviceIP(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 192.168.1.100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Rack</label>
              <input
                type="number"
                value={rack}
                onChange={(e) => setRack(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Slot</label>
              <input
                type="number"
                value={slot}
                onChange={(e) => setSlot(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button 
            onClick={connectToPLC}
            disabled={connectionStatus === 'Connecting...'}
            className={`w-full p-2 rounded transition-colors ${
              isConnected 
                ? 'bg-green-500 hover:bg-green-600' 
                : connectionStatus === 'Connecting...'
                ? 'bg-gray-400'
                : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white font-medium`}
          >
            {connectionStatus}
          </button>
          
          {connectionError && (
            <div className="mt-2 p-2 bg-red-100 text-red-800 rounded flex items-center">
              <AlertTriangle className="mr-2" size={20} />
              {connectionError}
            </div>
          )}
        </div>

        {/* Right side - Data Reading Section (only visible after connection) */}
        {isConnected ? (
          <div className="space-y-4 border p-4 rounded">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Database className="mr-2 text-indigo-500" size={20} />
              Data Reading Configuration
            </h3>

            <div className="space-y-2">
              <label className="block text-sm text-gray-700">Data Source</label>
              <select
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              >
                <option value="db">Database</option>
                <option value="input">Input</option>
                <option value="output">Output</option>
                <option value="memory">Memory</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-700">DB Number</label>
              <input
                type="number"
                value={dbNumber}
                onChange={(e) => setDbNumber(parseInt(e.target.value) || 0)}
                min="1"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                disabled={dataSource !== 'db'}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-700">Fields</label>
              {fields.map((field, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <input
                    type="number"
                    placeholder="Offset"
                    value={field.offset}
                    onChange={(e) => updateField(index, 'offset', e.target.value)}
                    min="0"
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={field.data_type}
                    onChange={(e) => updateField(index, 'data_type', e.target.value)}
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="int">Integer</option>
                    <option value="real">Real</option>
                    <option value="bool">Boolean</option>
                    <option value="char">Character</option>
                    <option value="string">String</option>
                  </select>
                  {index > 0 && (
                    <button 
                      onClick={() => removeField(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={addField}
                className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Add Field
              </button>
              <button 
                onClick={readPLCData}
                className="flex-1 bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600"
              >
                Read Data
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 border p-4 rounded opacity-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Database className="mr-2 text-indigo-500" size={20} />
              Data Reading Configuration
            </h3>
            <p className="text-gray-500">Please connect to a PLC first</p>
          </div>
        )}
      </div>

      {/* Results Section - Only visible after data is read */}
      {isConnected && (readResult || readError) && (
        <div className="mt-6 border p-4 rounded">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Results</h3>
          
          {readError ? (
            <div className="bg-red-100 text-red-800 p-2 rounded flex items-center">
              <AlertTriangle className="mr-2" size={20} />
              {readError}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Offset</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {readResult.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{item.offset}</td>
                      <td className="border p-2">{item.type}</td>
                      <td className="border p-2">{item.value.toString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfinetDeviceConfigModal;