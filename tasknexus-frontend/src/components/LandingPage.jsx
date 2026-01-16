import {React,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LandingPage.css"; // Import the CSS file

const LandingPage = ({setUserDetails}) => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  useEffect(() => {
      // Load user details from localStorage
      const storedUserDetails = localStorage.getItem("userDetails");
      if (storedUserDetails) {
        setUserDetails(JSON.parse(storedUserDetails)); // Restore user details
        navigate("/dashboard");
      }
       // Loading is complete
    }, [navigate]);

  return (
    <div className="container">
      {/* TaskNexus Title */}
      
      <h1 className="title">TaskNexus</h1>

      {/* Subtitle */}
      <p className="subtitle">
        Be Productive with TaskNexus, a task management hub
      </p>

      {/* Buttons */}
      <div className="buttons">
        <button className="btn create-btn" onClick={handleCreateAccount}>
          Create Account
        </button>
        
          <p className="login-text">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
