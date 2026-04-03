import React, { useState } from 'react';
import './taskDashboard.css';

function TaskDashboard() {
  const [tasks, setTasks] = useState([]);


  return (
    <main>
        <h1 className= "task-title">Task Dashboard</h1>
    </main>
  );
}

export default TaskDashboard;