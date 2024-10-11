// src/redux/csvSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadCsvData = createAsyncThunk(
  'csv/uploadCsvData',
  async (csvData, { getState }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const csvHeader = 'Employee ID,First Name,Last Name,Date of Birth,Date of Joining,Grade\n';
    const csvRows = csvData.map(row => 
      `${row.employeeId},${row.firstName},${row.lastName},${row.dateOfBirth},${row.dateOfJoining},${row.grade}`
    );
    const csvString = csvHeader + csvRows.join('\n');

    const response = await axios.post('http://localhost:8000/addcsvfile', {
      token: token,
      csvString: csvString
    });

    if (response.status === 200) {
      return csvData; // Optionally return additional data if needed
    }
    
    throw new Error('Error uploading CSV file');
  }
);

const csvSlice = createSlice({
  name: 'csv',
  initialState: {
    data: [],
    username: '', // Initialize username in the state
    loading: false,
    error: null
  },
  reducers: {
    setCsvData: (state, action) => {
      state.data = action.payload;
    },
    setUsername: (state, action) => { // Define a new action for setting the username
      state.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCsvData.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadCsvData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(uploadCsvData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setCsvData, setUsername } = csvSlice.actions; // Export setUsername
export default csvSlice.reducer;
