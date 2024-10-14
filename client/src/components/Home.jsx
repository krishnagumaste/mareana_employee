import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilename, setCsvData } from '../redux/csvSlice';
import Display from './Display';
import axios from 'axios';
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';

const Home = () => {
    const [fileData, setFileData] = useState('');
    const [showDisplay, setShowDisplay] = useState(false);
    const dispatch = useDispatch();
    const csvFilename = useSelector((state) => state.csv.filename);
    const csvData = useSelector((state) => state.csv.data);

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
          const response = await axios.post('http://localhost:8000/user_data', { token: token });
          
          // Check the full response object
          console.log('Full response:', response);
          
          if (response.status === 200 && response.data.data && response.data.filename) {
              console.log('Data:', response.data);
              dispatch(setCsvData(response.data.data));
              dispatch(setFilename(response.data.filename));
              setShowDisplay(true);
          } else {
              console.log('Response received but data is missing or incorrect structure:', response.data);
          }
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };
  

    useEffect(() => {
        fetchUserData();
    }, []);

    const uploadToServer = async (parsedData) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8000/addcsvdata', {
                filename: csvFilename,
                token: token,
                csvData: parsedData,
            });
        } catch (error) {
            console.error('Error uploading data:', error);
            alert('An error occurred while uploading data. Please try again.');
        }
    };

    const parseCsv = (data) => {
        const rows = data.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',').map(header => header.trim());
        const parsedData = rows.slice(1).map(row => {
            const values = row.split(',');
            const rowObject = headers.reduce((obj, header, index) => {
                obj[header] = values[index] ? values[index].trim() : '';
                return obj;
            }, {});
            return rowObject;
        });
        dispatch(setCsvData(parsedData));
        uploadToServer(parsedData);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFileData(event.target.result);
            };
            reader.readAsText(selectedFile);
        } else {
            alert('Please select a valid .csv file');
        }
    };

    const handleUpload = () => {
        if (fileData) {
            const fileInput = document.querySelector("input[type='file']");
            const selectedFilename = fileInput.files[0].name;
            dispatch(setFilename(selectedFilename));
            parseCsv(fileData);
            setShowDisplay(true);
        } else {
            alert('No file data to upload. Please select a CSV file first.');
        }
    };

    return (
        <div className="bg-gray-50 flex items-center justify-center py-5 rounded-2xl">
            <div className="px-4 space-y-2">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Select a CSV file to continue
                </h2>
                <div className="flex flex-col items-center">
                    <input 
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileChange} 
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    {csvFilename ? (
                        <p className="mt-4 text-sm text-gray-500">File uploaded: <span className="font-medium text-gray-700">{csvFilename}</span></p>
                    ) : (
                        <p className="mt-4 text-sm text-gray-500">No file uploaded yet.</p>
                    )}
                    <button 
                        onClick={handleUpload} 
                        className="mt-4 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-indigo-600 hover:text-white hover:ring-indigo-600"
                    >
                        Upload
                        <ArrowUpTrayIcon aria-hidden="true" className="-mr-0.5 ml-1.5 h-5 w-5" />
                    </button>
                </div>

                {showDisplay && <Display />}
            </div>
        </div>
    );
};

export default Home;
