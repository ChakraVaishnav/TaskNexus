import React, { useState } from 'react';
import DashboardSideBar from './DashboardSideBar.jsx';
import DashboardMain from './DashboardMain';

const Dashboard = ({ userDetails, setUserDetails }) => {
  const [currentSection, setCurrentSection] = useState('home');

  return (
    <div className="dashboard">
      <DashboardSideBar
        setCurrentSection={setCurrentSection}
        userDetails={userDetails}
        setUserDetails={setUserDetails} // Ensure this is passed correctly
      />
      <DashboardMain
        currentSection={currentSection}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
      />
    </div>
  );
};

export default Dashboard;
