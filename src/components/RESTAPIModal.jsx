// import React, { useState } from 'react';
// import { X } from 'lucide-react';

// const RESTAPIModal = ({ isOpen, onClose }) => {
//   const [selectedMethod, setSelectedMethod] = useState('POST');
//   const [selectedFormat, setSelectedFormat] = useState('JSON');
//   const [rawData, setRawData] = useState('');
//   const [url, setUrl] = useState('');

//   const httpMethods = ['POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
//   const dataFormats = ['JSON', 'Text', 'HTML', 'JavaScript', 'XML'];

//   const sendRequest = () => {
//     // Implement the logic to send the request
//     console.log('Sending request:', {
//       url: url,
//       method: selectedMethod,
//       format: selectedFormat,
//       data: rawData
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
//       <div className="w-[90%] max-w-4xl h-[95vh] bg-white rounded-xl shadow-2xl flex flex-col">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50">
//           <h2 className="text-xl font-bold text-indigo-950">HTTP Protocol</h2>
//           <button 
//             onClick={onClose} 
//             className="text-gray-600 hover:text-indigo-900 transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Modal Content */}
//         <div className="flex flex-col h-full">
//           {/* URL and Method Selection */}
//           <div className="flex items-center justify-between bg-gray-100 p-4 space-x-4">
//             <input 
//               type="text"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               placeholder="Enter API Endpoint URL"
//               className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <select
//                   value={selectedMethod}
//                   onChange={(e) => setSelectedMethod(e.target.value)}
//                   className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   {httpMethods.map((method) => (
//                     <option key={method} value={method}>
//                       {method}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                   <svg
//                     className="h-4 w-4 text-indigo-500"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <polyline points="6 9 12 15 18 9"></polyline>
//                   </svg>
//                 </div>
//               </div>
//               <div className="relative">
//                 <select
//                   value={selectedFormat}
//                   onChange={(e) => setSelectedFormat(e.target.value)}
//                   className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   {dataFormats.map((format) => (
//                     <option key={format} value={format}>
//                       {format}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                   <svg
//                     className="h-4 w-4 text-indigo-500"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <polyline points="6 9 12 15 18 9"></polyline>
//                   </svg>
//                 </div>
//               </div>
//               <button 
//                 onClick={sendRequest} 
//                 className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 Send
//               </button>
//             </div>
//           </div>

//           {/* Request Body */}
//           <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: '50%' }}>
//             <textarea
//               value={rawData}
//               onChange={(e) => setRawData(e.target.value)}
//               className="w-full h-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
//               placeholder="Enter request body / raw data"
//             ></textarea>
//           </div>

//           {/* Response Area (Optional) */}
//           <div className="p-4 border-t border-gray-200 bg-gray-50 h-1/3">
//             <h3 className="text-lg font-semibold text-indigo-900 mb-2">Response</h3>
//             <textarea
//               readOnly
//               className="w-full h-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 font-mono"
//               placeholder="Response will be displayed here"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RESTAPIModal;



import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const RESTAPIModal = ({ isOpen, onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState('PUT');
  const [url, setUrl] = useState('http://127.0.0.1:8000/employees/3');
  const [rawData, setRawData] = useState(JSON.stringify({
    // id: 3,
    // name: "JOHN",
    // age: 34,
    // position: "Sport and exercise psychologist"
  }, null, 2));
  const [response, setResponse] = useState('');
  const [websocket, setWebsocket] = useState(null);

  const httpMethods = ['POST', 'GET', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:8006/ws/perform-network-operation');

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setWebsocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setResponse(JSON.stringify(data, null, 2));
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setResponse(`Error: ${JSON.stringify(error)}`);
    };

    // Cleanup on component unmount
    return () => {
      if (ws) ws.close();
    };
  }, []);

  const sendRequest = () => {
    if (!websocket) {
      setResponse('WebSocket not connected');
      return;
    }

    try {
      // Parse the raw data to ensure it's valid JSON
      const parsedData = JSON.parse(rawData);

      // Construct the request payload
      const payload = {
        url: url,
        method: selectedMethod,
        data: parsedData
      };

      // Send the request via WebSocket
      websocket.send(JSON.stringify(payload));
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="w-[90%] max-w-4xl h-[95vh] bg-white rounded-xl shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-indigo-100 bg-blue-900 rounded-t-lg">
          <h2 className="text-xl font-bold text-white">HTTP Protocol</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col h-full">
          {/* URL and Method Selection */}
          <div className="flex items-center justify-between bg-gray-100 p-4 space-x-4">
            <label htmlFor="url" className="font-medium text-indigo-900 mr-4">URL:</label>
            <input 
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter API Endpoint URL"
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {httpMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-indigo-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              <button 
                onClick={sendRequest} 
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Send
              </button>
            </div>
          </div>

          {/* Request Body */}
          <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: '40%' }}>
            <label htmlFor="request-body" className="font-medium text-indigo-900 mb-2 block">Request Body:</label>
            <textarea
              id="request-body"
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              className="w-full h-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Enter request body / raw data"
            ></textarea>
          </div>

          {/* Response Area */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 h-1/3">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Response</h3>
            <textarea
              readOnly
              value={response}
              className="w-full h-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 font-mono"
              placeholder="Response will be displayed here"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RESTAPIModal;