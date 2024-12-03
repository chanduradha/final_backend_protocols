// import React, { useState } from 'react';

// const SerialConfigModal = ({ isOpen, onClose }) => {
//   const [config, setConfig] = useState({
//     port: 'COM1',
//     baudRate: '9600',
//     dataBits: '8',
//     stopBits: '1',
//     parity: 'none',
//     flowControl: 'none',
//     slaveId: '1'
//   });

//   const [isConnected, setIsConnected] = useState(false);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setConfig(prev => ({ ...prev, [name]: value }));
//   };

//   const handleDataBitsChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || (parseInt(value) >= 7 && parseInt(value) <= 8)) {
//       setConfig(prev => ({ ...prev, dataBits: value }));
//     }
//   };

//   const handleSlaveIdChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 247)) {
//       setConfig(prev => ({ ...prev, slaveId: value }));
//     }
//   };

//   const handleSubmit = () => {
//     console.log('Serial Configuration:', config);
//     onClose();
//   };

//   const handleConnect = () => {
//     setIsConnected(!isConnected);
//     console.log('Connection status changed:', !isConnected);
//   };

//   const InputField = ({ label, children }) => (
//     <div className="space-y-1 sm:space-y-2">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       {children}
//     </div>
//   );

//   const SelectInput = ({ name, value, onChange, options }) => (
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//     >
//       {options.map(option => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl transform transition-all">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-blue-900 rounded-t-lg">
//           <h2 className="text-lg sm:text-xl font-semibold text-white">Serial Configuration</h2>
//           <button
//             onClick={onClose}
//             className="text-white hover:text-gray-200 p-1"
//             aria-label="Close"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-4 sm:p-6 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
//           <InputField label="COM Port">
//             <SelectInput
//               name="port"
//               value={config.port}
//               onChange={handleChange}
//               options={[
//                 { value: 'COM1', label: 'COM1' },
//                 { value: 'COM2', label: 'COM2' },
//                 { value: 'COM3', label: 'COM3' },
//                 { value: 'COM4', label: 'COM4' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Baud Rate">
//             <SelectInput
//               name="baudRate"
//               value={config.baudRate}
//               onChange={handleChange}
//               options={[
//                 { value: '9600', label: '9600' },
//                 { value: '19200', label: '19200' },
//                 { value: '38400', label: '38400' },
//                 { value: '57600', label: '57600' },
//                 { value: '115200', label: '115200' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Data Bits (7-8)">
//             <input
//               type="number"
//               name="dataBits"
//               value={config.dataBits}
//               onChange={handleDataBitsChange}
//               min="7"
//               max="8"
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter data bits (7-8)"
//             />
//           </InputField>

//           <InputField label="Stop Bits">
//             <SelectInput
//               name="stopBits"
//               value={config.stopBits}
//               onChange={handleChange}
//               options={[
//                 { value: '1', label: '1' },
//                 { value: '2', label: '2' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Parity">
//             <SelectInput
//               name="parity"
//               value={config.parity}
//               onChange={handleChange}
//               options={[
//                 { value: 'none', label: 'None' },
//                 { value: 'even', label: 'Even' },
//                 { value: 'odd', label: 'Odd' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Flow Control">
//             <SelectInput
//               name="flowControl"
//               value={config.flowControl}
//               onChange={handleChange}
//               options={[
//                 { value: 'none', label: 'None' },
//                 { value: 'hardware', label: 'Hardware' },
//                 { value: 'software', label: 'Software' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Slave ID (1-247)">
//             <input
//               type="number"
//               name="slaveId"
//               value={config.slaveId}
//               onChange={handleSlaveIdChange}
//               min="1"
//               max="247"
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter slave ID (1-247)"
//             />
//           </InputField>

//           <button
//             onClick={handleConnect}
//             className={`w-full p-2 rounded-md text-white transition-colors ${
//               isConnected 
//                 ? 'bg-red-600 hover:bg-red-700' 
//                 : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {isConnected ? 'Disconnect' : 'Connect'}
//           </button>
//         </div>

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-gray-50 rounded-b-lg">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded-md hover:bg-gray-100 w-full sm:w-auto order-2 sm:order-1"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto order-1 sm:order-2"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SerialConfigModal;

//correcting working code using endpoint''''''''''''''''''''''''''''''''''''''
// import React, { useState } from 'react';
// const SerialConfigModal = ({ isOpen, onClose }) => {
//   const [config, setConfig] = useState({
//     port: 'COM4',
//     baudRate: '9600',
//     dataBits: '8',
//     stopBits: '1',
//     parity: 'even',
//     // flowControl: 'none',
//     slaveId: '1'
//   });

