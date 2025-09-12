import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profilee';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import DashboardPage from './components/DashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#F7FFE5] to-[#E1ECC8]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard/farmer" element={<Dashboard role="farmer" />} />
<Route path="/dashboard/consumer" element={<Dashboard role="consumer" />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;