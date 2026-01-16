import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Tasks.css';
import EditTask from './EditTask';

const OverdueTasks = ({ userDetails }) => {
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    due: '',
    status: '',
    priority: '',
  });
  const [priorityFilter, setPriorityFilter] = useState(''); // Priority filter state

  // Fetch overdue tasks
  const fetchOverdueTasks = async (priority) => {
    try {
      setLoading(true); // Show loading indicator
      const endpoint = priority
        ? `http://localhost:8081/api/tasks/priority/${userDetails.id}/overdue/${priority}`
        : `http://localhost:8081/api/tasks/status/${userDetails.id}/overdue`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${userDetails.token}` },
      });
      setOverdueTasks(response.data); // Update tasks based on API response
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      setOverdueTasks([]);
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Fetch overdue tasks on initial load
  useEffect(() => {
    fetchOverdueTasks(); // Fetch all overdue tasks by default
  }, [userDetails]);

  // Handle priority filter change
  const handlePriorityChange = async (e) => {
    const selectedPriority = e.target.value; // Get selected priority
    setPriorityFilter(selectedPriority);

    try {
      if (selectedPriority === 'high' || selectedPriority === 'medium' || selectedPriority === 'low') {
        await fetchOverdueTasks(selectedPriority); // Fetch tasks filtered by priority
      } else {
        await fetchOverdueTasks(); // Fetch all tasks if no priority is selected
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Handle input change for edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Submit edited task
  const submitEdit = async () => {
    let dueDateTime = editFormData.due;
    if (dueDateTime.length === 16) {
      dueDateTime += ':00'; // Add seconds if missing
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

      setEditingTaskId(null); // Exit edit mode
      fetchOverdueTasks(priorityFilter); // Refetch filtered tasks
    } catch (error) {
      console.error('Error submitting edit:', error);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  // Mark task as completed
  const handleComplete = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:8081/api/tasks/complete/${userDetails.id}/${taskId}`,
        {},
        { headers: { Authorization: `Bearer ${userDetails.token}` } }
      );
      setOverdueTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error marking task as completed:', error);
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
      setOverdueTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Loading state
  if (loading) {
    return <div className="loading">Loading overdue tasks...</div>;
  }

  return (
    <div className="tasks-container">
      <h2>Overdue Tasks</h2>

      {/* Priority filter dropdown */}
      <label className="prio-select">
        Priority:
        <select name="priority" value={priorityFilter} onChange={handlePriorityChange}>
          <option value="">None</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      {/* Task list */}
      {overdueTasks.length > 0 ? (
        <ul className="tasks-list">
          {overdueTasks.map((task) => (
            <li key={task.id} className="task-item">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>
                Due Date:{' '}
                {task.due
                  ? new Date(task.due).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Not set'}
              </p>
              <p>Priority: {task.priority}</p>

              {/* Task actions */}
              <div className="task-actions">
                <button onClick={() => handleComplete(task.id)}>Completed</button>
                <button
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditFormData({
                      title: task.title,
                      description: task.description,
                      due: task.due ? task.due.slice(0, 16) : '', // Format for editing
                      status: task.status,
                      priority: task.priority,
                    });
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteTask(task.id)} className="delete">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No overdue tasks, great work!</p>
      )}

      {/* Edit Task Component */}
      {editingTaskId && (
        <EditTask
          msg={"If you extend the due date, make sure to update the status, or the task will remain overdue."}
          editFormData={editFormData}
          handleInputChange={handleInputChange}
          submitEdit={submitEdit}
          cancelEditing={cancelEditing}
        />
      )}
    </div>
  );
};

export default OverdueTasks;