//   const [isConnected, setIsConnected] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setConfig(prev => ({ ...prev, [name]: value }));
//   };

//   const handleDataBitsChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || (parseInt(value) >= 7 && parseInt(value) <= 8)) {
//       setConfig(prev => ({ ...prev, dataBits: value }));
//     }
//   };

//   const handleSlaveIdChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 247)) {
//       setConfig(prev => ({ ...prev, slaveId: value }));
//     }
//   };

//   const handleConnect = async () => {
//     setIsLoading(true);
//     setError('');
//     setStatusMessage('');

//     try {
//       const payload = {
//         port: config.port,
//         slave_address: parseInt(config.slaveId),
//         baudrate: parseInt(config.baudRate),
//         parity: config.parity.toLowerCase(),
//         stopbits: parseInt(config.stopBits),
//         timeout: 1,
//         register_address: 142
//       };

//       const response = await fetch('http://localhost:8000/connect', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setIsConnected(true);
//         setStatusMessage(data.message);
//       } else {
//         setError(data.message || 'Failed to connect');
//         setIsConnected(false);
//       }
//     } catch (err) {
//       setError('Failed to connect to the server');
//       setIsConnected(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDisconnect = () => {
//     setIsConnected(false);
//     setStatusMessage('Disconnected from device');
//   };

//   const InputField = ({ label, children }) => (
//     <div className="space-y-1 sm:space-y-2">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       {children}
//     </div>
//   );

//   const SelectInput = ({ name, value, onChange, options }) => (
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//     >
//       {options.map(option => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );

//   const StatusMessage = ({ message, isError }) => {
//     if (!message) return null;
    
//     return (
//       <div className={`p-4 mb-4 rounded-md ${
//         isError 
//           ? 'bg-red-50 border border-red-200 text-red-800' 
//           : 'bg-green-50 border border-green-200 text-green-800'
//       }`}>
//         <p className="text-sm">{message}</p>
//       </div>
//     );
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl transform transition-all">
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-blue-900 rounded-t-lg">
//           <h2 className="text-lg sm:text-xl font-semibold text-white">Serial Configuration</h2>
//           <button
//             onClick={onClose}
//             className="text-white hover:text-gray-200 p-1"
//             aria-label="Close"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="p-4 sm:p-6 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
//           <StatusMessage message={error} isError={true} />
//           <StatusMessage message={statusMessage} isError={false} />

//           <InputField label="COM Port">
//             <SelectInput
//               name="port"
//               value={config.port}
//               onChange={handleChange}
//               options={[
//                 { value: 'COM1', label: 'COM1' },
//                 { value: 'COM2', label: 'COM2' },
//                 { value: 'COM3', label: 'COM3' },
//                 { value: 'COM4', label: 'COM4' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Baud Rate">
//             <SelectInput
//               name="baudRate"
//               value={config.baudRate}
//               onChange={handleChange}
//               options={[
//                 { value: '9600', label: '9600' },
//                 { value: '19200', label: '19200' },
//                 { value: '38400', label: '38400' },
//                 { value: '57600', label: '57600' },
//                 { value: '115200', label: '115200' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Data Bits (7-8)">
//             <input
//               type="number"
//               name="dataBits"
//               value={config.dataBits}
//               onChange={handleDataBitsChange}
//               min="7"
//               max="8"
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter data bits (7-8)"
//             />
//           </InputField>

//           <InputField label="Stop Bits">
//             <SelectInput
//               name="stopBits"
//               value={config.stopBits}
//               onChange={handleChange}
//               options={[
//                 { value: '1', label: '1' },
//                 { value: '2', label: '2' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Parity">
//             <SelectInput
//               name="parity"
//               value={config.parity}
//               onChange={handleChange}
//               options={[
//                 { value: 'none', label: 'None' },
//                 { value: 'even', label: 'Even' },
//                 { value: 'odd', label: 'Odd' }
//               ]}
//             />
//           </InputField>

//           {/* <InputField label="Flow Control">
//             <SelectInput
//               name="flowControl"
//               value={config.flowControl}
//               onChange={handleChange}
//               options={[
//                 { value: 'none', label: 'None' },
//                 { value: 'hardware', label: 'Hardware' },
//                 { value: 'software', label: 'Software' }
//               ]}
//             />
//           </InputField> */}

//           <InputField label="Slave ID (1-247)">
//             <input
//               type="number"
//               name="slaveId"
//               value={config.slaveId}
//               onChange={handleSlaveIdChange}
//               min="1"
//               max="247"
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter slave ID (1-247)"
//             />
//           </InputField>

