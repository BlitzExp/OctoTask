import React, { useEffect, useState } from 'react';
import { FaExclamationCircle, FaClock, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import TaskCard from '../../components/task/taskCard';
import Task from '../../components/task/Task';
import TaskUpdate from '../../components/taskUpdate/taskUpdate';
import { getAllTasks, fetchTeamTasksCon, updateTaskController } from '../../controller/tasksViewController';
import { getAllSprintsController, getTeamMatesController } from '../../controller/filterController';
import './taskDashboard.css';
import TaskForm from '../../components/taskForm/taskForm';
import FilterHeader from '../../components/filterHeader/filterHeader';
import OctoMascot from '../../components/brand/OctoMascot';
import Toast from '../../components/ui/Toast';
import OctoBuddyDecor from '../../components/brand/OctoBuddyDecor';
import PodEmptyState from '../../components/layout/PodEmptyState';
import { isPrivileged } from '../../utils/roles';

const KANBAN_COLUMNS = [
  {
    key: 'late',
    label: 'Late',
    stateLabel: 'Late',
    stateId: 4,
    listClass: 'task-late',
    headerClass: 'task-late-header',
    icon: FaExclamationCircle,
    emptyCopy: 'No overdue tasks — nice swim.',
    emptyMood: 'celebrate',
  },
  {
    key: 'pending',
    label: 'Pending',
    stateLabel: 'Pending',
    stateId: 2,
    listClass: 'task-pending',
    headerClass: 'task-pending-header',
    icon: FaClock,
    emptyCopy: 'Calm waters. Drag a task here when ready.',
    emptyMood: 'idle',
  },
  {
    key: 'progress',
    label: 'In progress',
    stateLabel: 'On Going',
    stateId: 3,
    listClass: 'task-progress',
    headerClass: 'task-progress-header',
    icon: FaSpinner,
    emptyCopy: 'Nothing in motion — grab one from pending.',
    emptyMood: 'curious',
  },
  {
    key: 'completed',
    label: 'Done',
    stateLabel: 'Done',
    stateId: 1,
    listClass: 'task-completed',
    headerClass: 'task-completed-header',
    icon: FaCheckCircle,
    emptyCopy: 'Ship something and it lands here.',
    emptyMood: 'celebrate',
  },
];

function buildTaskUpdatePayload(task, newStateId, sprints = []) {
  const sprint = sprints.find((s) => Number(s.id) === Number(task.sprintId));
  return {
    name: task.name,
    description: task.description || '',
    userID: task.userId,
    userName: task.userName || '',
    sprintID: task.sprintId,
    sprintNumber: sprint?.number ?? sprint?.name ?? task.sprintNumber ?? '',
    sprintEndDate: sprint?.endDate ?? task.sprintEndDate ?? '',
    stateID: newStateId,
    priorityID: task.priorityId,
    linkToFile: task.linkToFile || '',
    createdAt: task.createdAt || '',
    updatedAt: new Date().toISOString(),
    cost: task.cost,
    spentHours: task.spentHours,
    visibility: task.visibility ?? 1,
  };
}

function cloneTaskWithState(task, stateId) {
  return new Task({
    id: task.id,
    userId: task.userId,
    userName: task.userName,
    name: task.name,
    description: task.description,
    sprintId: task.sprintId,
    sprintNumber: task.sprintNumber,
    sprintEndDate: task.sprintEndDate,
    stateId,
    priorityId: task.priorityId,
    linkToFile: task.linkToFile,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    cost: task.cost,
    spentHours: task.spentHours,
    visibility: task.visibility,
  });
}

const DEFAULT_FILTERS_BASE = {
  titleQuery: '',
  status: 'all',
  priority: 'all',
  sprintId: 'all',
  assigneeId: 'all',
  deliveryDate: '',
};

function getDefaultFilters(user) {
  return {
    ...DEFAULT_FILTERS_BASE,
    assigneeId: isPrivileged(user) ? 'all' : String(user?.id ?? 'all'),
  };
}

function TaskDashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [teamMates, setTeamMates] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState(getDefaultFilters(user));
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [dropTargetKey, setDropTargetKey] = useState(null);
  const [movingTaskId, setMovingTaskId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

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

  const handleDeleteTask = (deletedTaskId) => {
    const updatedTasks = tasks.filter(task => task.id !== deletedTaskId);
    setTasks(updatedTasks);
    handleCloseEditModal();
  }

  useEffect(() => {
    async function fetchTasks() {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setFetchError('');
      try {
        if (isPrivileged(user)) {
          const tasksGet = await fetchTeamTasksCon(user.teamId);
          setTasks(tasksGet);
        } else {
          const tasksGet = await getAllTasks(user.id);
          setTasks(tasksGet);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setFetchError('Could not load tasks. Check that the backend is running.');
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [user]);

  useEffect(() => {
    setFilterCriteria(getDefaultFilters(user));
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

  useEffect(() => {
    async function fetchTeamMates() {
      if (!user || !user.teamId) {
        return;
      }
      try {
        const teamData = await getTeamMatesController(user.teamId);
        setTeamMates(teamData || []);
      } catch (error) {
        console.error('Error fetching team members for filter:', error);
      }
    }
    fetchTeamMates();
  }, [user]);

  function updateFilterField(field, value) {
    setFilterCriteria((prev) => ({ ...prev, [field]: value }));
  }

  function clearFilters() {
    setFilterCriteria(getDefaultFilters(user));
  }

  async function handleTaskDrop(taskId, targetStateId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || Number(task.stateId) === Number(targetStateId)) {
      return;
    }

    const previousTasks = tasks;
    setMovingTaskId(taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? cloneTaskWithState(t, targetStateId) : t)),
    );

    try {
      const payload = buildTaskUpdatePayload(task, targetStateId, sprints);
      const updatedTask = await updateTaskController(taskId, payload);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      const column = KANBAN_COLUMNS.find((c) => c.stateId === targetStateId);
      if (column) {
        setToast({ message: `Moved to ${column.label}.`, mood: 'celebrate' });
      }
    } catch (error) {
      console.error('Error moving task:', error);
      setTasks(previousTasks);
      setToast({ message: 'Could not move the task. Please try again.', mood: 'busy' });
    } finally {
      setMovingTaskId(null);
      setDropTargetKey(null);
      setDraggingTaskId(null);
    }
  }

  function handleColumnDragOver(event, columnKey) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDropTargetKey(columnKey);
  }

  function handleColumnDrop(event, column) {
    event.preventDefault();
    const rawId = event.dataTransfer.getData('application/x-octotask-id');
    const taskId = Number(rawId);
    if (!taskId) {
      return;
    }
    handleTaskDrop(taskId, column.stateId, column.key);
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

    const matchesAssignee =
      filterCriteria.assigneeId === 'all' || String(task.userId) === filterCriteria.assigneeId;

    let matchesDeliveryDate = true;
    if (filterCriteria.deliveryDate) {
      const dateValue = getComparableDate(task);
      if (!dateValue) {
        matchesDeliveryDate = false;
      } else {
        const selectedDate = new Date(`${filterCriteria.deliveryDate}T00:00:00`);
        matchesDeliveryDate =
          dateValue.getFullYear() === selectedDate.getFullYear() &&
          dateValue.getMonth() === selectedDate.getMonth() &&
          dateValue.getDate() === selectedDate.getDate();
      }
    }

    return (
      matchesTitle &&
      matchesStatus &&
      matchesPriority &&
      matchesSprint &&
      matchesAssignee &&
      matchesDeliveryDate
    );
  });

  const hasActiveFilters =
    filterCriteria.titleQuery !== '' ||
    filterCriteria.status !== 'all' ||
    filterCriteria.priority !== 'all' ||
    filterCriteria.sprintId !== 'all' ||
    filterCriteria.assigneeId !== getDefaultFilters(user).assigneeId ||
    filterCriteria.deliveryDate !== '';

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

  const privileged = isPrivileged(user);

  const assigneeOptions = privileged
    ? (teamMates.length > 0
        ? teamMates
        : Array.from(
            new Map(
              tasks
                .filter((task) => task.userId != null)
                .map((task) => [
                  String(task.userId),
                  { id: task.userId, name: task.userName || `User ${task.userId}` },
                ])
            ).values()
          ))
    : [{ id: user?.id, name: user?.username || 'My tasks' }];

  if (!user?.teamId) {
    return (
      <main className="task-dashboard-container">
        <OctoBuddyDecor variant="board" />
        <h1 className="task-title enterprise-page-title">Task board</h1>
        <PodEmptyState />
      </main>
    );
  }

  return (
    <main className="task-dashboard-container">
      <OctoBuddyDecor variant="board" />
      {user?.username && (
        <p className="octobuddy-page-greeting">Hey {user.username} — your board is ready.</p>
      )}
      <h1 className="task-title enterprise-page-title">Task board</h1>
      <p className="task-board-subtitle">Drag cards between columns to update status.</p>
      <div className="task-actions-row">
        <button className="create-task-button" onClick={() => setIsCreateModalOpen(true)}>
          + Add to the board
        </button>
        <FilterHeader
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen((prev) => !prev)}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
          filterCriteria={filterCriteria}
          onFilterChange={updateFilterField}
          sprintOptions={sprintOptions}
          assigneeOptions={assigneeOptions}
        />
      </div>

      <p className="task-filter-summary">
        {loading
          ? 'Loading your board…'
          : filteredTasks.length === tasks.length
            ? `${tasks.length} task${tasks.length === 1 ? '' : 's'} on the board`
            : `Showing ${filteredTasks.length} of ${tasks.length} tasks`}
      </p>

      {fetchError && (
        <p className="task-dashboard-error" role="alert">
          {fetchError}
        </p>
      )}

      <div className="task-dashboard">
        {KANBAN_COLUMNS.map((column) => {
          const columnTasks = filteredTasks.filter(
            (task) => task.getStateLabel() === column.stateLabel,
          );
          const isDropTarget = dropTargetKey === column.key && draggingTaskId != null;

          return (
            <div
              key={column.key}
              className={`task-list ${column.listClass}`}
              onDragOver={(event) => handleColumnDragOver(event, column.key)}
              onDragEnter={() => setDropTargetKey(column.key)}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setDropTargetKey((prev) => (prev === column.key ? null : prev));
                }
              }}
              onDrop={(event) => handleColumnDrop(event, column)}
            >
              <div className={`task-list-header ${column.headerClass}`}>
                <column.icon className="task-header-icon" size={14} aria-hidden="true" />
                <p className="task-header-text">{column.label}</p>
                <span className="task-header-count">{columnTasks.length}</span>
              </div>
              <div
                className={`task-list-body${isDropTarget ? ' task-list-body--drag-over' : ''}`}
              >
                {columnTasks.length === 0 ? (
                  <div className="kanban-empty">
                    <OctoMascot mood={column.emptyMood} size={40} />
                    <p className="kanban-empty__text">{column.emptyCopy}</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onCardClick={handleCardClick}
                      onDragStart={() => setDraggingTaskId(task.id)}
                      onDragEnd={() => {
                        setDraggingTaskId(null);
                        setDropTargetKey(null);
                      }}
                      isDragging={draggingTaskId === task.id}
                      isSaving={movingTaskId === task.id}
                      dragDisabled={movingTaskId != null}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isEditModalOpen && (
        <TaskUpdate
          teamId={user.teamId}
          task={selectedTask}
          onClose={handleCloseEditModal}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}

      <TaskForm
        teamId={user.teamId}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        updateTaskList={(newTask) => {
          if (user.role === 'admin') {
            setTasks((prevTasks) => [...prevTasks, newTask]);
          } else if (newTask.assigneeId === user.id) {
            setTasks((prevTasks) => [...prevTasks, newTask]);
          }
          setToast({ message: 'Added to the board!', mood: 'celebrate' });
        }}
        taskTitle="Add to the board"
      />

      {toast && (
        <Toast
          message={toast.message}
          mood={toast.mood}
          onDismiss={() => setToast(null)}
        />
      )}
    </main>
  );
}

export default TaskDashboard;