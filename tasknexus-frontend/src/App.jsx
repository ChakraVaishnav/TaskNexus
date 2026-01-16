import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Signup from "./components/Signup"; 
import Login from "./components/Login"; 
import UserDetails from "./components/UserDetails";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";

const App = () => {
  const [userDetails, setUserDetails] = useState(null); // User details state
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Load user details from localStorage
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails)); // Restore user details
    }
    setIsLoading(false); // Loading is complete
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state until userDetails are restored
  }

  return (
      <Routes>
        <Route path="/" element={<LandingPage setUserDetails={setUserDetails} />} />
        <Route path="/signup" element={<Signup setUserDetails={setUserDetails} />} />
        <Route path="/login" element={<Login setUserDetails={setUserDetails} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/user-details"
          element={<UserDetails setUserDetails={setUserDetails} />}
        />
        <Route
          path="/dashboard"
          element= {<Dashboard userDetails={userDetails} setUserDetails={setUserDetails} />}
        />
      </Routes>
  );
};

export default App;
