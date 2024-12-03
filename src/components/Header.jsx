// import React, { useState } from 'react';
// import { 
//   ChevronDown, 
//   ChevronRight, 
//   Settings, 
//   Cable, 
//   Globe, 
//   Radio, 
//   Cloud,
//   Wifi,
//   Database,
//   Network
// } from 'lucide-react';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [expandedItems, setExpandedItems] = useState({});

//   // Menu items remain the same as your original code
//   const menuItems = [
//     {
//       icon: <Database size={20} />,
//       text: "Modbus",
//       subItems: [
//         {
//           text: "Modbus RTU",
//           subItems: [
//             { text: "Serial Configuration" },
//             { text: "Device Mapping" },
//             { text: "Register Settings" }
//           ]
//         },
//         {
//           text: "Modbus TCP/IP",
//           subItems: [
//             { text: "Network Settings" },
//             { text: "Device Discovery" },
//             { text: "Port Configuration" }
//           ]
//         }
//       ]
//     },
//     {
//       icon: <Globe size={20} />,
//       text: "HTTP Protocol",
//       subItems: [
//         { text: "REST API" },
//         { text: "WebHooks" },
//         { text: "GraphQL" }
//       ]
//     },
//     {
//       icon: <Cloud size={20} />,
//       text: "MQTT",
//       subItems: [
//         { text: "Broker Settings" },
//         { text: "Topic Management" },
//         { text: "QoS Configuration" }
//       ]
//     },
//     {
//       icon: <Network size={20} />,
//       text: "OPC UA",
//       subItems: [
//         { text: "Server Configuration" },
//         { text: "Security Settings" },
//         { text: "Node Management" }
//       ]
//     },
//     {
//       icon: <Radio size={20} />,
//       text: "BACnet",
//       subItems: [
//         { text: "Device Objects" },
//         { text: "Services Configuration" },
//         { text: "Network Settings" }
//       ]
//     },
//     {
//       icon: <Wifi size={20} />,
//       text: "Wireless",
//       subItems: [
//         { text: "WiFi Configuration" },
//         { text: "Bluetooth Settings" },
//         { text: "ZigBee Setup" }
//       ]
//     }
//   ];

//   const toggleExpand = (itemPath) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [itemPath]: !prev[itemPath]
//     }));
//   };

//   const renderMenuItem = (item, index, path = '') => {
//     const currentPath = path ? `${path}-${item.text}` : item.text;
//     const isExpanded = expandedItems[currentPath];
//     const hasSubItems = item.subItems && item.subItems.length > 0;
    
//     return (
//       <div key={currentPath} className="w-full">
//         <button
//           onClick={() => toggleExpand(currentPath)}
//           className={`w-full flex items-center px-4 py-3 text-gray-200 hover:bg-indigo-900/50 transition-all duration-200
//             ${isExpanded ? 'bg-indigo-900/40' : ''}
//             ${path ? 'pl-' + (path.split('-').length + 2) * 4 : ''}`}
//         >
//           {item.icon && <span className="mr-3 text-cyan-400">{item.icon}</span>}
//           <span className="flex-1 text-left">{item.text}</span>
//           {hasSubItems && (
//             <span className="ml-2 text-cyan-400">
//               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//             </span>
//           )}
//         </button>
        
//         {isExpanded && hasSubItems && (
//           <div className="bg-gradient-to-r from-indigo-950 to-blue-950 border-l border-indigo-700/30 ml-4">
//             {item.subItems.map((subItem, subIndex) => 
//               renderMenuItem(subItem, subIndex, currentPath)
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar for larger screens */}
//       <div className="hidden md:flex flex-col w-72 bg-gradient-to-b from-blue-950 via-indigo-950 to-blue-950 text-white shadow-xl">
//         <div className="p-4 text-xl font-bold border-b border-indigo-700/30 bg-gradient-to-r from-indigo-900 to-blue-900">
//           <span className="text-cyan-400">CMTI</span>
//           <span className="text-xs ml-2 text-cyan-200">Protocol Manager</span>
//         </div>
//         <nav className="flex-1 overflow-y-auto custom-scrollbar">
//           {menuItems.map((item, index) => renderMenuItem(item, index))}
//         </nav>
//         <div className="p-4 border-t border-indigo-700/30 bg-gradient-to-r from-indigo-900 to-blue-900">
//           <button className="flex items-center text-cyan-300 hover:text-cyan-100 transition-colors duration-200">
//             <Settings size={20} className="mr-2" />
//             <span>Settings</span>
//           </button>
//         </div>
//       </div>