//           <button
//             onClick={isConnected ? handleDisconnect : handleConnect}
//             disabled={isLoading}
//             className={`w-full p-2 rounded-md text-white transition-colors ${
//               isLoading ? 'bg-gray-400 cursor-not-allowed' :
//               isConnected 
//                 ? 'bg-red-600 hover:bg-red-700' 
//                 : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {isLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
//           </button>
//         </div>
      
//         <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-gray-50 rounded-b-lg">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded-md hover:bg-gray-100 w-full sm:w-auto order-2 sm:order-1"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto order-1 sm:order-2"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SerialConfigModal;


//'''''''this below code without using axios to post the data'''''''''''''//

// import React, { useState } from 'react';
// import RegisterSettingsModal from './RegisterSettingsModal';
// import { X  } from 'lucide-react';
// const SerialConfigModal = ({ isOpen, onClose }) => {
//   const [config, setConfig] = useState({
//     port: 'COM4',
//     baudRate: '9600',
//     dataBits: '8',
//     stopBits: '1',
//     parity: 'even',
//     slaveId: '1'
//   });

//   const [isConnected, setIsConnected] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setConfig(prev => ({ ...prev, [name]: value }));
//   };

//   const handleDataBitsChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || (parseInt(value) >= 7 && parseInt(value) <= 8)) {
//       setConfig(prev => ({ ...prev, dataBits: value }));
//     }
//   };

//   const handleSlaveIdChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 247)) {
//       setConfig(prev => ({ ...prev, slaveId: value }));
//     }
//   };

//   const handleConnect = async () => {
//     setIsLoading(true);
//     setError('');
//     setStatusMessage('');
//     // Close register modal if it was open from a previous connection
//     setShowRegisterModal(false);
  
//     try {
//       const payload = {
//         port: config.port,
//         slave_address: parseInt(config.slaveId),
//         baudrate: parseInt(config.baudRate),
//         parity: config.parity.toLowerCase(),
//         stopbits: parseInt(config.stopBits),
//         timeout: 1,
//         register_address: 142
//       };
  
//       const response = await fetch('http://localhost:8000/connect', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         setIsConnected(true); // Mark as connected
//         setStatusMessage(data.message); // Show success message (like "Connected successfully")
        
