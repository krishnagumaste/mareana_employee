import React from 'react';
import { useSelector } from 'react-redux';

const Header = () => {
  // Access the `username` inside the `csv` slice
  const username = useSelector((state) => state.csv.username);

  return (
    <div>Hello, {username || 'Guest'}</div> // Display a fallback text if username is not available
  );
}

export default Header;
