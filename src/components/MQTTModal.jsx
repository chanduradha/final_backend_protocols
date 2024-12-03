// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//     Cloud, 
//     Link, 
//     Wifi, 
//     X, 
//     Check, 
//     RefreshCcw, 
//     Globe,
//     Send,
//     ArrowLeft
//   } from 'lucide-react';

// const MQTTModal = ({ isOpen, onClose }) => {
//   // Connection states
//   const [broker, setBroker] = useState('localhost');
//   const [port, setPort] = useState(1883);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
  
//   // Connection status and messages
//   const [connectionStatus, setConnectionStatus] = useState(null);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // Topics and subscriptions
//   const [availableTopics, setAvailableTopics] = useState([]);
//   const [selectedTopics, setSelectedTopics] = useState([]);
//   const [topicMessages, setTopicMessages] = useState({});
// // New state variables for publish functionality
// const [publishTopic, setPublishTopic] = useState('');
// const [publishMessage, setPublishMessage] = useState('');
// const [publishQoS, setPublishQoS] = useState(0);
// const [publishStatus, setPublishStatus] = useState('');

//   // Modal views
//   const [currentView, setCurrentView] = useState('connect');

//   // Effect to fetch topics when connection is successful
//   useEffect(() => {
//     if (connectionStatus === 'connected') {
//       fetchAvailableTopics();
//     }
//   }, [connectionStatus]);

//   // Handle MQTT connection
//   const handleConnect = async () => {
//     try {
//       setIsLoading(true);
//       setErrorMessage('');
      
//       const response = await axios.post('http://localhost:8003/connect', {
//         broker,
//         port,
//         username: username || undefined,
//         password: password || undefined
//       });

//       if (response.data.success) {
//         setConnectionStatus('connected');
//         setCurrentView('topics');
//         // Immediately fetch topics after successful connection
//         await fetchAvailableTopics();
//       }
//     } catch (error) {
//       setConnectionStatus('error');
//       setErrorMessage(error.response?.data?.detail || 'Connection failed');
//       console.error('Connection error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch available MQTT topics with mock data fallback
//   const fetchAvailableTopics = async () => {
//     try {
//       setIsLoading(true);
//       setErrorMessage('');
      
//       const response = await axios.get('http://localhost:8003/topics');
      
//       // Check if we got the "No topics" message
//       if (response.data.message === "No topics have been received yet.") {
//         // Use mock data as fallback
//         setAvailableTopics([
//           "sensor/temperature",
//           "sensor/humidity",
//           "device/status",
//           "sensor/pressure"
//         ]);
//       } else if (response.data.available_topics && Array.isArray(response.data.available_topics)) {
//         setAvailableTopics(response.data.available_topics);
//       } else {
//         console.error('Invalid topics response format:', response.data);
//         setErrorMessage('Invalid topics data received');
//       }
//     } catch (error) {
//       console.error('Error fetching topics:', error);
//       // Use mock data as fallback in case of error
//       setAvailableTopics([
//         "sensor/temperature",
//         "sensor/humidity",
//         "device/status",
//         "sensor/pressure"
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Subscribe to selected topics
//   const subscribeToTopics = async () => {
//     try {
//       setIsLoading(true);
//       setErrorMessage('');

//       const subscriptions = selectedTopics.map(topic => ({
//         topic,
//         qos: 0 // Default QoS
//       }));

//       const response = await axios.post('http://localhost:8003/subscribe', { 
//         subscriptions 
//       });
      
//       // Initialize messages for selected topics
//       const newTopicMessages = {};
//       selectedTopics.forEach(topic => {
//         newTopicMessages[topic] = 'Waiting for messages...';
//       });

//       if (response.data.messages && Array.isArray(response.data.messages)) {
//         response.data.messages.forEach(msg => {
//           newTopicMessages[msg.topic] = msg.message;
//         });
//       }

