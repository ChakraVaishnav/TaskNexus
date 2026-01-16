import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { Link } from "react-router-dom";


const Login = ({ setUserDetails }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending login request:", formData);
      const response = await axios.post("http://localhost:8081/api/login", formData);
  
      if (response.data === "Incorrect password") {
        setResponseMessage("Invalid email or password.");
        return;
      }
  
      console.log("Login success, fetching user details...");
      const userDetailsResponse = await axios.get(`http://localhost:8081/api/email/${formData.email}`);
      const userDetails = userDetailsResponse.data;
  
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      setUserDetails(userDetails);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setResponseMessage("Login failed. Please check your credentials and try again.");
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} >
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
      <p>
        <Link to="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </Link>
      </p>
      <p>
        Don't have account?{" "}
        <Link to="/signup" className="login-link">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default Login;
