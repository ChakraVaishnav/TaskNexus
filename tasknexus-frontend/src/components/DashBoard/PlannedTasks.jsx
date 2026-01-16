import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Tasks.css';
import EditTask from './EditTask';

const PlannedTasks = ({ userDetails }) => {
  const [plannedTasks, setPlannedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', dueDate: '', status: '',priority:"" });
  const [priorityFilter, setPriorityFilter] = useState('');

  // Fetch planned tasks
  const fetchPlannedTasks = async (priority) => {
    try {
      setLoading(true);
      const endpoint = priority
        ? `http://localhost:8081/api/tasks/priority/${userDetails.id}/planned/${priority}`
        : `http://localhost:8081/api/tasks/status/${userDetails.id}/planned`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${userDetails.token}` },
      });

      setPlannedTasks(response.data);
    } catch (error) {
      console.error('Error fetching planned tasks:', error);
      setPlannedTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlannedTasks(); // Fetch all planned tasks on initial load
  }, [userDetails]);

  // Handle priority filter change
  const handlePriorityChange = async (e) => {
    const selectedPriority = e.target.value; // Get the selected priority
    setPriorityFilter(selectedPriority);

    try {
      if (selectedPriority === 'high' || selectedPriority === 'medium' || selectedPriority === 'low') {
        const response = await axios.get(
          `http://localhost:8081/api/tasks/priority/${userDetails.id}/planned/${selectedPriority}`,
          {
            headers: { Authorization: `Bearer ${userDetails.token}` },
          }
        );
        setPlannedTasks(response.data);
      } else {
        await fetchPlannedTasks(); // Fetch all planned tasks if no priority is selected
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
      setPlannedTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskId ? { ...task, ...editFormData } : task
        )
      );
      setEditingTaskId(null);
      fetchPlannedTasks();
    } catch (error) {
      console.error('Error submitting edit:', error);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  // Handle setting a task as ongoing
  const setTaskAsOngoing = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:8081/api/tasks/update/${userDetails.id}/${taskId}`,
        { status: 'ongoing' },
        {
          headers: { Authorization: `Bearer ${userDetails.token}` },
        }
      );
      setPlannedTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error('Error setting task as ongoing:', error);
    }
  };

  // Handle deleting a task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/tasks/delete/${userDetails.id}/${taskId}`,
        {
          headers: { Authorization: `Bearer ${userDetails.token}` },
        }
      );
      setPlannedTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading planned tasks...</div>;
  }

  return (
    <div className="tasks-container">
      <h2>Planned Tasks</h2>
      Priority:
      <label className='prio-select'>
        <select name="priority" value={priorityFilter} onChange={handlePriorityChange}>
          <option value="">None</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      {plannedTasks.length > 0 ? (
        <ul className="tasks-list">
          {plannedTasks.map((task) => (
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
                  <div className="task-actions">
                    <button onClick={() => setTaskAsOngoing(task.id)}>
                      Set as Ongoing
                    </button>
                    <button onClick={() => {
                        setEditingTaskId(task.id);
                        setEditFormData({
                        title: task.title,
                        description: task.description,
                        due: task.due ? task.due.slice(0, 16) : "", // Ensure correct format
                        status:task.status,
                        priority:task.priority,
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
        <p>No planned tasks, Set your new plans now !!</p>
      )}
    </div>
  );
};

export default PlannedTasks;