//       {/* Mobile header */}
//       <div className="flex flex-col w-full">
//         <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-blue-950 to-indigo-950 text-white">
//           <div className="text-xl font-bold">
//             <span className="text-cyan-400">CMTI</span>
//           </div>
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="p-2 hover:bg-indigo-800/50 rounded-full transition-colors duration-200"
//           >
//             {isMenuOpen ? <Settings size={24} className="text-cyan-400" /> : <Settings size={24} className="text-cyan-400" />}
//           </button>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="md:hidden absolute top-16 left-0 right-0 bg-gradient-to-b from-blue-950 via-indigo-950 to-blue-950 text-white z-50 shadow-xl">
//             <nav className="max-h-[80vh] overflow-y-auto custom-scrollbar">
//               {menuItems.map((item, index) => renderMenuItem(item, index))}
//             </nav>
//           </div>
//         )}

//         {/* Main content area */}
//         <main className="flex-1 p-4 bg-gradient-to-br from-slate-100 to-blue-50">
//           <div className="max-w-7xl mx-auto">
//             <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-950">
//               Protocol Dashboard
//             </h1>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Header;


// '''''below is fisrt correct code'''''''''
// import React, { useState } from 'react';

// import { 
//   ChevronDown, 
//   ChevronRight, 
//   Settings, 
//   Cable, 
//   Globe, 
//   Radio, 
//   Cloud,
//   Wifi,
//   Database,
//   Network,
//   Factory,
//   Cpu
// } from 'lucide-react';



// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [expandedItems, setExpandedItems] = useState({});

//   const menuItems = [
//     {
//       icon: <Factory size={20} />,
//       text: "Industry Protocols",
//       subItems: [
//         {
//           icon: <Database size={20} />,
//           text: "Modbus",
//           subItems: [
//             {
//               text: "Modbus RTU",
//               subItems: [
//                 { text: "Serial Configuration" },
//                 { text: "Device Mapping" },
//                 { text: "Register Settings" }
//               ]
//             },
//             {
//               text: "Modbus TCP/IP",
//               subItems: [
//                 { text: "Network Settings" },
//                 { text: "Device Discovery" },
//                 { text: "Port Configuration" }
//               ]
//             }
//           ]
//         },
//         {
//           icon: <Cpu size={20} />,
//           text: "EtherCAT",
//           subItems: [
//             { text: "Network Configuration" },
//             { text: "Slave Configuration" },
//             { text: "Process Data Mapping" }
//           ]
//         },
//         {
//           icon: <Network size={20} />,
//           text: "OPC UA",
//           subItems: [
//             { text: "Server Configuration" },
//             { text: "Security Settings" },
//             { text: "Node Management" }
//           ]
//         },
//         {
//           icon: <Cable size={20} />,
//           text: "PROFINET",
//           subItems: [
//             { text: "Device Configuration" },
//             { text: "IO Controller Settings" },
//             { text: "Network Topology" }
//           ]
//         },
//         {
//           icon: <Cable size={20} />,
//           text: "PROFIBUS",
//           subItems: [
//             { text: "Master Configuration" },
//             { text: "Slave Parameters" },
//             { text: "Bus Diagnostics" }
//           ]
//         },
//         {
//           icon: <Network size={20} />,
//           text: "CANopen",
//           subItems: [
//             { text: "Node Configuration" },
//             { text: "PDO Mapping" },
//             { text: "Network Management" }
//           ]
//         },
//         {
//           icon: <Radio size={20} />,
//           text: "BACnet",
//           subItems: [
//             { text: "Device Objects" },
//             { text: "Services Configuration" },
//             { text: "Network Settings" }
//           ]
//         }
//       ]
//     },
//     {
//       icon: <Cloud size={20} />,
//       text: "IoT Protocols",
//       subItems: [
//         {
//           icon: <Globe size={20} />,
//           text: "HTTP Protocol",
//           subItems: [
//             { text: "REST API" },
//             { text: "WebHooks" },
//             { text: "GraphQL" }
//           ]
//         },
//         {
//           icon: <Cloud size={20} />,
//           text: "MQTT",
//           subItems: [
//             { text: "Broker Settings" },
//             { text: "Topic Management" },
//             { text: "QoS Configuration" }
//           ]
//         },
//         {
//           icon: <Wifi size={20} />,
//           text: "Wireless",
//           subItems: [
//             { text: "WiFi Configuration" },
//             { text: "Bluetooth Settings" },
//             { text: "Lorawan" }
//           ]
//         }
//       ]
//     }
//   ];