//         // Check if the response message indicates successful connection
//         if (data.message === 'Connected to Modbus device successfully!') {
//           // Only open RegisterSettingsModal if connection was successful
//           setShowRegisterModal(true);  // Open RegisterSettingsModal
//         }
//       } else {
//         setError(data.message || 'Failed to connect');
//         setIsConnected(false);
//         setShowRegisterModal(false); // Ensure modal stays closed
//       }
//     } catch (err) {
//       setError('Failed to connect to the server');
//       setIsConnected(false);
//       setShowRegisterModal(false); // Ensure modal stays closed
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   const handleDisconnect = () => {
//     setIsConnected(false);
//     setStatusMessage('Disconnected from device');
//     // Close RegisterSettingsModal when disconnecting
//     setShowRegisterModal(false);
//   };

//   const handleRegisterModalClose = () => {
//     setShowRegisterModal(false);
//   };

//   const InputField = ({ label, children }) => (
//     <div className="space-y-1 sm:space-y-2">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       {children}
//     </div>
//   );

//   const SelectInput = ({ name, value, onChange, options }) => (
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//     >
//       {options.map(option => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );

//   const StatusMessage = ({ message, isError }) => {
//     if (!message) return null;
    
//     return (
//       <div className={`p-4 mb-4 rounded-md ${
//         isError 
//           ? 'bg-red-50 border border-red-200 text-red-800' 
//           : 'bg-green-50 border border-green-200 text-green-800'
//       }`}>
//         <p className="text-sm">{message}</p>
//       </div>
//     );
//   };


  
//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg w-full max-w-4xl mx-auto shadow-xl transform transition-all">
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-blue-900 rounded-t-lg">
//           <h2 className="text-lg sm:text-xl font-semibold text-white">Serial Configuration</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
//           >
//              <X size={20} className="sm:w-6 sm:h-6" />
//           </button>
//         </div>

//         <div className="p-4 sm:p-6 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
//           <StatusMessage message={error} isError={true} />
//           <StatusMessage message={statusMessage} isError={false} />

//           <InputField label="COM Port">
//             <SelectInput
//               name="port"
//               value={config.port}
//               onChange={handleChange}
//               options={[
//                 { value: 'COM1', label: 'COM1' },
//                 { value: 'COM2', label: 'COM2' },
//                 { value: 'COM3', label: 'COM3' },
//                 { value: 'COM4', label: 'COM4' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Baud Rate">
//             <SelectInput
//               name="baudRate"
//               value={config.baudRate}
//               onChange={handleChange}
//               options={[
//                 { value: '9600', label: '9600' },
//                 { value: '19200', label: '19200' },
//                 { value: '38400', label: '38400' },
//                 { value: '57600', label: '57600' },
//                 { value: '115200', label: '115200' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Data Bits (7-8)">
//             <input
//               type="number"
//               name="dataBits"
//               value={config.dataBits}
//               onChange={handleDataBitsChange}
//               min="7"
//               max="8"
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter data bits (7-8)"
//             />
//           </InputField>

//           <InputField label="Stop Bits">
//             <SelectInput
//               name="stopBits"
//               value={config.stopBits}
//               onChange={handleChange}
//               options={[
//                 { value: '1', label: '1' },
//                 { value: '2', label: '2' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Parity">
//             <SelectInput
//               name="parity"
//               value={config.parity}
//               onChange={handleChange}
//               options={[
//                 { value: 'none', label: 'None' },
//                 { value: 'even', label: 'even' },
//                 { value: 'odd', label: 'odd' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Slave ID (1-247)">
//             <input
//               type="number"
//               name="slaveId"
//               value={config.slaveId}
//               onChange={handleSlaveIdChange}
//               min="1"
//               max="247"
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter slave ID (1-247)"
//             />
//           </InputField>

//           <button
//             onClick={isConnected ? handleDisconnect : handleConnect}
//             disabled={isLoading}
//             className={`w-full p-2 rounded-md text-white transition-colors ${
//               isLoading ? 'bg-gray-400 cursor-not-allowed' :
//               isConnected 
//                 ? 'bg-red-600 hover:bg-red-700' 
//                 : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {isLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
//           </button>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-gray-50 rounded-b-lg">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded-md hover:bg-gray-100 w-full sm:w-auto order-2 sm:order-1"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto order-1 sm:order-2"
//           >
//             Close
//           </button>
//         </div>

//         {/* Only render RegisterSettingsModal when showRegisterModal is true */}
//         {showRegisterModal && (
//           <RegisterSettingsModal 
//             isOpen={showRegisterModal} 
//             onClose={handleRegisterModalClose}
          
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SerialConfigModal;


//''''''''Below code is using axios to post the data '''''''''''//

// import React, { useState } from 'react';
// import RegisterSettingsModal from './RegisterSettingsModal';
// import { X } from 'lucide-react';
// import axios from 'axios';

// const SerialConfigModal = ({ isOpen, onClose }) => {
//   const [config, setConfig] = useState({
//     port: 'COM4',
//     baudRate: '9600',
//     dataBits: '8',
//     stopBits: '1',
//     parity: 'even',
//     slaveId: '1'
//   });

//   const [isConnected, setIsConnected] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setConfig(prev => ({ ...prev, [name]: value }));
//   };

//   const handleDataBitsChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || (parseInt(value) >= 7 && parseInt(value) <= 8)) {
//       setConfig(prev => ({ ...prev, dataBits: value }));
//     }
//   };

//   const handleSlaveIdChange = (e) => {
//     const value = e.target.value;
//     if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 247)) {
//       setConfig(prev => ({ ...prev, slaveId: value }));
//     }
//   };

//   const handleConnect = async () => {
//     setIsLoading(true);
//     setError('');
//     setStatusMessage('');
//     setShowRegisterModal(false);
  
//     try {
//       const payload = {
//         port: config.port,
//         slave_address: parseInt(config.slaveId),
//         baudrate: parseInt(config.baudRate),
//         parity: config.parity.toLowerCase(),
//         stopbits: parseInt(config.stopBits),
//         timeout: 1,
//         register_address: 142
//       };
  
//       const response = await axios.post('http://localhost:8005/connect', payload);
      
//       // Axios automatically throws an error for non-2xx responses
//       // so we only handle success case here
//       setIsConnected(true);
//       setStatusMessage(response.data.message);
      
//       if (response.data.message === 'Connected to Modbus device successfully!') {
//         setShowRegisterModal(true);
//       }
      
//     } catch (err) {
//       // Handle error from axios
//       const errorMessage = err.response?.data?.message || err.message || 'Failed to connect to the server';
//       setError(errorMessage);
//       setIsConnected(false);
//       setShowRegisterModal(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDisconnect = () => {
//     setIsConnected(false);
//     setStatusMessage('Disconnected from device');
//     setShowRegisterModal(false);
//   };

//   const handleRegisterModalClose = () => {
//     setShowRegisterModal(false);
//   };

//   const InputField = ({ label, children }) => (
//     <div className="space-y-1 sm:space-y-2">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       {children}
//     </div>
//   );

//   const SelectInput = ({ name, value, onChange, options }) => (
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//     >
//       {options.map(option => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );

//   const StatusMessage = ({ message, isError }) => {
//     if (!message) return null;
    
//     return (
//       <div className={`p-4 mb-4 rounded-md ${
//         isError 
//           ? 'bg-red-50 border border-red-200 text-red-800' 
//           : 'bg-green-50 border border-green-200 text-green-800'
//       }`}>
//         <p className="text-sm">{message}</p>
//       </div>
//     );
//   };
  
//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg w-full max-w-4xl mx-auto shadow-xl transform transition-all">
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-blue-900 rounded-t-lg">
//           <h2 className="text-lg sm:text-xl font-semibold text-white">Serial Configuration</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
//           >
//              <X size={20} className="sm:w-6 sm:h-6" />
//           </button>
//         </div>

//         <div className="p-4 sm:p-6 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
//           <StatusMessage message={error} isError={true} />
//           <StatusMessage message={statusMessage} isError={false} />

//           <InputField label="COM Port">
//             <SelectInput
//               name="port"
//               value={config.port}
//               onChange={handleChange}
//               options={[
//                 { value: 'COM1', label: 'COM1' },
//                 { value: 'COM2', label: 'COM2' },
//                 { value: 'COM3', label: 'COM3' },
//                 { value: 'COM4', label: 'COM4' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Baud Rate">
//             <SelectInput
//               name="baudRate"
//               value={config.baudRate}
//               onChange={handleChange}
//               options={[
//                 { value: '9600', label: '9600' },
//                 { value: '19200', label: '19200' },
//                 { value: '38400', label: '38400' },
//                 { value: '57600', label: '57600' },
//                 { value: '115200', label: '115200' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Data Bits (7-8)">
//             <input
//               type="number"
//               name="dataBits"
//               value={config.dataBits}
//               onChange={handleDataBitsChange}
//               min="7"
//               max="8"
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter data bits (7-8)"
//             />
//           </InputField>

//           <InputField label="Stop Bits">
//             <SelectInput
//               name="stopBits"
//               value={config.stopBits}
//               onChange={handleChange}
//               options={[
//                 { value: '1', label: '1' },
//                 { value: '2', label: '2' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Parity">
//             <SelectInput
//               name="parity"
//               value={config.parity}
//               onChange={handleChange}
//               options={[
//                 { value: 'none', label: 'None' },
//                 { value: 'even', label: 'even' },
//                 { value: 'odd', label: 'odd' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Slave ID (1-247)">
//             <input
//               type="number"
//               name="slaveId"
//               value={config.slaveId}
//               onChange={handleSlaveIdChange}
//               min="1"
//               max="247"
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter slave ID (1-247)"
//             />
//           </InputField>

//           <button
//             onClick={isConnected ? handleDisconnect : handleConnect}
//             disabled={isLoading}
//             className={`w-full p-2 rounded-md text-white transition-colors ${
//               isLoading ? 'bg-gray-400 cursor-not-allowed' :
//               isConnected 
//                 ? 'bg-red-600 hover:bg-red-700' 
//                 : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {isLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
//           </button>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-gray-50 rounded-b-lg">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded-md hover:bg-gray-100 w-full sm:w-auto order-2 sm:order-1"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto order-1 sm:order-2"
//           >
//             Close
//           </button>
//         </div>

//         {showRegisterModal && (
//           <RegisterSettingsModal 
//             isOpen={showRegisterModal} 
//             onClose={handleRegisterModalClose}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SerialConfigModal;



// '''''''''''''''''''''''' web socket connected code below working ''''''''''''''''''''''''''''''''''''

// import React, { useState, useEffect, useCallback } from 'react';
// import RegisterSettingsModal from './RegisterSettingsModal';
// import { X } from 'lucide-react';

// const SerialConfigModal = ({ isOpen, onClose }) => {
//   const [config, setConfig] = useState({
//     port: 'COM4',
//     baudRate: '9600',
//     dataBits: '8',
//     stopBits: '1',
//     parity: 'even',
//     slaveId: '1'
//   });

//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [statusMessage, setStatusMessage] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);
//   const [connectionDetails, setConnectionDetails] = useState(null);


//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setConfig(prev => ({ ...prev, [name]: value }));
//   }, []);

//   const handleDataBitsChange = useCallback((e) => {
//     const value = e.target.value;
//     if (value === '' || (parseInt(value) >= 7 && parseInt(value) <= 8)) {
//       setConfig(prev => ({ ...prev, dataBits: value }));
//     }
//   }, []);

//   const handleSlaveIdChange = useCallback((e) => {
//     const value = e.target.value;
//     if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 247)) {
//       setConfig(prev => ({ ...prev, slaveId: value }));
//     }
//   }, []);

//   const handleConnect = useCallback(() => {
//     if (!socket) return;
    
//     setIsLoading(true);
//     setError('');
//     setStatusMessage('');
//     setShowRegisterModal(false);

//     const payload = {
//       type: 'connect',
//       data: {
//         port: config.port,
//         slave_address: parseInt(config.slaveId),
//         baudrate: parseInt(config.baudRate),
//         parity: config.parity.toLowerCase(),
//         stopbits: parseInt(config.stopBits),
//         timeout: 1
//       }
//     };

//     socket.send(JSON.stringify(payload));
//   }, [socket, config]);

//   const handleDisconnect = useCallback(() => {
//     if (!socket) return;

//     const payload = {
//       type: 'disconnect'
//     };

//     socket.send(JSON.stringify(payload));
//     setIsConnected(false);
//     setStatusMessage('Disconnected from device');
//     setShowRegisterModal(false);
//   }, [socket]);

//   const handleRegisterModalClose = useCallback(() => {
//     setShowRegisterModal(false);
//   }, []);

//   useEffect(() => {
//     if (!isOpen) return;

//     const ws = new WebSocket('ws://localhost:8005/ws');
    
//     ws.onopen = () => {
//       console.log('WebSocket Connected');
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
      
//       if (data.type === 'connection_status') {
//         setIsLoading(false);
//         if (data.status === 'success') {
//           setIsConnected(true);
//           setStatusMessage(data.message);
//           if (data.message === 'Connected to Modbus device successfully!') {
//             // Store connection details when successfully connected
//             setConnectionDetails({
//               port: config.port,
//               slaveId: parseInt(config.slaveId),
//               baudRate: parseInt(config.baudRate),
//               parity: config.parity.toLowerCase(),
//               stopBits: parseInt(config.stopBits)
//             });
//             setShowRegisterModal(true);
//           }
//         } else {
//           setError(data.message);
//           setIsConnected(false);
//           setShowRegisterModal(false);
//           setConnectionDetails(null);
//         }
//       }
//     };

//     ws.onclose = () => {
//       console.log('WebSocket Disconnected');
//       setIsConnected(false);
//       setSocket(null);
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket Error:', error);
//       setError('WebSocket connection error');
//     };

//     setSocket(ws);

//     // Cleanup on component unmount or when modal closes
//     return () => {
//       if (ws) {
//         ws.close();
//       }
//     };
//   }, [isOpen]); // Only re-run if isOpen changes

//   if (!isOpen) return null;

//   const InputField = ({ label, children }) => (
//     <div className="space-y-1 sm:space-y-2">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       {children}
//     </div>
//   );

//   const SelectInput = ({ name, value, onChange, options }) => (
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//     >
//       {options.map(option => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );

//   const StatusMessage = ({ message, isError }) => {
//     if (!message) return null;
    
//     return (
//       <div className={`p-4 mb-4 rounded-md ${
//         isError 
//           ? 'bg-red-50 border border-red-200 text-red-800' 
//           : 'bg-green-50 border border-green-200 text-green-800'
//       }`}>
//         <p className="text-sm">{message}</p>
//       </div>
//     );
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg w-full max-w-4xl mx-auto shadow-xl transform transition-all">
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-blue-900 rounded-t-lg">
//           <h2 className="text-lg sm:text-xl font-semibold text-white">Serial Configuration</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
//           >
//             <X size={20} className="sm:w-6 sm:h-6" />
//           </button>
//         </div>

//         <div className="p-4 sm:p-6 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
//           <StatusMessage message={error} isError={true} />
//           <StatusMessage message={statusMessage} isError={false} />

//           <InputField label="COM Port">
//             <SelectInput
//               name="port"
//               value={config.port}
//               onChange={handleChange}
//               options={[
//                 { value: 'COM1', label: 'COM1' },
//                 { value: 'COM2', label: 'COM2' },
//                 { value: 'COM3', label: 'COM3' },
//                 { value: 'COM4', label: 'COM4' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Baud Rate">
//             <SelectInput
//               name="baudRate"
//               value={config.baudRate}
//               onChange={handleChange}
//               options={[
//                 { value: '9600', label: '9600' },
//                 { value: '19200', label: '19200' },
//                 { value: '38400', label: '38400' },
//                 { value: '57600', label: '57600' },
//                 { value: '115200', label: '115200' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Data Bits (7-8)">
//             <input
//               type="number"
//               name="dataBits"
//               value={config.dataBits}
//               onChange={handleDataBitsChange}
//               min="7"
//               max="8"
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter data bits (7-8)"
//             />
//           </InputField>

//           <InputField label="Stop Bits">
//             <SelectInput
//               name="stopBits"
//               value={config.stopBits}
//               onChange={handleChange}
//               options={[
//                 { value: '1', label: '1' },
//                 { value: '2', label: '2' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Parity">
//             <SelectInput
//               name="parity"
//               value={config.parity}
//               onChange={handleChange}
//               options={[
//                 { value: 'none', label: 'None' },
//                 { value: 'even', label: 'Even' },
//                 { value: 'odd', label: 'Odd' }
//               ]}
//             />
//           </InputField>

//           <InputField label="Slave ID (1-247)">
//             <input
//               type="number"
//               name="slaveId"
//               value={config.slaveId}
//               onChange={handleSlaveIdChange}
//               min="1"
//               max="247"
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter slave ID (1-247)"
//             />
//           </InputField>

//           <button
//             onClick={isConnected ? handleDisconnect : handleConnect}
//             disabled={isLoading}
//             className={`w-full p-2 rounded-md text-white transition-colors ${
//               isLoading ? 'bg-gray-400 cursor-not-allowed' :
//               isConnected 
//                 ? 'bg-red-600 hover:bg-red-700' 
//                 : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {isLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
//           </button>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-gray-50 rounded-b-lg">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded-md hover:bg-gray-100 w-full sm:w-auto order-2 sm:order-1"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto order-1 sm:order-2"
//           >
//             Close
//           </button>
//         </div>

//         {showRegisterModal && (
//         <RegisterSettingsModal 
//           isOpen={showRegisterModal} 
//           onClose={handleRegisterModalClose}
//           connectionDetails={connectionDetails}
//           socket={socket}
//         />
//       )}
//       </div>
//     </div>
//   );
// };

// export default SerialConfigModal;

import React, { useState, useEffect, useCallback } from 'react';
import RegisterSettingsModal from './RegisterSettingsModal';
import { X } from 'lucide-react';

const SerialConfigModal = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState({
    port: 'COM4',
    baudRate: '9600',
    dataBits: '8',
    stopBits: '1',
    parity: 'even',
    slaveId: '1'
  });

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  const setupWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:8005/ws/modbusrtu');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setWsConnected(true);
      setError('');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'connection_status') {
        setIsLoading(false);
        if (data.status === 'success') {
          setIsConnected(true);
          setStatusMessage(data.message);
          if (data.message === 'Connected to Modbus device successfully!') {
            setConnectionDetails({
              port: config.port,
              slaveId: parseInt(config.slaveId),
              baudRate: parseInt(config.baudRate),
              parity: config.parity.toLowerCase(),
              stopBits: parseInt(config.stopBits)
            });
            setShowRegisterModal(true);
          }
        } else {
          setError(data.message);
          setIsConnected(false);
          setShowRegisterModal(false);
          setConnectionDetails(null);
        }
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setWsConnected(false);
      setIsConnected(false);
      setSocket(null);
      // Attempt to reconnect WebSocket after a brief delay
      setTimeout(() => {
        if (isOpen) {
          setupWebSocket();
        }
      }, 2000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setError('WebSocket connection error');
      setWsConnected(false);
    };

    setSocket(ws);

    return ws;
  }, [isOpen, config]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleDataBitsChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 7 && parseInt(value) <= 8)) {
      setConfig(prev => ({ ...prev, dataBits: value }));
    }
  }, []);

  const handleSlaveIdChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 247)) {
      setConfig(prev => ({ ...prev, slaveId: value }));
    }
  }, []);

  const handleConnect = useCallback(() => {
    if (!socket || !wsConnected) {
      // If WebSocket is not connected, attempt to reconnect
      const newSocket = setupWebSocket();
      // Wait for the WebSocket to connect before sending the connect message
      newSocket.onopen = () => {
        sendConnectMessage(newSocket);
      };
      return;
    }
    
    sendConnectMessage(socket);
  }, [socket, wsConnected, config, setupWebSocket]);

  const sendConnectMessage = (ws) => {
    setIsLoading(true);
    setError('');
    setStatusMessage('');
    setShowRegisterModal(false);

    const payload = {
      type: 'connect',
      data: {
        port: config.port,
        slave_address: parseInt(config.slaveId),
        baudrate: parseInt(config.baudRate),
        parity: config.parity.toLowerCase(),
        stopbits: parseInt(config.stopBits),
        timeout: 1
      }
    };

    ws.send(JSON.stringify(payload));
  };

  const handleDisconnect = useCallback(() => {
    if (!socket) return;

    const payload = {
      type: 'disconnect'
    };

    socket.send(JSON.stringify(payload));
    setIsConnected(false);
    setStatusMessage('Disconnected from device');
    setShowRegisterModal(false);
    setConnectionDetails(null);
  }, [socket]);

  const handleRegisterModalClose = useCallback(() => {
    setShowRegisterModal(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // Cleanup when modal closes
      if (socket) {
        socket.close();
        setSocket(null);
      }
      setIsConnected(false);
      setWsConnected(false);
      setError('');
      setStatusMessage('');
      return;
    }

    // Setup WebSocket when modal opens
    const ws = setupWebSocket();

    // Cleanup on component unmount or when modal closes
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [isOpen, setupWebSocket]);

  if (!isOpen) return null;

  const InputField = ({ label, children }) => (
    <div className="space-y-1 sm:space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );

  const SelectInput = ({ name, value, onChange, options }) => (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  const StatusMessage = ({ message, isError }) => {
    if (!message) return null;
    
    return (
      <div className={`p-4 mb-4 rounded-md ${
        isError 
          ? 'bg-red-50 border border-red-200 text-red-800' 
          : 'bg-green-50 border border-green-200 text-green-800'
      }`}>
        <p className="text-sm">{message}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-auto shadow-xl transform transition-all">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-blue-900 rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Serial Configuration</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {!wsConnected && (
            <StatusMessage 
              message="WebSocket disconnected. Attempting to reconnect..." 
              isError={true} 
            />
          )}
          <StatusMessage message={error} isError={true} />
          <StatusMessage message={statusMessage} isError={false} />

          <InputField label="COM Port">
            <SelectInput
              name="port"
              value={config.port}
              onChange={handleChange}
              options={[
                { value: 'COM1', label: 'COM1' },
                { value: 'COM2', label: 'COM2' },
                { value: 'COM3', label: 'COM3' },
                { value: 'COM4', label: 'COM4' }
              ]}
            />
          </InputField>

          <InputField label="Baud Rate">
            <SelectInput
              name="baudRate"
              value={config.baudRate}
              onChange={handleChange}
              options={[
                { value: '9600', label: '9600' },
                { value: '19200', label: '19200' },
                { value: '38400', label: '38400' },
                { value: '57600', label: '57600' },
                { value: '115200', label: '115200' }
              ]}
            />
          </InputField>

          <InputField label="Data Bits (7-8)">
            <input
              type="number"
              name="dataBits"
              value={config.dataBits}
              onChange={handleDataBitsChange}
              min="7"
              max="8"
              className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter data bits (7-8)"
            />
          </InputField>

          <InputField label="Stop Bits">
            <SelectInput
              name="stopBits"
              value={config.stopBits}
              onChange={handleChange}
              options={[
                { value: '1', label: '1' },
                { value: '2', label: '2' }
              ]}
            />
          </InputField>

          <InputField label="Parity">
            <SelectInput
              name="parity"
              value={config.parity}
              onChange={handleChange}
              options={[
                { value: 'none', label: 'None' },
                { value: 'even', label: 'Even' },
                { value: 'odd', label: 'Odd' }
              ]}
            />
          </InputField>

          <InputField label="Slave ID (1-247)">
            <input
              type="number"
              name="slaveId"
              value={config.slaveId}
              onChange={handleSlaveIdChange}
              min="1"
              max="247"
              className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter slave ID (1-247)"
            />
          </InputField>

          <button
            onClick={isConnected ? handleDisconnect : handleConnect}
            disabled={isLoading}
            className={`w-full p-2 rounded-md text-white transition-colors ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' :
              isConnected 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto order-1 sm:order-2"
          >
            Close
          </button>
        </div>

        {showRegisterModal && (
          <RegisterSettingsModal 
            isOpen={showRegisterModal} 
            onClose={handleRegisterModalClose}
            connectionDetails={connectionDetails}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
};

export default SerialConfigModal;