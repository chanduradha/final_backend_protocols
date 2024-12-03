// this model imported inside the NetworkSettingModal component
import React from 'react';

const ResponseTable = ({ responseLog }) => {
  const latestResponse = responseLog.length > 0 ? responseLog[responseLog.length - 1] : null;

  const renderValues = (data) => {
    if (!data.values || !Array.isArray(data.values)) return null;
    
    return (
      <div className="overflow-y-auto max-h-64">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Index</th>
              <th className="px-4 py-2 text-left font-medium">Value</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.values.map((value, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2 text-gray-600">{index}</td>
                <td className="px-4 py-2 font-mono">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!latestResponse) {
    return (
      <div className="border rounded p-2">
        <h3 className="font-medium">Response Data</h3>
        <div className="p-4 text-center text-gray-500">No response data available</div>
      </div>
    );
  }

  return (
    <div className="border rounded p-2">
      <h3 className="font-medium mb-2">Latest Response</h3>
      <div className="bg-gray-50 rounded p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{latestResponse.timestamp}</span>
          <span className={`text-sm px-2 py-1 rounded ${
            latestResponse.data.status === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {latestResponse.data.status}
          </span>
        </div>
        
        {latestResponse.data.connection_id && (
          <div className="text-sm mb-2">
            <span className="font-medium">Connection ID: </span>
            <span className="font-mono">{latestResponse.data.connection_id}</span>
          </div>
        )}
        
        {latestResponse.data.values && renderValues(latestResponse.data)}
        
        {latestResponse.data.message && (
          <div className="text-sm text-red-600 mt-2">
            Error: {latestResponse.data.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseTable;