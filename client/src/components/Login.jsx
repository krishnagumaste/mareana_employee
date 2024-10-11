import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUsername } from '../redux/csvSlice'; // Import setUsername

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start the loader

    try {
      const response = await axios.post('http://localhost:8000/login', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const { token, name } = response.data;
        localStorage.setItem('token', token); // Save token if needed
        dispatch(setUsername(name)); // Dispatch the username to Redux
        navigate('/home'); // Navigate to the home page
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid email or password');
      } else {
        console.error('Error logging in:', error);
        alert('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <span>Not a user? ...</span>
      <button onClick={handleRegister}>
        Register
      </button>

      {loading && <p>Loading...</p>} {/* Display loader */}
    </div>
  );
};

export default Login;
