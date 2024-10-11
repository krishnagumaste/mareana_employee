import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uploadCsvData } from '../redux/csvSlice'; // Import the async thunk
import { useNavigate } from 'react-router-dom';

const Modify = () => {
  const csvData = useSelector((state) => state.csv.data); // Access CSV data from Redux store
  const [employeeId, setEmployeeId] = useState(''); // State for employee ID input
  const [employeeData, setEmployeeData] = useState(null); // State for employee data
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();

  // Function to handle fetching employee data
  const fetchEmployeeData = () => {
    const foundEmployee = csvData.find((row) => row.employeeId === employeeId);
    if (foundEmployee) {
      setEmployeeData({ ...foundEmployee }); // Set employee data for editing
    } else {
      alert('Employee not found');
      setEmployeeData(null);
    }
  };

  // Function to handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value })); // Update employee data state
  };

  // Function to handle data update
  const handleUpdate = async () => {
    if (employeeData) {
      const updatedCsvData = csvData.map((row) => 
        row.employeeId === employeeData.employeeId ? employeeData : row
      );
      
      try {
        await dispatch(uploadCsvData(updatedCsvData)).unwrap(); // Dispatch updated data to Redux store
        alert('Employee data modified successfully');
        setEmployeeData(null); // Clear employee data input
        setEmployeeId(''); // Reset employee ID input field
      } catch (error) {
        console.error('Error modifying employee data:', error);
        alert('An error occurred while modifying the employee data');
      }
    }
  };

  const handleHome = () => {
    navigate('/home');
  }

  return (
    <div>
      <h2>Modify Employee Data</h2>

      <input
        type="text"
        placeholder="Enter Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            fetchEmployeeData(); // Fetch employee data when Enter is pressed
          }
        }}
      />
      <button onClick={fetchEmployeeData}>Search</button>

      {employeeData && (
        <div>
          <h3>Editing Employee: {employeeData.employeeId}</h3>
          <div>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={employeeData.firstName}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={employeeData.lastName}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Date of Birth:
              <input
                type="date"
                name="dateOfBirth"
                value={employeeData.dateOfBirth}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Date of Joining:
              <input
                type="date"
                name="dateOfJoining"
                value={employeeData.dateOfJoining}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Grade:
              <input
                type="text"
                name="grade"
                value={employeeData.grade}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <br />
          <button onClick={handleUpdate}>Update Data</button>
        </div>
      )}

        <br />
        <br />
        <span>Back to home.. </span>
        <button onClick={handleHome}>
          Home
        </button>
    </div>
  );
};

export default Modify;