//   const toggleExpand = (itemPath) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [itemPath]: !prev[itemPath]
//     }));
//   };

//   const renderMenuItem = (item, index, path = '') => {
//     const currentPath = path ? `${path}-${item.text}` : item.text;
//     const isExpanded = expandedItems[currentPath];
//     const hasSubItems = item.subItems && item.subItems.length > 0;
    
//     return (
//       <div key={currentPath} className="w-full">
//         <button
//           onClick={() => toggleExpand(currentPath)}
//           className={`w-full flex items-center px-4 py-3 text-gray-200 hover:bg-indigo-900/50 transition-all duration-200
//             ${isExpanded ? 'bg-indigo-900/40' : ''}
//             ${path ? 'pl-' + (path.split('-').length + 2) * 4 : ''}`}
//         >
//           {item.icon && <span className="mr-3 text-cyan-400">{item.icon}</span>}
//           <span className="flex-1 text-left">{item.text}</span>
//           {hasSubItems && (
//             <span className="ml-2 text-cyan-400">
//               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//             </span>
//           )}
//         </button>
        
//         {isExpanded && hasSubItems && (
//           <div className="bg-gradient-to-r from-indigo-950 to-blue-950 border-l border-indigo-700/30 ml-4">
//             {item.subItems.map((subItem, subIndex) => 
//               renderMenuItem(subItem, subIndex, currentPath)
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar for larger screens */}
//       <div className="hidden md:flex flex-col w-72 bg-gradient-to-b from-blue-950 via-indigo-950 to-blue-950 text-white shadow-xl">
//         <div className="p-4 text-xl font-bold border-b border-indigo-700/30 bg-gradient-to-r from-indigo-900 to-blue-900">
//           <span className="text-cyan-400">CMTI</span>
//           <span className="text-xs ml-2 text-cyan-200">Protocol Manager</span>
//         </div>
//         <nav className="flex-1 overflow-y-auto custom-scrollbar">
//           {menuItems.map((item, index) => renderMenuItem(item, index))}
//         </nav>
//         <div className="p-4 border-t border-indigo-700/30 bg-gradient-to-r from-indigo-900 to-blue-900">
//           <button className="flex items-center text-cyan-300 hover:text-cyan-100 transition-colors duration-200">
//             <Settings size={20} className="mr-2" />
//             <span>Settings</span>
//           </button>
//         </div>
//       </div>

//       {/* Mobile header */}
//       <div className="flex flex-col w-full">
//         <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-blue-950 to-indigo-950 text-white">
//           <div className="text-xl font-bold">
//             <span className="text-cyan-400">CMTI</span>
//           </div>
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="p-2 hover:bg-indigo-800/50 rounded-full transition-colors duration-200"
//           >
//             {isMenuOpen ? <Settings size={24} className="text-cyan-400" /> : <Settings size={24} className="text-cyan-400" />}
//           </button>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="md:hidden absolute top-16 left-0 right-0 bg-gradient-to-b from-blue-950 via-indigo-950 to-blue-950 text-white z-50 shadow-xl">
//             <nav className="max-h-[80vh] overflow-y-auto custom-scrollbar">
//               {menuItems.map((item, index) => renderMenuItem(item, index))}
//             </nav>
//           </div>
//         )}

//         {/* Main content area */}
//         <main className="flex-1 p-4 bg-gradient-to-br from-slate-100 to-blue-50">
//           <div className="max-w-7xl mx-auto">
//             <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-950">
//               Protocol Dashboard
//             </h1>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Header;

//'''''''popup window opening code below'''''''//


import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Settings, 
  Cable, 
  Globe, 
  Radio, 
  Cloud,
  Wifi,
  Database,
  Network,
  Factory,
  Cpu
} from 'lucide-react';
import SerialConfigModal from './SerialConfigModal';
// import RegisterSettingsModal from './RegisterSettingsModal';
import NetworkSettingsModal from './NetworkSettingsModal';
import OPCUAServerModal from './OPCUAServerModal';
import RESTAPIModal from './RESTAPIModal';
import ProfinetDeviceConfigModal from './ProfinetDeviceConfigModal';
import MQTTModal from './MQTTModal'; // Import the new modal

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [isSerialConfigOpen, setIsSerialConfigOpen] = useState(false);
  // const [isRegisterSettingsOpen, setIsRegisterSettingsOpen] = useState(false);
  const [isNetworkSettingsOpen, setIsNetworkSettingsOpen] = useState(false);
  const [isOPCUAServerConfigOpen, setIsOPCUAServerConfigOpen] = useState(false);
  const [isRESTAPIModalOpen, setIsRESTAPIModalOpen] = useState(false); // New state for REST API modal
  const [isProfinetDeviceConfigOpen, setIsProfinetDeviceConfigOpen] = useState(false);
  const [isMQTTModalOpen, setIsMQTTModalOpen] = useState(false);


  const menuItems = [
    {
      icon: <Factory size={20} />,
      text: "Industry Protocols",
      subItems: [
        {
          icon: <Database size={20} />,
          text: "Modbus",
          subItems: [
            {
              text: "Modbus RTU",
              subItems: [
                { 
                  text: "Modbus RS-232/485",
                  onClick: () => setIsSerialConfigOpen(true)
                },
                // { text: "Device Mapping" },
                // { 
                //     text: "Register Settings",
                //     onClick: () => setIsRegisterSettingsOpen(true)
                //   }
              ]
            },
            {
              text: "Modbus TCP/IP",
              subItems: [
                { 
                    text: "Network Settings",
                    onClick: () => setIsNetworkSettingsOpen(true)
                  },
                // { text: "Device Discovery" },
                // { text: "Port Configuration" }
              ]
            }
          ]
        },
       
        {
          icon: <Network size={20} />,
          text: "OPC UA",
          subItems: [
            { 
              text: "Server Configuration",
              onClick: () => setIsOPCUAServerConfigOpen(true)
            },
        
            // { text: "Security Settings" },
            // { text: "Node Management" }
          ]
        },
        {
          icon: <Cable size={20} />,
          text: "PROFINET",
          subItems: [
            { 
              text: "Device Configuration", 
              onClick: () => setIsProfinetDeviceConfigOpen(true) 
            },
            // { text: "IO Controller Settings" },
            // { text: "Network Topology" }
          ]
        },
        {
          icon: <Cable size={20} />,
          text: "PROFIBUS",
          subItems: [
            { text: "Master Configuration" },
            { text: "Slave Parameters" },
            { text: "Bus Diagnostics" }
          ]
        },
        {
          icon: <Cpu size={20} />,
          text: "EtherCAT",
          subItems: [
            { text: "Network Configuration" },
            { text: "Slave Configuration" },
            { text: "Process Data Mapping" }
          ]
        },
        {
          icon: <Network size={20} />,
          text: "CANopen",
          subItems: [
            { text: "Node Configuration" },
            { text: "PDO Mapping" },
            { text: "Network Management" }
          ]
        },
        {
          icon: <Radio size={20} />,
          text: "BACnet",
          subItems: [
            { text: "Device Objects" },
            { text: "Services Configuration" },
            { text: "Network Settings" }
          ]
        }
      ]
    },
    {
      icon: <Cloud size={20} />,
      text: "IoT Protocols",
      subItems: [
        {
          icon: <Globe size={20} />,
          text: "HTTP Protocol",
          subItems: [
            { 
              text: "HTTP REQUEST",
              onClick: () => setIsRESTAPIModalOpen(true) // Add this state and handler
            },
            // { text: "WebHooks" },
            // { text: "GraphQL" }
          ]
        },
        {
          icon: <Cloud size={20} />,
          text: "MQTT",
          subItems: [
            { 
              text: " MQTT Connection", 
              onClick: () => setIsMQTTModalOpen(true) 
            },
            // { text: "Topic Management" },
            // { text: "QoS Configuration" }
          ]
        },
        {
          icon: <Wifi size={20} />,
          text: "Wireless",
          subItems: [
            { text: "WiFi Configuration" },
            { text: "Bluetooth Settings" },
            { text: "Lorawan" }
          ]
        }
      ]
    }
  ];

  const toggleExpand = (itemPath) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemPath]: !prev[itemPath]
    }));
  };

  const renderMenuItem = (item, index, path = '') => {
    const currentPath = path ? `${path}-${item.text}` : item.text;
    const isExpanded = expandedItems[currentPath];
    const hasSubItems = item.subItems && item.subItems.length > 0;
    
    return (
      <div key={currentPath} className="w-full">
        <button
          onClick={() => {
            if (item.onClick) {
              item.onClick();
            } else {
              toggleExpand(currentPath);
            }
          }}
          className={`w-full flex items-center px-4 py-3 text-gray-200 hover:bg-indigo-900/50 transition-all duration-200
            ${isExpanded ? 'bg-indigo-900/40' : ''}
            ${path ? 'pl-' + (path.split('-').length + 2) * 4 : ''}`}
        >
          {item.icon && <span className="mr-3 text-cyan-400">{item.icon}</span>}
          <span className="flex-1 text-left">{item.text}</span>
          {hasSubItems && (
            <span className="ml-2 text-cyan-400">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>
        
        {isExpanded && hasSubItems && (
          <div className="bg-gradient-to-r from-indigo-950 to-blue-950 border-l border-indigo-700/30 ml-4">
            {item.subItems.map((subItem, subIndex) => 
              renderMenuItem(subItem, subIndex, currentPath)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex flex-col w-72 bg-gradient-to-b from-blue-950 via-indigo-950 to-blue-950 text-white shadow-xl">
        <div className="p-4 text-xl font-bold border-b border-indigo-700/30 bg-gradient-to-r from-indigo-900 to-blue-900">
          <span className="text-cyan-400">CMTI</span>
          <span className="text-xs ml-2 text-cyan-200">Protocol Manager</span>
        </div>
        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </nav>
        <div className="p-4 border-t border-indigo-700/30 bg-gradient-to-r from-indigo-900 to-blue-900">
          <button className="flex items-center text-cyan-300 hover:text-cyan-100 transition-colors duration-200">
            <Settings size={20} className="mr-2" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="flex flex-col w-full">
        <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-blue-950 to-indigo-950 text-white">
          <div className="text-xl font-bold">
            <span className="text-cyan-400">CMTI</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-indigo-800/50 rounded-full transition-colors duration-200"
          >
            {isMenuOpen ? <Settings size={24} className="text-cyan-400" /> : <Settings size={24} className="text-cyan-400" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gradient-to-b from-blue-950 via-indigo-950 to-blue-950 text-white z-50 shadow-xl">
            <nav className="max-h-[80vh] overflow-y-auto custom-scrollbar">
              {menuItems.map((item, index) => renderMenuItem(item, index))}
            </nav>
          </div>
        )}

        {/* Main content area */}
        <main className="flex-1 bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="w-full">
    {/* Header Box */}
       <div className="bg-white shadow-sm border-b border-indigo-100">
      {/* Header Title Section */}
      <div className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold text-indigo-950">
              Protocol Dashboard
            </h1>
            {/* <p className="text-sm text-gray-600">
              Monitor and manage your industrial protocols
            </p> */}
          </div>
          <div className="flex items-center">
            <img 
              src="./kk.png" 
              alt="CMTI Logo" 
              className="h-12"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
      </div>

      

      {/* Serial Configuration Modal */}
      <SerialConfigModal 
        isOpen={isSerialConfigOpen}
        onClose={() => setIsSerialConfigOpen(false)}
      />

{/* <RegisterSettingsModal 
  isOpen={isRegisterSettingsOpen}
  onClose={() => setIsRegisterSettingsOpen(false)}
/> */}



<NetworkSettingsModal 
  isOpen={isNetworkSettingsOpen}
  onClose={() => setIsNetworkSettingsOpen(false)}
/>

<OPCUAServerModal 
  isOpen={isOPCUAServerConfigOpen}
  onClose={() => setIsOPCUAServerConfigOpen(false)}
/>

<RESTAPIModal 
  isOpen={isRESTAPIModalOpen}
  onClose={() => setIsRESTAPIModalOpen(false)}
/>

<MQTTModal 
        isOpen={isMQTTModalOpen}
        onClose={() => setIsMQTTModalOpen(false)}
      />
{isProfinetDeviceConfigOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <ProfinetDeviceConfigModal 
            onClose={() => setIsProfinetDeviceConfigOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Header;

// import React, { useState } from 'react';
// import { 
//   ChevronDown, 
//   ChevronRight, 
//   Settings, 
//   Cable, 
//   Globe, 
//   Radio, 
//   Cloud,
//   Wifi,
//   Database,
//   Network,
//   Factory,
//   Cpu
// } from 'lucide-react';
// import SerialConfigModal from './SerialConfigModal';
// import RegisterSettingsModal from './RegisterSettingsModal';
// import NetworkSettingsModal from './NetworkSettingsModal';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [expandedItems, setExpandedItems] = useState({});
//   const [isSerialConfigOpen, setIsSerialConfigOpen] = useState(false);
//   const [isRegisterSettingsOpen, setIsRegisterSettingsOpen] = useState(false);
//   const [isNetworkSettingsOpen, setIsNetworkSettingsOpen] = useState(false);
//   const [isSerialConnected, setIsSerialConnected] = useState(false);

//   const handleSerialConnection = (connected) => {
//     setIsSerialConnected(connected);
//     if (connected) {
//       setIsSerialConfigOpen(false);
//       setIsRegisterSettingsOpen(true);
//     }
//   };

//   const menuItems = [
//     {
//       icon: <Factory size={20} />,
//       text: "Industry Protocols",
//       subItems: [
//         {
//           icon: <Database size={20} />,
//           text: "Modbus",
//           subItems: [
//             {
//               text: "Modbus RTU",
//               subItems: [
//                 { 
//                   text: "Serial Configuration",
//                   onClick: () => {
//                     setIsSerialConfigOpen(true);
//                     if (!isSerialConnected) {
//                       setIsRegisterSettingsOpen(false);
//                     }
//                   }
//                 },
//                 { text: "Device Mapping" },
//                 { 
//                   text: "Register Settings",
//                   onClick: () => {
//                     if (isSerialConnected) {
//                       setIsRegisterSettingsOpen(true);
//                     }
//                   }
//                 }
//               ]
//             },
//             {
//               text: "Modbus TCP/IP",
//               subItems: [
//                 { 
//                   text: "Network Settings",
//                   onClick: () => setIsNetworkSettingsOpen(true)
//                 },
//                 { text: "Device Discovery" },
//                 { text: "Port Configuration" }
//               ]
//             }
//           ]
//         },
//         {
//           icon: <Cpu size={20} />,
//           text: "EtherCAT",
//           subItems: [
//             { text: "Network Configuration" },
//             { text: "Slave Configuration" },
//             { text: "Process Data Mapping" }
//           ]
//         },
//         {
//           icon: <Network size={20} />,
//           text: "OPC UA",
//           subItems: [
//             { text: "Server Configuration" },
//             { text: "Security Settings" },
//             { text: "Node Management" }
//           ]
//         },
//         {
//           icon: <Cable size={20} />,
//           text: "PROFINET",
//           subItems: [
//             { text: "Device Configuration" },
//             { text: "IO Controller Settings" },
//             { text: "Network Topology" }
//           ]
//         },
//         {
//           icon: <Cable size={20} />,
//           text: "PROFIBUS",
//           subItems: [
//             { text: "Master Configuration" },
//             { text: "Slave Parameters" },
//             { text: "Bus Diagnostics" }
//           ]
//         },
//         {
//           icon: <Network size={20} />,
//           text: "CANopen",
//           subItems: [
//             { text: "Node Configuration" },
//             { text: "PDO Mapping" },
//             { text: "Network Management" }
//           ]
//         },
//         {
//           icon: <Radio size={20} />,
//           text: "BACnet",
//           subItems: [
//             { text: "Device Objects" },
//             { text: "Services Configuration" },
//             { text: "Network Settings" }
//           ]
//         }
//       ]
//     },
//     {
//       icon: <Cloud size={20} />,
//       text: "IoT Protocols",
//       subItems: [
//         {
//           icon: <Globe size={20} />,
//           text: "HTTP Protocol",
//           subItems: [
//             { text: "REST API" },
//             { text: "WebHooks" },
//             { text: "GraphQL" }
//           ]
//         },
//         {
//           icon: <Cloud size={20} />,
//           text: "MQTT",
//           subItems: [
//             { text: "Broker Settings" },
//             { text: "Topic Management" },
//             { text: "QoS Configuration" }
//           ]
//         },
//         {
//           icon: <Wifi size={20} />,
//           text: "Wireless",
//           subItems: [
//             { text: "WiFi Configuration" },
//             { text: "Bluetooth Settings" },
//             { text: "Lorawan" }
//           ]
//         }
//       ]
//     }
//   ];

//   const toggleExpand = (itemPath) => {
//     setExpandedItems(prev => ({
//       ...prev,
//       [itemPath]: !prev[itemPath]
//     }));
//   };

//   const renderMenuItem = (item, index, path = '') => {
//     const currentPath = path ? `${path}-${item.text}` : item.text;
//     const isExpanded = expandedItems[currentPath];
//     const hasSubItems = item.subItems && item.subItems.length > 0;
    
//     return (
//       <div key={currentPath} className="w-full">
//         <button
//           onClick={() => {
//             if (item.onClick) {
//               item.onClick();
//             } else {
//               toggleExpand(currentPath);
//             }
//           }}
//           className={`w-full flex items-center px-4 py-3 text-gray-200 hover:bg-indigo-900/50 transition-all duration-200
//             ${isExpanded ? 'bg-indigo-900/40' : ''}
//             ${path ? 'pl-' + (path.split('-').length + 2) * 4 : ''}`}
//         >
//           {item.icon && <span className="mr-3 text-cyan-400">{item.icon}</span>}
//           <span className="flex-1 text-left">{item.text}</span>
//           {hasSubItems && (
//             <span className="ml-2 text-cyan-400">
//               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//             </span>
//           )}
//         </button>
        
//         {isExpanded && hasSubItems && (
//           <div className="bg-gradient-to-r from-indigo-950 to-blue-950 border-l border-indigo-700/30 ml-4">
//             {item.subItems.map((subItem, subIndex) => 
//               renderMenuItem(subItem, subIndex, currentPath)
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="hidden md:flex flex-col w-72 bg-gradient-to-b from-blue-950 via-indigo-950 to-blue-950 text-white shadow-xl">
//         <div className="p-4 text-xl font-bold border-b border-indigo-700/30 bg-gradient-to-r from-indigo-900 to-blue-900">
//           <span className="text-cyan-400">CMTI</span>
//           <span className="text-xs ml-2 text-cyan-200">Protocol Manager</span>
//         </div>
//         <nav className="flex-1 overflow-y-auto custom-scrollbar">
//           {menuItems.map((item, index) => renderMenuItem(item, index))}
//         </nav>
//         <div className="p-4 border-t border-indigo-700/30 bg-gradient-to-r from-indigo-900 to-blue-900">
//           <button className="flex items-center text-cyan-300 hover:text-cyan-100 transition-colors duration-200">
//             <Settings size={20} className="mr-2" />
//             <span>Settings</span>
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col w-full">
//         <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-blue-950 to-indigo-950 text-white">
//           <div className="text-xl font-bold">
//             <span className="text-cyan-400">CMTI</span>
//           </div>
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="p-2 hover:bg-indigo-800/50 rounded-full transition-colors duration-200"
//           >
//             {isMenuOpen ? 
//               <Settings size={24} className="text-cyan-400" /> : 
//               <Settings size={24} className="text-cyan-400" />
//             }
//           </button>
//         </div>

//         {isMenuOpen && (
//           <div className="md:hidden absolute top-16 left-0 right-0 bg-gradient-to-b from-blue-950 via-indigo-950 to-blue-950 text-white z-50 shadow-xl">
//             <nav className="max-h-[80vh] overflow-y-auto custom-scrollbar">
//               {menuItems.map((item, index) => renderMenuItem(item, index))}
//             </nav>
//           </div>
//         )}

//         <main className="flex-1 bg-gradient-to-br from-slate-100 to-blue-50">
//           <div className="w-full">
//             <div className="bg-white shadow-sm border-b border-indigo-100">
//               <div className="px-6 py-3 bg-gradient-to-r from-indigo-50 to-blue-50">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-0.5">
//                     <h1 className="text-xl font-bold text-indigo-950">
//                       Protocol Dashboard
//                     </h1>
//                   </div>
//                   <div className="flex items-center">
//                     <img 
//                       src="./kk.png" 
//                       alt="CMTI Logo" 
//                       className="h-12"
//                       loading="lazy"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>

//       <SerialConfigModal 
//         isOpen={isSerialConfigOpen}
//         onClose={() => setIsSerialConfigOpen(false)}
//         onConnectionChange={handleSerialConnection}
//       />

//       <RegisterSettingsModal 
//         isOpen={isRegisterSettingsOpen && isSerialConnected}
//         onClose={() => setIsRegisterSettingsOpen(false)}
//       />

//       <NetworkSettingsModal 
//         isOpen={isNetworkSettingsOpen}
//         onClose={() => setIsNetworkSettingsOpen(false)}
//       />
//     </div>
//   );
// };

// export default Header;