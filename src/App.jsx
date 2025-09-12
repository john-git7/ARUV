import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import RoleSelect from "./components/RoleSelect";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#F7FFE5] to-[#E1ECC8]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/role-select" element={<RoleSelect/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;