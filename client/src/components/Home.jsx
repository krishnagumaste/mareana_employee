import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadCsvData } from '../redux/csvSlice';

const Home = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(""); 
  const [loading, setLoading] = useState(false);
  const csvData = useSelector((state) => state.csv.data); // Access csv data from Redux store
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFilename(selectedFile.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        parseCsv(event.target.result);
      };
      reader.readAsText(selectedFile);
      setFile(selectedFile);
    } else {
      alert('Please select a valid .csv file');
      setFile(null);
    }
  };

  const parseCsv = (data) => {
    const rows = data.split('\n').filter(row => row.trim() !== '');
    const parsedData = rows.slice(1).map(row => {
      const columns = row.split(',');
      if (columns.length < 6) return null;
      return {
        employeeId: columns[0].trim(),
        firstName: columns[1].trim(),
        lastName: columns[2].trim(),
        dateOfBirth: columns[3].trim(),
        dateOfJoining: columns[4].trim(),
        grade: columns[5].trim(),
      };
    });

    const validData = parsedData.filter(row => row && row.employeeId);
    dispatch(uploadCsvData(validData)); // Correctly store CSV data in Redux store
  };

  const handleUpload = async () => {
    if (!csvData || csvData.length === 0) {
      alert('No CSV data to upload');
      return;
    }

    try {
      setLoading(true);
      alert('CSV file uploaded successfully');
    } catch (error) {
      console.error('Error uploading CSV file:', error);
      alert('An error occurred while uploading the CSV file');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!csvData || csvData.length === 0) {
      alert("Please upload a CSV file first.");
      return;
    }
    navigate('/search', { state: { csvData } });
  };

  const handleModify = () => {
    if (!csvData || csvData.length === 0) {
      alert("Please upload a CSV file first.");
      return;
    }
    navigate('/modify', { state: { csvData } });
  };

  return (
    <div className="home-container">
      <h2>Home</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading || !csvData || csvData.length === 0}>
        {loading ? 'Uploading...' : 'Upload CSV'}
      </button>
      {loading && <p>Uploading your file, please wait...</p>}

      {file ? (
        <p>File selected: {filename}</p>
      ) : (
        <p>No CSV file selected.</p>
      )}
      
      {csvData && csvData.length > 0 && (
        <>
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleModify}>Modify</button>
        </>
      )}
    </div>
  );
};

export default Home;
