import React from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  const handleGithubSignup = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/github";
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <div className="signup-buttons">
        <button onClick={() => navigate("/user-details")}>
      Sign up with Google
    </button>
        <button onClick={() => navigate("/user-details")}>Sign up with GitHub</button>
      </div>
    </div>
  );
};

export default Signup;