//       setTopicMessages(newTopicMessages);
//       setCurrentView('messages');
//     } catch (error) {
//       console.error('Subscription error:', error);
//       setErrorMessage('Failed to subscribe to topics');
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handlePublish = async () => {
//     try {
//       setIsLoading(true);
//       setPublishStatus('');
//       setErrorMessage('');

//       const response = await axios.post('http://localhost:8003/publish', {
//         topic: publishTopic,
//         message: publishMessage,
//         qos: publishQoS
//       });

//       if (response.data.success) {
//         setPublishStatus('Message published successfully!');
//         // Clear form after successful publish
//         setPublishTopic('');
//         setPublishMessage('');
//         setPublishQoS(0);
//       }
//     } catch (error) {
//       console.error('Publish error:', error);
//       setErrorMessage('Failed to publish message: ' + (error.response?.data?.detail || 'Unknown error'));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderPublishForm = () => (
//     <div className="p-6 space-y-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-indigo-900 flex items-center">
//           <Send className="mr-2 text-cyan-600" />
//           Publish Message
//         </h2>
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Topic</label>
//           <input 
//             type="text" 
//             value={publishTopic}
//             onChange={(e) => setPublishTopic(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             placeholder="Enter topic"
//             disabled={isLoading}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Message</label>
//           <textarea 
//             value={publishMessage}
//             onChange={(e) => setPublishMessage(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             placeholder="Enter message"
//             rows={4}
//             disabled={isLoading}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">QoS Level</label>
//           <select
//             value={publishQoS}
//             onChange={(e) => setPublishQoS(Number(e.target.value))}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             disabled={isLoading}
//           >
//             <option value={0}>0 - At most once</option>
//             <option value={1}>1 - At least once</option>
//             <option value={2}>2 - Exactly once</option>
//           </select>
//         </div>
//       </div>

//       {publishStatus && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
//           {publishStatus}
//         </div>
//       )}

//       {errorMessage && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//           {errorMessage}
//         </div>
//       )}

//       <div className="flex justify-between mt-6">
//         <button 
//           onClick={() => setCurrentView('topics')}
//           className="text-gray-600 hover:text-indigo-600 flex items-center transition-colors"
//         >
//           <ArrowLeft className="mr-2" size={18} />
//           Back
//         </button>
//         <button 
//           onClick={handlePublish}
//           disabled={!publishTopic || !publishMessage || isLoading}
//           className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           <Send className="mr-2" size={18} />
//           {isLoading ? 'Publishing...' : 'Publish'}
//         </button>
//       </div>
//     </div>
//   );

//   // Render connection form
//   const renderConnectionForm = () => (
//     <div className="p-6 space-y-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-indigo-900 flex items-center">
//           <Cloud className="mr-2 text-cyan-600" />
//           MQTT Connection
//         </h2>
//         <button 
//           onClick={onClose} 
//           className="text-gray-500 hover:text-red-500 transition-colors"
//         >
//           <X size={24} />
//         </button>
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Broker</label>
//           <input 
//             type="text" 
//             value={broker}
//             onChange={(e) => setBroker(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             placeholder="Enter broker address"
//             disabled={isLoading}
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Port</label>
//           <input 
//             type="number" 
//             value={port}
//             onChange={(e) => setPort(parseInt(e.target.value))}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             placeholder="Enter port number"
//             disabled={isLoading}
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Username (Optional)</label>
//           <input 
//             type="text" 
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             placeholder="Enter username"
//             disabled={isLoading}
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Password (Optional)</label>
//           <input 
//             type="password" 
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             placeholder="Enter password"
//             disabled={isLoading}
//           />
//         </div>
//       </div>

//       {errorMessage && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//           {errorMessage}
//         </div>
//       )}

//       <div className="flex justify-end space-x-2 mt-6">
//         <button 
//           onClick={handleConnect}
//           disabled={isLoading}
//           className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           <Link className="mr-2" size={18} />
//           {isLoading ? 'Connecting...' : 'Connect'}
//         </button>
//       </div>
//     </div>
//   );

//   // Render topics view
//   const renderTopicsView = () => (
//     <div className="p-6 space-y-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-indigo-900 flex items-center">
//           <Wifi className="mr-2 text-cyan-600" />
//           Available Topics
//         </h2>
//         <button 
//           onClick={fetchAvailableTopics} 
//           className="text-gray-500 hover:text-indigo-600 flex items-center transition-colors"
//           disabled={isLoading}
//         >
//           <RefreshCcw size={18} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//           Refresh
//         </button>
//       </div>

//       {isLoading ? (
//         <div className="text-center text-gray-500 py-8">
//           <RefreshCcw className="animate-spin mx-auto mb-2" size={24} />
//           Loading topics...
//         </div>
//       ) : errorMessage ? (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//           {errorMessage}
//         </div>
//       ) : availableTopics.length === 0 ? (
//         <div className="text-center text-gray-500 py-8">No topics available</div>
//       ) : (
//         <div className="space-y-2">
//           {availableTopics.map(topic => (
//             <div 
//               key={topic} 
//               className="flex items-center bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors"
//             >
//               <input 
//                 type="checkbox" 
//                 checked={selectedTopics.includes(topic)}
//                 onChange={() => {
//                   setSelectedTopics(prev => 
//                     prev.includes(topic) 
//                       ? prev.filter(t => t !== topic) 
//                       : [...prev, topic]
//                   );
//                 }}
//                 disabled={isLoading}
//                 className="mr-2 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
//               />
//               <Globe className="mr-2 text-cyan-600" size={18} />
//               <span className="flex-grow">{topic}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="flex justify-between mt-6">
//         <button 
//           onClick={() => setCurrentView('connect')}
//           disabled={isLoading}
//           className="text-gray-600 hover:text-indigo-600 flex items-center transition-colors"
//         >
//           <X className="mr-2" size={18} />
//           Back
//         </button>
//         <button 
//             onClick={() => setCurrentView('publish')}
//             disabled={isLoading}
//             className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             <Send className="mr-2" size={18} />
//             Publish
//           </button>

//         <button 
//           onClick={subscribeToTopics}
//           disabled={selectedTopics.length === 0 || isLoading}
//           className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           <Check className="mr-2" size={18} />
//           Subscribe
//         </button>
//       </div>
//     </div>
//   );

//   // Render topic messages view
//   const renderTopicMessagesView = () => (
//     <div className="p-6 space-y-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-indigo-900 flex items-center">
//           <Wifi className="mr-2 text-cyan-600" />
//           Topic Messages
//         </h2>
//       </div>

//       {Object.entries(topicMessages).length === 0 ? (
//         <div className="text-center text-gray-500 py-8">
//           No messages received yet
//         </div>
//       ) : (
//         Object.entries(topicMessages).map(([topic, message]) => (
//           <div 
//             key={topic} 
//             className="bg-gray-100 p-3 rounded-md border-l-4 border-cyan-600"
//           >
//             <div className="text-sm font-medium text-gray-600">{topic}</div>
//             <div className="mt-1 text-indigo-900">{message}</div>
//           </div>
//         ))
//       )}

//       <div className="flex justify-between mt-6">
//         <button 
//           onClick={() => setCurrentView('topics')}
//           className="text-gray-600 hover:text-indigo-600 flex items-center transition-colors"
//         >
//           <X className="mr-2" size={18} />
//           Back
//         </button>
//       </div>
//     </div>
//   );

//   const renderCurrentView = () => {
//     switch(currentView) {
//       case 'connect': 
//         return renderConnectionForm();
//       case 'topics': 
//         return renderTopicsView();
//       case 'messages': 
//         return renderTopicMessagesView();
//       case 'publish':
//         return renderPublishForm();
//       default: 
//         return renderConnectionForm();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto">
//         {renderCurrentView()}
//       </div>
//     </div>
//   );
// };

// export default MQTTModal;



import React, { useState, useEffect, useCallback } from 'react';
import { 
    Cloud, 
    Link, 
    Wifi, 
    X, 
    Check, 
    RefreshCcw, 
    Globe,
    Send,
    ArrowLeft
  } from 'lucide-react';

const MQTTModal = ({ isOpen, onClose }) => {
  // Connection states
  const [broker, setBroker] = useState('localhost');
  const [port, setPort] = useState(1883);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Connection status and messages
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // WebSocket state
  const [socket, setSocket] = useState(null);

  // Topics and subscriptions
  const [availableTopics, setAvailableTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicMessages, setTopicMessages] = useState({});

  // New state variables for publish functionality
  const [publishTopic, setPublishTopic] = useState('');
  const [publishMessage, setPublishMessage] = useState('');
  const [publishQoS, setPublishQoS] = useState(0);
  const [publishStatus, setPublishStatus] = useState('');

  // Modal views
  const [currentView, setCurrentView] = useState('connect');

  // WebSocket connection and message handler
  const connectWebSocket = useCallback(() => {
    const newSocket = new WebSocket('ws://localhost:8003/ws');

    newSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'connect_response':
          handleConnectResponse(data);
          break;
        case 'topics_response':
          handleTopicsResponse(data);
          break;
        case 'subscribe_response':
          handleSubscribeResponse(data);
          break;
        case 'publish_response':
          handlePublishResponse(data);
          break;
        default:
          console.log('Received unknown message type:', data);
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
      setErrorMessage('WebSocket connection failed');
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus(null);
    };

    setSocket(newSocket);
  }, []);

  // Handle connection response
  const handleConnectResponse = (data) => {
    setIsLoading(false);
    if (data.success) {
      setConnectionStatus('connected');
      setCurrentView('topics');
      fetchAvailableTopics();
    } else {
      setConnectionStatus('error');
      setErrorMessage(data.message || 'Connection failed');
    }
  };

  // Fetch available topics
  const fetchAvailableTopics = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setIsLoading(true);
      socket.send(JSON.stringify({
        type: 'get_topics'
      }));
    }
  };

  // Handle topics response
  const handleTopicsResponse = (data) => {
    setIsLoading(false);
    if (data.available_topics) {
      setAvailableTopics(data.available_topics);
    } else if (data.message === 'No topics have been received yet.') {
      // Use mock data as fallback
      setAvailableTopics([
        "sensor/temperature",
        "sensor/humidity",
        "device/status",
        "sensor/pressure"
      ]);
    } else {
      console.error('Invalid topics response:', data);
      setErrorMessage('Failed to fetch topics');
    }
  };

  // Establish MQTT connection
  const handleConnect = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setIsLoading(true);
      setErrorMessage('');
      
      socket.send(JSON.stringify({
        type: 'connect',
        params: {
          broker,
          port,
          username: username || undefined,
          password: password || undefined
        }
      }));
    } else {
      connectWebSocket();
    }
  };

  // Remaining code will be in the next response
