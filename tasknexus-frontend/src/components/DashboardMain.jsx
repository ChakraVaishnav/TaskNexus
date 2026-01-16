import React from "react";
import Home from "./DashBoard/Home.jsx";
import PlannedTasks from "./DashBoard/PlannedTasks.jsx";
import OngoingTasks from "./DashBoard/OngoingTasks.jsx";
import OverdueTasks from "./DashBoard/OverdueTasks.jsx";
import Profile from "./DashBoard/Profile.jsx";
import Features from "./DashBoard/Features.jsx";
const DashBoardMain = ({ currentSection, userDetails, setUserDetails }) => {
  const renderContent = () => {
    switch (currentSection) {
      case "home":
        return <Home userDetails={userDetails}/>;
      case "ongoing-tasks":
        return <OngoingTasks userDetails={userDetails} />
      case "planned-task":
        return <PlannedTasks userDetails={userDetails}/>;
      case "overdue-tasks":
        return <OverdueTasks userDetails={userDetails}/>;
      case "profile":
        return <Profile userDetails={userDetails} setUserDetails={setUserDetails}/>
      case "settings":
        return <Settings userDetails={userDetails}/>;
        case "features":
          return <Features/>
      default:
        return <div>Welcome! Please select a section from the sidebar.</div>;

    }
  };

  return <div className="dashboard-main">{renderContent()}</div>;
};

export default DashBoardMain;
