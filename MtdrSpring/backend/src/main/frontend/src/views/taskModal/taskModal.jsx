import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './taskModal.css';

function TaskModal({ isOpen, onClose }) {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('');
  const [attachment, setAttachment] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const generatedId = "OCTO-104"; 
  const creationDate = new Date().toLocaleDateString('en-GB');

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();

    const newTaskData = {
      id: generatedId,
      name: taskName,
      description,
      assignee,
      priority,
      attachment,
      isVisible,
      date: creationDate
    };
    
    console.log("Submitting new task to DB:", newTaskData);
    
    setTaskName('');
    setDescription('');
    onClose();
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <span className="task-id">New Task: {generatedId}</span>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          
          <div className="modal-main">
            <div className="form-group">
              <label className="modal-label">Task Name</label>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="e.g. Patch OWASP injection vulnerabilities..." 
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="modal-label">Description</label>
              <textarea 
                className="modal-input modal-textarea" 
                placeholder="Detailed description of the task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="modal-label">Attachments / Links</label>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="Paste Jira, Nextcloud, or GitHub links here..." 
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-sidebar">
            
            <div className="detail-row">
              <span className="detail-label">Created On</span>
              <span className="detail-value">{creationDate}</span>
            </div>
            
            <div className="form-group">
              <label className="modal-label">Assignee</label>
              <select 
                className="modal-input modal-select" 
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                required
              >
                <option value="" disabled hidden>Select user...</option>
                <option value="diego">Diego Navarro</option>
                <option value="edgar">Edgar Navarro</option>
                <option value="eloy">Eloy Rodriguez</option>
                <option value="jdd">Juan de Dios</option>
                <option value="najera">Jose Najera</option>
              </select>
            </div>

            <div className="form-group">
              <label className="modal-label">Priority</label>
              <select 
                className="modal-input modal-select" 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value="" disabled hidden>Set priority...</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                />
                <span className="checkmark"></span>
                Task is visible to team
              </label>
            </div>

            <div className="sidebar-footer">
              <button type="submit" className="modal-submit-btn">Create Task</button>
            </div>

          </div>

        </form>
      </div>
    </div>,
    document.body
  );
}

export default TaskModal;