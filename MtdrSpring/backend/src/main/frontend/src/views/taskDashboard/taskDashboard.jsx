import React, { useEffect, useState } from 'react';
import TaskCard from '../../components/task/taskCard';
import TaskModal from '../../components/task/TaskModal';
import { getAllTasks, fetchTeamTasksCon } from '../../controller/tasksViewController';
import './taskDashboard.css';

function TaskDashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [activeFilter, setActiveFilter] = useState('all');

  function handleFilterClick(filter) {
    setActiveFilter(filter);
  }

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (updatedTask) => {
    console.log('Saving task:', updatedTask);
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    handleCloseModal();
  };

  useEffect(() => {
    async function fetchTasks() {
      if (!user || !user.id) {
        return;
      }
      try {
        console.log('Fetching tasks for user:', user.username);
        if (user.role === 'admin') {
          console.log('Entre filtro admin');
          const tasksGet = await fetchTeamTasksCon(user.teamId);
          setTasks(tasksGet);
          console.log('Tasks set for admin:', tasksGet);
        } else {
          const tasksGet = await getAllTasks(user.id);
          setTasks(tasksGet);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    fetchTasks();
  }, [user]);

  return (
    <main className="task-dashboard-container">
      <h1 className="task-title">Task Dashboard</h1>
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
            <div className="task-list-body">
              {tasks.filter(task => task.getStateLabel() === 'Late').map((task) => (
                <TaskCard key={task.id} task={task} onCardClick={handleCardClick} />
              ))}
              
            </div>
          </div>
        )}
        {(activeFilter === 'all' || activeFilter === 'pending') && (
          <div className="task-list task-pending">
            <div className="task-list-header task-pending-header">
              <p className='task-header-text'>PENDING</p>
            </div>
            <div className="task-list-body">
              {tasks.filter(task => task.getStateLabel() === 'Pending').map((task) => (
                <TaskCard key={task.id} task={task} onCardClick={handleCardClick} />
              ))}
            </div>
          </div>
        )}
        {(activeFilter === 'all' || activeFilter === 'inProgress') && (
          <div className="task-list task-progress">
            <div className="task-list-header task-progress-header">
              <p className='task-header-text'>IN PROGRESS</p>
            </div>
            <div className="task-list-body">
              {tasks.filter(task => task.getStateLabel() === 'On Going').map((task) => (
                <TaskCard key={task.id} task={task} onCardClick={handleCardClick} />
              ))}
            </div>
          </div>
        )}
        {(activeFilter === 'all' || activeFilter === 'completed') && (
          <div className="task-list task-completed">
            <div className="task-list-header task-completed-header">
              <p className='task-header-text'>COMPLETED</p>
            </div>
            <div className="task-list-body">
              {tasks.filter(task => task.getStateLabel() === 'Done').map((task) => (
                <TaskCard key={task.id} task={task} onCardClick={handleCardClick} />
              ))}
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}
    </main>
  );
}

export default TaskDashboard;