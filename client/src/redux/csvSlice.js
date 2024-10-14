import { createSlice } from '@reduxjs/toolkit';

const csvSlice = createSlice({
  name: 'csv',
  initialState: {
    data: [],
    filename: '',
    username: '', 
    loading: false,
    error: null
  },
  reducers: {
    setCsvData: (state, action) => {
      state.data = action.payload;
    },
    setFilename: (state, action) => {
      state.filename = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
      localStorage.setItem('username', action.payload);
    },
    updateData: (state, action) => {
      const index = state.data.findIndex(item => item.id === action.payload.id); // Assuming each row has a unique 'id'
      if (index !== -1) {
        state.data[index] = action.payload; // Update the row data
      }
    },    
  },
});

export const { setCsvData, setFilename, setUsername, updateData } = csvSlice.actions;
export default csvSlice.reducer;
