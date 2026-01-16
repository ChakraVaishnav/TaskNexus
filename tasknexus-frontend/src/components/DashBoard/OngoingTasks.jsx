import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Tasks.css";
import EditTask from "./EditTask"; // Import the EditTask component

const OngoingTasks = ({ userDetails }) => {
  const [ongoingTasks, setOngoingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", description: "", dueDate: "", status: "",priority:"" });
  const [priorityFilter, setPriorityFilter] = useState(""); // For filtering tasks by priority

  // Fetch tasks based on priority
  const fetchOngoingTasks = async (priority) => {
    try {
      setLoading(true); // Show loading
      const endpoint = priority
        ? `http://localhost:8081/api/tasks/priority/${userDetails.id}/ongoing/${priority}`
        : `http://localhost:8081/api/tasks/status/${userDetails.id}/ongoing`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${userDetails.token}` },
      });
      setOngoingTasks(response.data); // Update tasks
    } catch (error) {
      console.error("Error fetching ongoing tasks:", error);
      setOngoingTasks([]); // Clear tasks on error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch tasks on initial load
  useEffect(() => {
    fetchOngoingTasks(); // Fetch all ongoing tasks by default
  }, [userDetails]);

  // Handle priority change and fetch tasks
  const handlePriorityChange = async (e) => {
  const selectedPriority = e.target.value; // Get the selected priority
  setPriorityFilter(selectedPriority); // Update the state

  console.log("Selected Priority:", selectedPriority); // Debugging

  try {
    if(selectedPriority==="high" ||selectedPriority==="medium" ||selectedPriority==="low"  ){
    const response = await axios.get(
      `http://localhost:8081/api/tasks/priority/${userDetails.id}/ongoing/${selectedPriority}`,
      {
        headers: { Authorization: `Bearer ${userDetails.token}` },
      }
    );
    setOngoingTasks(response.data);
  }
  else{
    fetchOngoingTasks();
  }
     // Update the tasks
  } catch (error) {
    console.error("Error fetching ongoing tasks:", error);
  } finally {
    setLoading(false);
  }
};

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Submit edited task
  const submitEdit = async () => {
    let dueDateTime = editFormData.due;

    if (dueDateTime.length === 16) { 
        dueDateTime += ":00"; // Ensure seconds are added
    }

    const updatedTask = { ...editFormData, dueDate: dueDateTime };
    try {
        await axios.put(
            `http://localhost:8081/api/tasks/update/${userDetails.id}/${editingTaskId}`,
            updatedTask,
            {
                headers: { Authorization: `Bearer ${userDetails.token}` },
            }
        );
        if(updatedTask.status==="completed"){
          handleComplete();
        }
        fetchOngoingTasks(); // Refresh the task list
        setEditingTaskId(null);
    } catch (error) {
        console.error("Error submitting edit:", error);
    }
};

  

  // Cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  // Mark a task as complete
  const handleComplete = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:8081/api/tasks/complete/${userDetails.id}/${taskId}`,
        {},
        { headers: { Authorization: `Bearer ${userDetails.token}` } }
      );
      setOngoingTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/tasks/delete/${userDetails.id}/${taskId}`,
        {
          headers: { Authorization: `Bearer ${userDetails.token}` },
        }
      );
      setOngoingTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) {
    return (
      <div className="tasks-container">
        <h2>Ongoing Tasks</h2>
        <div>Loading ongoing tasks...</div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <h2>Ongoing Tasks</h2>
      Priority:
      <label className="prio-select">
        <select name="priority" value={priorityFilter} onChange={handlePriorityChange}>
          <option value="">None</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      {ongoingTasks.length > 0 ? (
        <ul className="tasks-list">
          {ongoingTasks.map((task) => (
            <li key={task.id} className="task-item">
              {editingTaskId === task.id ? (
                <EditTask
                  editFormData={editFormData}
                  handleInputChange={handleInputChange}
                  submitEdit={submitEdit}
                  cancelEditing={cancelEditing}
                />
              ) : (
                <>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Priority: {task.priority}</p>
                  <p>
                    Due Date:{" "}
                    {task.due
                      ? new Date(task.due).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Not set"}
                  </p>
                  <div className="task-actions">
                    <button onClick={() => handleComplete(task.id)}>Completed</button>
                    <button onClick={() => {
                        setEditingTaskId(task.id);
                        setEditFormData({
                        title: task.title,
                        description: task.description,
                        due: task.due ? task.due.slice(0, 16) : "", // Ensure correct format
                        status:task.status,
                        priority: task.priority,
                        });
                      }}>Edit</button>
                    <button className="delete" onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No ongoing tasks!</p>
      )}
    </div>
  );
};

export default OngoingTasks;
