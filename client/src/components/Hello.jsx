import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [csvData, setCsvData] = useState([]); // State to store CSV data
  const [filename, setFilename] = useState(""); // State to store the filename

  // Fetch CSV data from the server on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        const response = await axios.post('http://localhost:8000/test', {
          token: token,
        });

        if (response.status === 200) {
          const data = response.data.data; // Extract CSV string from the response
          parseCsv(data); // Parse the CSV string into usable data
          setFilename(response.data.filename); // Set the filename if needed
        } else {
          alert('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data');
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once when the component mounts

  // Function to parse the CSV data and update csvData state
  const parseCsv = (data) => {
    const rows = data.split('\n').filter(row => row.trim() !== '');
    const parsedData = rows.slice(1).map(row => {
      const columns = row.split(',');

      // Ensure there are enough columns in the row
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

    // Filter out any null values (in case of rows with fewer than 6 columns)
    setCsvData(parsedData.filter(row => row && row.employeeId));
  };

  return (
    <div>
      <h2>CSV Data from Server: {filename}</h2>
      {csvData.length > 0 ? (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date of Birth</th>
              <th>Date of Joining</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index}>
                <td>{row.employeeId}</td>
                <td>{row.firstName}</td>
                <td>{row.lastName}</td>
                <td>{row.dateOfBirth}</td>
                <td>{row.dateOfJoining}</td>
                <td>{row.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
};

export default Home;
