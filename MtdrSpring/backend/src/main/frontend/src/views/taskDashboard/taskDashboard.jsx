import React, { useState } from 'react';
import './taskDashboard.css';

function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  function handleFilterClick(filter) {
    setActiveFilter(filter);
  }

  return (
    <main className="task-dashboard-container">
      <h1 className="task-title">Task Dashboard</h1>
      <button className="create-task-button">+ Create Task</button>
      <nav className="task-filter-bar">
        <ul className="task-filter-list">
          <li className={`task-filter-item${activeFilter === 'all' ? ' active' : ''}`} onClick={() => handleFilterClick('all')}>
            All
          </li>
          <li className={`task-filter-item${activeFilter === 'late' ? ' active' : ''}`} onClick={() => handleFilterClick('late')}>
            Late
          </li>
          <li className={`task-filter-item${activeFilter === 'pending' ? ' active' : ''}`} onClick={() => handleFilterClick('pending')}>
            Pending
          </li>
          <li className={`task-filter-item${activeFilter === 'inProgress' ? ' active' : ''}`} onClick={() => handleFilterClick('inProgress')}>
            On Going
          </li>
          <li className={`task-filter-item${activeFilter === 'completed' ? ' active' : ''}`} onClick={() => handleFilterClick('completed')}>
            Completed
          </li>
        </ul>
      </nav>
      <div className="task-dashboard">
        {(activeFilter === 'all' || activeFilter === 'late') && (
          <div className="task-list task-late">
            <div className="task-list-header task-late-header">
              <p className='task-header-text'>LATE</p>
            </div>
            <div className="task-list-body"></div>
          </div>
        )}
        {(activeFilter === 'all' || activeFilter === 'pending') && (
          <div className="task-list task-pending">
            <div className="task-list-header task-pending-header">
              <p className='task-header-text'>PENDING</p>
            </div>
            <div className="task-list-body"></div>
          </div>
        )}
        {(activeFilter === 'all' || activeFilter === 'inProgress') && (
          <div className="task-list task-progress">
            <div className="task-list-header task-progress-header">
              <p className='task-header-text'>IN PROGRESS</p>
            </div>
            <div className="task-list-body"></div>
          </div>
        )}
        {(activeFilter === 'all' || activeFilter === 'completed') && (
          <div className="task-list task-completed">
            <div className="task-list-header task-completed-header">
              <p className='task-header-text'>COMPLETED</p>
            </div>
            <div className="task-list-body"></div>
          </div>
        )}
      </div>
    </main>
  );
}

export default TaskDashboard;