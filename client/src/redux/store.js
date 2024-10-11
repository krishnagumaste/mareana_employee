// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import csvReducer from './csvSlice';

const store = configureStore({
  reducer: {
    csv: csvReducer,
  },
});

export default store;
