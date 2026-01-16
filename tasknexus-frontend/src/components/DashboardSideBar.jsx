import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardSideBar.css"; // Add CSS for styling

const DashboardSideBar = ({ setCurrentSection, userDetails, setUserDetails }) => {
  const [taskSectionOpen, setTaskSectionOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const [profilePic,setProfilePic]=useState(null);
  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    setUserDetails(null);
    navigate("/");
  };

  // Toggle task dropdown
  const toggleTaskSection = () => {
    setTaskSectionOpen(!taskSectionOpen);
  };

  // Toggle sidebar visibility on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when a section is selected
  const handleSectionClick = (section) => {
    setCurrentSection(section);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Check if mobile view to update sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(true); // Sidebar open for large screens
      } else {
        setSidebarOpen(false); // Sidebar hidden for mobile
      }
    };
  
    window.addEventListener("resize", handleResize);
  
    // Call handleResize initially to set the correct state on load/refresh
    handleResize();
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
  let imageUrl;

  const fetchProfilePhoto = async () => {
    try {
      const email = userDetails.email;
      if (!email) return;

      const res = await fetch(`http://localhost:8081/api/profile-pic/${email}`);
      if (!res.ok) throw new Error("Failed to fetch profile photo");

      const blob = await res.blob();
      imageUrl = URL.createObjectURL(blob);
      setProfilePic(imageUrl);
    } catch (err) {
      console.error("Error fetching profile photo:", err);
    }
  };

  fetchProfilePhoto();

  return () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl); // Clean up
  };
}, [userDetails]);

  return (
    <>
      {/* Hamburger Button - Visible only on mobile */}
      {isMobile && (
        <button className="hamburger" onClick={toggleSidebar}>
          {sidebarOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Sidebar */}
      <div className={`dashboard-sidebar ${sidebarOpen ? "open" : "hidden"}`}>
        <div className="application-name">
          <h1>TaskNexus</h1>
        </div>
        <div className="user-info">
          {userDetails ? (
            <>
              <img className="dp" src={profilePic} alt="Profile Picture"
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}/>
              <h4>{userDetails.username}</h4>
              <h5>{userDetails.bio}</h5>
            </>
          ) : (
            <h4>Guest</h4> // Fallback content for null userDetails
          )}
        </div>

        <nav>
          <ul>
            <li onClick={() => handleSectionClick("home")}>Home</li>
            <li>
              <div onClick={toggleTaskSection} className="dropdown-toggle">
                Tasks {taskSectionOpen ? "▲" : "▼"}
              </div>
              {taskSectionOpen && (
                <ul className="dropdown-menu">
                  <li onClick={() => handleSectionClick("ongoing-tasks")}>
                    Ongoing tasks
                  </li>
                  <li onClick={() => handleSectionClick("planned-task")}>
                    Planned tasks
                  </li>
                  <li onClick={() => handleSectionClick("overdue-tasks")}>
                    Overdue tasks
                  </li>
                </ul>
              )}
            </li>
            <li onClick={() => handleSectionClick("profile")}>Profile</li>
            <li onClick={() => handleSectionClick("features")}>
              Help
            </li>
          </ul>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
};

export default DashboardSideBar;
