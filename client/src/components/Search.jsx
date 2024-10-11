import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const csvData = useSelector((state) => state.csv.data); // Access CSV data from Redux store
  const [searchField, setSearchField] = useState('employeeId'); // State for selected search field
  const [searchValue, setSearchValue] = useState(''); // State for input value
  const [filteredData, setFilteredData] = useState([]); // State for filtered results
  const [notFound, setNotFound] = useState(false); // State for no data found message
  const navigate = useNavigate();

  // Function to handle the search
  const handleSearch = () => {
    if (!searchValue) {
      alert('Please enter a value to search');
      return;
    }

    const results = csvData.filter((row) =>
      row[searchField].toLowerCase().includes(searchValue.toLowerCase())
    );

    if (results.length > 0) {
      setFilteredData(results);
      setNotFound(false); // Reset not found state
    } else {
      setFilteredData([]); // Clear filtered data
      setNotFound(true); // Set not found state to true
    }
  };

  // Function to handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Call handleSearch when Enter key is pressed
    }
  };

  const handleHome = () => {
    navigate('/home');
  }

  return (
    <div>
      <h2>Search</h2>

      {/* Search Field Selection */}
      <div>
        <label htmlFor="searchField">Search by:</label>
        <select
          id="searchField"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="employeeId">Employee ID</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder={`Enter ${searchField}`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress} // Add key press event
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <br />

      {notFound ? (
        <p>No data found for the given criteria.</p> // Display message when no data is found
      ) : (
        filteredData.length > 0 && ( // Check if there are filtered results
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
              {filteredData.map((row, index) => (
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
        )
      )}

        <br />
        <span>Back to home.. </span>
        <button onClick={handleHome}>
          Home
        </button>
    </div>
  );
};

export default Search;
