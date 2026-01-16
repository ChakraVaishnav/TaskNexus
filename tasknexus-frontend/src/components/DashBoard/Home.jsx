import React, { useEffect, useState } from "react";
import axios from "axios";
import './Home.css';

const Home = ({ userDetails }) => {
  const [taskStats, setTaskStats] = useState({
    ongoing: 0,
    overdue: 0,
    planned: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // Toggle the form visibility
  const [newTask, setNewTask] = useState({
    title: "",  
    description: "",
    dueDate: "", // Store the date-time string directly
    status: "",
    priority: "",
  });

  const [completedTasks,setCompletedTasks]=useState();

  // Determine time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 16) return "Good Afternoon";
    if (hour >= 16 && hour < 24) return "Good Evening";
    return "You are Batman";
  };

  const greeting = getGreeting();

  // Fetch task stats from the API
  
    const fetchTaskCounts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8081/api/tasks/status/counts/${userDetails.id}`,
          {
            headers: { Authorization: `Bearer ${userDetails.token}` },
          }
        );
        setTaskStats(response.data); // Set task counts

      } catch (error) {
        console.error("Error fetching task counts:", error);
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    const completedTaskCount= async ()=>{
      try{
        setLoading(true);
        const response= await axios.get(`http://localhost:8081/api/completedTasksCount/${userDetails.id}`);
        setCompletedTasks(response.data);

      }
      catch(error){
        console.error(error);
      }
      finally{
        setLoading(false);
      }
    }
  useEffect(() => {
    fetchTaskCounts();
    completedTaskCount();
  }, [userDetails]);
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
  
    // Ensure dueDate has seconds set to 00
    let dueDateTime = newTask.dueDate;
    if (dueDateTime.length === 16) {
      dueDateTime += ":00"; // Append ":00" for seconds if not present
    }
  
    const updatedTask = {
      ...newTask,
      dueDate: dueDateTime, // Ensure format is YYYY-MM-DDTHH:MM:SS
    };  
    try {
      await axios.post(
        `http://localhost:8081/api/tasks/create/${userDetails.id}`,
        updatedTask,
        {
          headers: { Authorization: `Bearer ${userDetails.token}` },
        }
      );
      alert("Task added successfully!");
      setIsFormOpen(false);
       fetchTaskCounts(); // Refresh task stats
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        status: "",
        priority: "",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      
  if (error.response) {
    console.error("Response Data:", error.response.data);
    console.error("Response Status:", error.response.status);
    console.error("Response Headers:", error.response.headers);
  } else if (error.request) {
    console.error("No Response Received:", error.request);
  } else {
    console.error("Request Error:", error.message);
  }
      alert("Failed to add task. Please try again.");
    }
  };
  

  // Check if required fields are filled
  const isSaveDisabled = !newTask.title || !newTask.dueDate || !newTask.status;

  if (loading) {
    return <div className="home-container">Loading your dashboard...</div>;
  }

  return (
    <div className="home-container">
      <h2>{greeting}, {userDetails.username}!</h2>
      <p>Welcome back! Here's your dashboard overview:</p>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <h3>Ongoing Tasks</h3>
          <p>There are "{taskStats.ongoing}" ongoing tasks</p>
        </div>
        <div className="stat-card">
          <h3>Planned Tasks</h3>
          <p>You have completed "{taskStats.planned}" tasks</p>
        </div>
        <div className="stat-card">
          <h3>Overdue Tasks</h3>
          <p>There are "{taskStats.overdue}" overdue tasks</p>
        </div>
      </div>

      {/* Planned Tasks Section */}
      <div className="planned-tasks">
        <h3>Completed Tasks</h3>
        {(
          <p>You have completed "{completedTasks}" tasks</p>
        ) 
      }
      </div>

      {/* Action Shortcuts */}
      <div className="shortcuts">
        <h3>Add New Tasks</h3>
        <p>Add tasks and be productive with TaskNexus</p>
        <button onClick={() => setIsFormOpen(true)}>Add Task</button>
      </div>

      {/* Task Form Modal */}
      {isFormOpen && (
        <div className="form-modal">
          <div className="form-container">
            <h3>Add a New Task</h3>
            {isSaveDisabled && (<h4 style={{ color: "red" }}>Enter all required details</h4>)}
            <form onSubmit={handleAddTask}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                ></textarea>
              </label>
              <label>
                Due Date and Time:
                <input
                  type="datetime-local"
                  name="dueDate" // Use datetime-local to directly handle date and time
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Status:
                <select
                  className="option"
                  name="status"
                  value={newTask.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="planned">Planned</option>
                </select>
              </label>
              <label>
                Priority:
                <select
                  className="option"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <div className="form-actions">
                <button className="save" type="submit" disabled={isSaveDisabled}>
                  Submit
                </button>
                <button className="cancel" type="button" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
