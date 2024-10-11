import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Start the loader

    try {
      const response = await axios.post('http://localhost:8000/register', {
        name: name,
        email: email,
        password: password,
      });

      if (response.status === 200) {
        alert('User registered successfully!');
        navigate('/'); // Redirect to login page
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('User already exists!');
      } else {
        console.error('Error registering user:', error);
        alert('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {loading && <p>Loading...</p>} {/* Display loader */}
    </div>
  );
};

export default Register;