// Subscribe to selected topics
  const subscribeToTopics = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setIsLoading(true);
      setErrorMessage('');

      const subscriptions = selectedTopics.map(topic => ({
        topic,
        qos: 0 // Default QoS
      }));

      socket.send(JSON.stringify({
        type: 'subscribe',
        subscriptions
      }));
    }
  };

  // Handle subscribe response
  const handleSubscribeResponse = (data) => {
    setIsLoading(false);
    if (data.error) {
      setErrorMessage(data.error);
    } else {
      const newTopicMessages = {};
      data.messages.forEach(msg => {
        newTopicMessages[msg.topic] = msg.message;
      });
      
      setTopicMessages(newTopicMessages);
      setCurrentView('messages');
    }
  };

  // Publish a message
  const handlePublish = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setIsLoading(true);
      setPublishStatus('');
      setErrorMessage('');

      socket.send(JSON.stringify({
        type: 'publish',
        topic: publishTopic,
        message: publishMessage,
        qos: publishQoS
      }));
    }
  };

  // Handle publish response
  const handlePublishResponse = (data) => {
    setIsLoading(false);
    if (data.success) {
      setPublishStatus('Message published successfully!');
      // Clear form after successful publish
      setPublishTopic('');
      setPublishMessage('');
      setPublishQoS(0);
    } else {
      setErrorMessage(data.error || 'Failed to publish message');
    }
  };

  // Effect to establish WebSocket connection when modal opens
  useEffect(() => {
    if (isOpen) {
      connectWebSocket();
    }

    // Cleanup WebSocket on modal close
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isOpen, connectWebSocket]);

  // Render publish form (same as previous implementation)
  const renderPublishForm = () => (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-900 flex items-center">
          <Send className="mr-2 text-cyan-600" />
          Publish Message
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Topic</label>
          <input 
            type="text" 
            value={publishTopic}
            onChange={(e) => setPublishTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter topic"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea 
            value={publishMessage}
            onChange={(e) => setPublishMessage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter message"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">QoS Level</label>
          <select
            value={publishQoS}
            onChange={(e) => setPublishQoS(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            disabled={isLoading}
          >
            <option value={0}>0 - At most once</option>
            <option value={1}>1 - At least once</option>
            <option value={2}>2 - Exactly once</option>
          </select>
        </div>
      </div>

      {publishStatus && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {publishStatus}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button 
          onClick={() => setCurrentView('topics')}
          className="text-gray-600 hover:text-indigo-600 flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back
        </button>
        <button 
          onClick={handlePublish}
          disabled={!publishTopic || !publishMessage || isLoading}
          className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="mr-2" size={18} />
          {isLoading ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );

  // Render connection form (same as previous implementation)
  const renderConnectionForm = () => (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-900 flex items-center">
          <Cloud className="mr-2 text-cyan-600" />
          MQTT Connection
        </h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Broker</label>
          <input 
            type="text" 
            value={broker}
            onChange={(e) => setBroker(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter broker address"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Port</label>
          <input 
            type="number" 
            value={port}
            onChange={(e) => setPort(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter port number"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Username (Optional)</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter username"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Password (Optional)</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter password"
            disabled={isLoading}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-6">
        <button 
          onClick={handleConnect}
          disabled={isLoading}
          className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Link className="mr-2" size={18} />
          {isLoading ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    </div>
  );

  // Render topics view and topic messages view (same as previous implementation)
  const renderTopicsView = () => (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-indigo-900 flex items-center">
          <Wifi className="mr-2 text-cyan-600" />
          Available Topics
        </h2>
        <button 
          onClick={fetchAvailableTopics} 
          className="text-gray-500 hover:text-indigo-600 flex items-center transition-colors"
          disabled={isLoading}
        >
          <RefreshCcw size={18} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 py-8">
          <RefreshCcw className="animate-spin mx-auto mb-2" size={24} />
          Loading topics...
        </div>
      ) : errorMessage ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {errorMessage}
        </div>
      ) : availableTopics.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No topics available</div>
      ) : (
        <div className="space-y-2">
          {availableTopics.map(topic => (
            <div 
              key={topic} 
              className="flex items-center bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <input 
                type="checkbox" 
                checked={selectedTopics.includes(topic)}
                onChange={() => {
                  setSelectedTopics(prev => 
                    prev.includes(topic) 
                      ? prev.filter(t => t !== topic) 
                      : [...prev, topic]
                  );
                }}
                disabled={isLoading}
                className="mr-2 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <Globe className="mr-2 text-cyan-600" size={18} />
              <span className="flex-grow">{topic}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button 
          onClick={() => setCurrentView('connect')}
          disabled={isLoading}
          className="text-gray-600 hover:text-indigo-600 flex items-center transition-colors"
        >
          <X className="mr-2" size={18} />
          Back
        </button>
        <button 
          onClick={() => setCurrentView('publish')}
          disabled={isLoading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="mr-2" size={18} />
          Publish
        </button>

        <button 
          onClick={subscribeToTopics}
          disabled={selectedTopics.length === 0 || isLoading}
          className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Check className="mr-2" size={18} />
          Subscribe
        </button>
      </div>
    </div>
  );

  const renderTopicMessagesView = () => (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-900 flex items-center">
          <Wifi className="mr-2 text-cyan-600" />
          Topic Messages
        </h2>
      </div>

      {Object.entries(topicMessages).length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No messages received yet
        </div>
      ) : (
        Object.entries(topicMessages).map(([topic, message]) => (
          <div 
            key={topic} 
            className="bg-gray-100 p-3 rounded-md border-l-4 border-cyan-600"
          >
            <div className="text-sm font-medium text-gray-600">{topic}</div>
            <div className="mt-1 text-indigo-900">{message}</div>
          </div>
        ))
      )}

      <div className="flex justify-between mt-6">
        <button 
          onClick={() => setCurrentView('topics')}
          className="text-gray-600 hover:text-indigo-600 flex items-center transition-colors"
        >
          <X className="mr-2" size={18} />
          Back
        </button>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch(currentView) {
      case 'connect': 
        return renderConnectionForm();
      case 'topics': 
        return renderTopicsView();
      case 'messages': 
        return renderTopicMessagesView();
      case 'publish':
        return renderPublishForm();
      default: 
        return renderConnectionForm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default MQTTModal;