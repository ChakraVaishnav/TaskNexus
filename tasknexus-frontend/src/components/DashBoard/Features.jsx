import React from 'react';
import './Features.css'; // Importing CSS file for styling

const Features = () => {
  return (
    <div className="features-container">
      <h2>📚 How TaskNexus Works</h2>
      <ol className="features-list">
        <li>
          <strong>✅ Add and Schedule Tasks:</strong> 
          Users can easily add tasks and schedule them for future dates.
        </li>
        <li>
          <strong>📌 Categorize by Status:</strong> 
          Tasks can be categorized as <span className="status">Ongoing</span>, 
          <span className="status planned"> Planned</span>, and 
          <span className="status overdue"> Overdue</span>.
        </li>
        <li>
          <strong>⚡ Prioritize Tasks:</strong> 
          Tasks can be assigned priority levels - 
          <span className="priority high"> High</span>, 
          <span className="priority medium"> Medium</span>, and 
          <span className="priority low"> Low</span>.
        </li>
        <li>
          <strong>✏️ Edit and Delete Tasks:</strong> 
          Modify task details or delete unnecessary tasks effortlessly.
        </li>
        <li>
          <strong>⚠️ Automated Warnings:</strong> 
          Receive a warning notification 6 hours before the task due time.
        </li>
        <li>
          <strong>🔔 Overdue Task Handling:</strong> 
          If the task is not marked as completed, its status is automatically changed to 
          <span className="status overdue"> Overdue</span> to keep you on track.
        </li>
      </ol>
      <p className="note">
        🚀 <strong>Stay productive with TaskNexus!</strong>
      </p>
    </div>
  );
};

export default Features;
