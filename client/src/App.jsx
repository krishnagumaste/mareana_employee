import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';
import Hello from './components/Hello';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import Search from './components/Search';
import Modify from './components/Modify';
import Header from './components/Header';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ConditionalHeader />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/test" element={<Hello />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/modify" element={<Modify />} />
        </Routes>
      </Router>
    </Provider>
  );
}

// Component to conditionally render Header
function ConditionalHeader() {
  const location = useLocation();
  
  // Only show Header if route is not "/" (Login) or "/register"
  if (location.pathname === '/' || location.pathname === '/register') {
    return null;
  }
  
  return <Header />;
}

export default App;
