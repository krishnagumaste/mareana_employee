import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

export default function View({ open, setOpen, rowData }) {
  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderData = (data) => {
    return Object.entries(data).map(([key, value]) => (
      <li key={key} className="flex justify-between border-b border-gray-200 py-2">
        <strong className="text-gray-800">{capitalizeFirstLetter(key)}</strong>
        <span className="text-gray-600">{formatValue(value)}</span>
      </li>
    ));
  };

  // Function to format the value for display
  const formatValue = (value) => {
    // Check if the value is an object or array and stringify it accordingly
    if (typeof value === 'object' && value !== null) {
      return Array.isArray(value) ? value.join(', ') : JSON.stringify(value, null, 2);
    }
    return value; // Return the value directly if it's not an object
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div className="bg-white px-6 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="text-center sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                  Information
                </DialogTitle>
                <div className="mt-4">
                  <ul className="list-disc pl-6 pr-6 text-sm text-gray-700">
                    {rowData && Object.keys(rowData).length > 0 ? (
                      renderData(rowData)
                    ) : (
                      <li className="py-2">No data available.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className='inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-white hover:text-indigo-600 hover:ring-indigo-600'
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
