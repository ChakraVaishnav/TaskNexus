import React from 'react';
import './EditTask.css'; // For styling the modal

const EditTask = ({ editFormData, handleInputChange, submitEdit, cancelEditing, msg }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Edit Task</h2>
        <span className='note'>
        <h6>{msg}</h6>
        </span>
        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={editFormData.title}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Due Date:
            <input
              type="datetime-local"
              name="due"
              value={editFormData.due}
              onChange={handleInputChange}
              min={new Date().toISOString().slice(0, 16)}
            />
          </label>
          <label>
            Status:
            <select
              name="status"
              value={editFormData.status}
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
              name="priority"
              value={editFormData.priority}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" onClick={submitEdit} className="save-btn">
              Save
            </button>
            <button type="button" onClick={cancelEditing} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
