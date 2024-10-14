import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector to access state
import axios from 'axios';
import { updateData } from '../redux/csvSlice'; // Adjust the import according to your path

export default function Edit({ open, setOpen, rowData }) {
  const dispatch = useDispatch();
  const csvData = useSelector((state) => state.csv.data); // Get the entire CSV data from the store
  const csvFilename = useSelector((state) => state.csv.filename); // Get filename from Redux
  
  const [formData, setFormData] = useState(rowData); // Initialize form data with the row data

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Update specific field
    });
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      const filename = csvFilename; // Set the filename according to your logic

      // Prepare the updated dataset
      const updatedData = csvData.map(item => 
        item.id === formData.id ? formData : item // Update only the edited item
      );

      // Send updated data to the server
      const response = await axios.post('http://localhost:8000/addcsvdata', {
        filename: filename,
        token: token,
        csvData: updatedData, // Send the entire updated data array
      });

      // Handle response as needed, e.g., show success message
      console.log(response.data.message); // You can show this to the user

      // Update Redux store
      dispatch(updateData(formData)); // Dispatch action to update the Redux store
      setOpen(false); // Close the dialog
    } catch (error) {
      console.error('Error updating data:', error);
      alert('An error occurred while updating data. Please try again.');
    }
  };

  const renderInputs = () => {
    return Object.entries(formData).map(([key, value]) => (
      <div key={key} className="mb-4">
        <label className="block text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
        <input
          type="text"
          name={key}
          value={value}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
    ));
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-6 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="text-center sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                  Edit Information
                </DialogTitle>
                <div className="mt-4">
                  {renderInputs()}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-white hover:text-indigo-600 hover:ring-indigo-600"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mr-3 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-red-600 hover:bg-white hover:text-red-600 hover:ring-red-600"
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
