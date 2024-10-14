import React from 'react';

const DataRow = ({ data, headers, onViewClick, onEditClick }) => {
  return (
    <tr>
      {headers.map((header, index) => (
        <td key={index} className="whitespace-nowrap px-4 py-2 text-gray-700">
          {data[header]} {/* Access the data using the header */}
        </td>
      ))}
      <td className="whitespace-nowrap px-4 py-2 flex space-x-2">
        <button
          onClick={() => onViewClick(data)} // Call the view handler with the row data
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-white hover:text-indigo-600 hover:ring-indigo-600"
        >
          View
        </button>
        <button
          onClick={() => onEditClick(data)} // Call the edit handler with the row data
          className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-green-600 hover:bg-white hover:text-green-600 hover:ring-green-600"
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

export default DataRow;
