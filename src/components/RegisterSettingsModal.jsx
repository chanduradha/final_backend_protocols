

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const RegisterSettingsModal = ({ isOpen, onClose, connectionDetails, socket }) => {
  // State management for form fields and data
  const [selectedFunction, setSelectedFunction] = useState('');
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [combineRegisters, setCombineRegisters] = useState(false);
  const [endianness, setEndianness] = useState('big');
  const [registerData, setRegisterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exportFormat, setExportFormat] = useState('csv');

  // Available Modbus function codes
  const functionCodes = [
    { code: '0x01', description: 'Read Coil Status' },
    { code: '0x02', description: 'Read Input Status' },
    { code: '0x03', description: 'Read Holding Registers' },
    { code: '0x04', description: 'Read Input Registers' },
    { code: '0x05', description: 'Force Single Coil' },
    { code: '0x06', description: 'Preset Single Register' },
    { code: '0x0F', description: 'Force Multiple Coils' },
    { code: '0x10', description: 'Preset Multiple Registers' }
  ];

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'read_status') {
          setLoading(false);
          if (data.status === 'success') {
            setRegisterData(data.data);
            setError(null);
          } else {
            setError(data.message || 'Failed to read registers');
            setRegisterData(null);
          }
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
        setError('Failed to process server response');
        setLoading(false);
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket]);

  // Reset form
  const resetForm = () => {
    setSelectedFunction('');
    setStartAddress('');
    setEndAddress('');
    setCombineRegisters(false);
    setEndianness('big');
    setRegisterData(null);
    setError(null);
  };

  // Validate form inputs
  const validateForm = () => {
    if (!selectedFunction) {
      setError('Please select a function code');
      return false;
    }

    if (!startAddress || !endAddress) {
      setError('Please enter both start and end addresses');
      return false;
    }

    const start = parseInt(startAddress);
    const end = parseInt(endAddress);

    if (isNaN(start) || isNaN(end)) {
      setError('Addresses must be valid numbers');
      return false;
    }

    if (start < 0 || end < 0) {
      setError('Addresses cannot be negative');
      return false;
    }

    if (start > end) {
      setError('Start address must be less than or equal to end address');
      return false;
    }

    if (end - start > 125) {
      setError('Maximum range of 125 registers exceeded');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!socket) {
      setError('No WebSocket connection available');
      return;
    }

    if (!connectionDetails) {
      setError('No active Modbus connection');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        type: 'read_registers',
        data: {
          function_code: parseInt(selectedFunction, 16),
          register_range_start: parseInt(startAddress),
          register_range_end: parseInt(endAddress),
          combine_registers: combineRegisters,
          endianess: endianness,
          connection: {
            port: connectionDetails.port,
            slave_address: connectionDetails.slaveId,
            baudrate: connectionDetails.baudRate,
            parity: connectionDetails.parity,
            stopbits: connectionDetails.stopBits
          }
        }
      };

      socket.send(JSON.stringify(payload));
    } catch (err) {
      console.error('Error sending request:', err);
      setError(err.message || 'Failed to send request');
      setLoading(false);
    }
  };

  // Export register data
  const exportData = () => {
    if (!registerData || registerData.length === 0) {
      setError('No data to export');
      return;
    }

    try {
      let content = '';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      let filename = `register-data-${timestamp}`;

      if (exportFormat === 'csv') {
        content = 'Register Address,Value\n';
        content += registerData
          .map(item => `${item.register_address},${item.value}`)
          .join('\n');
        filename += '.csv';
      } else {
        content = JSON.stringify(registerData, null, 2);
        filename += '.json';
      }

      const blob = new Blob([content], { 
        type: exportFormat === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-900 rounded-t-lg">
          <h2 className="text-xl font-semibold text-white">Register Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Connection Status */}
          {!connectionDetails && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <p className="text-yellow-700 text-sm">
                No active Modbus connection. Please ensure device is connected.
              </p>
            </div>
          )}

          {/* Function Code Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Function Code
            </label>
            <select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select Function Code</option>
              {functionCodes.map((func) => (
                <option key={func.code} value={func.code}>
                  {func.code} - {func.description}
                </option>
              ))}
            </select>
          </div>

          {/* Register Address Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Address
              </label>
              <input
                type="number"
                value={startAddress}
                onChange={(e) => setStartAddress(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Address
              </label>
              <input
                type="number"
                value={endAddress}
                onChange={(e) => setEndAddress(e.target.value)}
                placeholder="100"
                min="0"
                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Combine Registers
              </label>
              <select
                value={combineRegisters.toString()}
                onChange={(e) => setCombineRegisters(e.target.value === 'true')}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="false">False</option>
                <option value="true">True</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endianness
              </label>
              <select
                value={endianness}
                onChange={(e) => setEndianness(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="big">Big Endian</option>
                <option value="little">Little Endian</option>
              </select>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Register Data Display */}
          {registerData && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Register Values</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md p-1"
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                  <button
                    onClick={exportData}
                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Export
                  </button>
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Address
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registerData.map((item) => (
                      <tr key={item.register_address}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.register_address}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={resetForm}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !connectionDetails}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Read Registers'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSettingsModal;