import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUsername } from '../redux/csvSlice';
import {
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const Header = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.csv.username);
  const data = useSelector((state) => state.csv.data);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername && !username) {
      dispatch(setUsername(storedUsername));
    }
  }, [dispatch, username]);

  const handleLogout = () => {
    // Clear username and other state if needed
    localStorage.removeItem('username'); // Optionally remove username on logout
    dispatch(setUsername('')); // Reset username in Redux state

    // Optionally clear any other user-related state
    // dispatch(clearUserData()); // Uncomment if you have a clearUserData action

    // Redirect to the login or home page
    navigate('/', { replace: true }); // Use navigate with replace to prevent going back to the previous page
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="lg:flex lg:items-center lg:justify-between mb-2">
      <div className="min-w-0 flex">
        <h2 className="mr-30 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Welcome, {capitalizeFirstLetter(username) || "Guest"}
        </h2>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span className="hidden sm:block">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-indigo-600 hover:text-white hover:ring-indigo-600"
          >
            SignOut
            <ArrowRightStartOnRectangleIcon aria-hidden="true" className="-mr-0.5 ml-1.5 h-5 w-5" />
          </button>
        </span>
      </div>
    </div>
  );
};

export default Header;
