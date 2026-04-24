import React, { useEffect, useState } from 'react';
import TaskCard from '../../components/task/taskCard';
import TaskUpdate from '../../components/taskUpdate/taskUpdate';
import { getAllTasks, fetchTeamTasksCon } from '../../controller/tasksViewController';
import { getAllSprintsController } from '../../controller/filterController';
import './taskDashboard.css';
import TaskForm from '../../components/taskForm/taskForm';

const DEFAULT_FILTERS = {
  titleQuery: '',
  status: 'all',
  priority: 'all',
  sprintId: 'all',
  dateFrom: '',
  dateTo: '',
};

function TaskDashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState(DEFAULT_FILTERS);

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (updatedTask) => {
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    handleCloseEditModal();
  };

  useEffect(() => {
    async function fetchTasks() {
      if (!user || !user.id) {
        return;
      }
      try {
        console.log('Fetching tasks for user:', user.username);
        if (user.role === 'admin') {
          const tasksGet = await fetchTeamTasksCon(user.teamId);
          setTasks(tasksGet);
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

  useEffect(() => {
    async function fetchSprints() {
      if (!user || !user.teamId) {
        return;
      }
      try {
        const sprintData = await getAllSprintsController(user.teamId);
        setSprints(sprintData || []);
      } catch (error) {
        console.error('Error fetching sprints for filter:', error);
      }
    }
    fetchSprints();
  }, [user]);

  function updateFilterField(field, value) {
    setFilterCriteria((prev) => ({ ...prev, [field]: value }));
  }

  function clearFilters() {
    setFilterCriteria(DEFAULT_FILTERS);
  }

  function getComparableDate(task) {
    const rawDate = task.sprintEndDate || task.updatedAt || task.createdAt;
    if (!rawDate) {
      return null;
    }
    const parsed = new Date(rawDate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const titleWords = filterCriteria.titleQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const filteredTasks = tasks.filter((task) => {
    const taskTitle = (task.name || '').toLowerCase();
    const matchesTitle =
      titleWords.length === 0 || titleWords.every((word) => taskTitle.includes(word));

    const matchesStatus =
      filterCriteria.status === 'all' || task.getStateLabel() === filterCriteria.status;

    const matchesPriority =
      filterCriteria.priority === 'all' || String(task.priorityId) === filterCriteria.priority;

    const matchesSprint =
      filterCriteria.sprintId === 'all' || String(task.sprintId) === filterCriteria.sprintId;

    let matchesDate = true;
    if (filterCriteria.dateFrom || filterCriteria.dateTo) {
      const dateValue = getComparableDate(task);
      if (!dateValue) {
        matchesDate = false;
      } else {
        if (filterCriteria.dateFrom) {
          const fromDate = new Date(`${filterCriteria.dateFrom}T00:00:00`);
          if (dateValue < fromDate) {
            matchesDate = false;
          }
        }
        if (filterCriteria.dateTo) {
          const toDate = new Date(`${filterCriteria.dateTo}T23:59:59`);
          if (dateValue > toDate) {
            matchesDate = false;
          }
        }
      }
    }

    return matchesTitle && matchesStatus && matchesPriority && matchesSprint && matchesDate;
  });

  const hasActiveFilters =
    filterCriteria.titleQuery !== '' ||
    filterCriteria.status !== 'all' ||
    filterCriteria.priority !== 'all' ||
    filterCriteria.sprintId !== 'all' ||
    filterCriteria.dateFrom !== '' ||
    filterCriteria.dateTo !== '';

  const sprintOptions =
    sprints.length > 0
      ? sprints
      : Array.from(
          new Map(
            tasks
              .filter((task) => task.sprintId != null)
              .map((task) => [
                String(task.sprintId),
                {
                  id: task.sprintId,
                  name: task.sprintNumber ? `Sprint ${task.sprintNumber}` : `Sprint ${task.sprintId}`,
                },
              ])
          ).values()
        );

  return (
    <main className="task-dashboard-container">
      <h1 className="task-title">Task Dashboard</h1>
      <button className="create-task-button" onClick={() => setIsCreateModalOpen(true)}>+ Create Task</button>
      <nav className="task-filter-button">
        <button className="filter-button" onClick={() => setIsFilterOpen((prev) => !prev)}>
          {isFilterOpen ? 'Hide Filters' : 'Filter'}
        </button>
        {hasActiveFilters && (
          <button className="filter-clear-button" onClick={clearFilters}>
            Clear
          </button>
        )}
      </nav>

      {isFilterOpen && (
        <section className="task-filter-panel">
          <div className="task-filter-row">
            <label htmlFor="task-title-filter">Title contains</label>
            <input
              id="task-title-filter"
              type="text"
              value={filterCriteria.titleQuery}
              onChange={(event) => updateFilterField('titleQuery', event.target.value)}
              placeholder="search words in title"
            />
          </div>

          <div className="task-filter-row">
            <label htmlFor="task-status-filter">Status</label>
            <select
              id="task-status-filter"
              value={filterCriteria.status}
              onChange={(event) => updateFilterField('status', event.target.value)}
            >
              <option value="all">All</option>
              <option value="Late">Late</option>
              <option value="Pending">Pending</option>
              <option value="On Going">In Progress</option>
              <option value="Done">Completed</option>
            </select>
          </div>

          <div className="task-filter-row">
            <label htmlFor="task-priority-filter">Difficulty</label>
            <select
              id="task-priority-filter"
              value={filterCriteria.priority}
              onChange={(event) => updateFilterField('priority', event.target.value)}
            >
              <option value="all">All</option>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          </div>

          <div className="task-filter-row">
            <label htmlFor="task-sprint-filter">Sprint</label>
            <select
              id="task-sprint-filter"
              value={filterCriteria.sprintId}
              onChange={(event) => updateFilterField('sprintId', event.target.value)}
            >
              <option value="all">All</option>
              {sprintOptions.map((sprint) => (
                <option key={sprint.id} value={String(sprint.id)}>
                  {sprint.name}
                </option>
              ))}
            </select>
          </div>

          <div className="task-filter-row">
            <label htmlFor="task-date-from-filter">Date from</label>
            <input
              id="task-date-from-filter"
              type="date"
              value={filterCriteria.dateFrom}
              onChange={(event) => updateFilterField('dateFrom', event.target.value)}
            />
          </div>

          <div className="task-filter-row">
            <label htmlFor="task-date-to-filter">Date to</label>
            <input
              id="task-date-to-filter"
              type="date"
              value={filterCriteria.dateTo}
              onChange={(event) => updateFilterField('dateTo', event.target.value)}
            />
          </div>
        </section>
      )}

      <p className="task-filter-summary">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>

      <div className="task-dashboard">
        <div className="task-list task-late">
          <div className="task-list-header task-late-header">
            <p className='task-header-text'>LATE</p>
          </div>
          <div className="task-list-body">
            {filteredTasks.filter(task => task.getStateLabel() === 'Late').map((task) => (
              <TaskCard key={task.id} task={task} onCardClick={handleCardClick} />
            ))}
          </div>
        </div>
        <div className="task-list task-pending">
          <div className="task-list-header task-pending-header">
            <p className='task-header-text'>PENDING</p>
          </div>
          <div className="task-list-body">
            {filteredTasks.filter(task => task.getStateLabel() === 'Pending').map((task) => (
              <TaskCard key={task.id} task={task} onCardClick={handleCardClick} />
            ))}
          </div>
        </div>
        <div className="task-list task-progress">
          <div className="task-list-header task-progress-header">
            <p className='task-header-text'>IN PROGRESS</p>
          </div>
          <div className="task-list-body">
            {filteredTasks.filter(task => task.getStateLabel() === 'On Going').map((task) => (
              <TaskCard key={task.id} task={task} onCardClick={handleCardClick} />
            ))}
          </div>
        </div>
        <div className="task-list task-completed">
          <div className="task-list-header task-completed-header">
            <p className='task-header-text'>COMPLETED</p>
          </div>
          <div className="task-list-body">
            {filteredTasks.filter(task => task.getStateLabel() === 'Done').map((task) => (
              <TaskCard key={task.id} task={task} onCardClick={handleCardClick} />
            ))}
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <TaskUpdate
          teamId={user.teamId}
          task={selectedTask}
          onClose={handleCloseEditModal}
          onSave={handleSaveTask}
        />
      )}

      <TaskForm
        teamId={user.teamId}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        updateTaskList={(newTask) => {
          // Refetch tasks after creating a new one
          if (user.role === 'admin') {
            setTasks(prevTasks => [...prevTasks, newTask]);
          }else{
            if (newTask.assigneeId === user.id) {
              setTasks(prevTasks => [...prevTasks, newTask]);
            }
          }
        }}
        taskTitle="Create New Task"
      />
    </main>
  );
}

export default TaskDashboard;