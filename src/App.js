// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import CampaignDashboard from './pages/CampaignDashboard';
import CampaignStatistics from './pages/CampaignStatistics';
import Login from './components/Login';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        {user ? (
          <Routes>
            <Route path="/" element={<CampaignDashboard />} />
            <Route path="/statistics" element={<CampaignStatistics />} />
          </Routes>
        ) : (
          <Login onLogin={setUser} />
        )}
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </Router>
  );
}

export default App;