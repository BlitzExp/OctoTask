import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  FaUser,
  FaFlag,
  FaLink,
  FaTrash,
  FaClock,
  FaCalendarAlt,
} from 'react-icons/fa';
import {
  getAllSprintsController,
  getTeamMatesController,
} from '../../controller/filterController';
import { getTimeUntilDue } from '../../controller/operationsController';
import {
  updateTaskController,
  deleteTaskController,
} from '../../controller/tasksViewController';
import './taskUpdate.css';

const STATES = [
  { id: 1, label: 'Done', className: 'tu-status--done' },
  { id: 2, label: 'Pending', className: 'tu-status--pending' },
  { id: 3, label: 'In progress', className: 'tu-status--progress' },
  { id: 4, label: 'Late', className: 'tu-status--late' },
];

const PRIORITIES = [
  { id: 1, label: 'Low', letter: 'L', className: 'tu-priority--low' },
  { id: 2, label: 'Medium', letter: 'M', className: 'tu-priority--medium' },
  { id: 3, label: 'High', letter: 'H', className: 'tu-priority--high' },
];

function getStateMeta(stateId) {
  return STATES.find((s) => s.id === Number(stateId)) ?? STATES[1];
}

function getPriorityMeta(priorityId) {
  return PRIORITIES.find((p) => p.id === Number(priorityId)) ?? PRIORITIES[1];
}

const TaskUpdate = ({ teamId, task, onClose, onSave, onDelete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stateId, setStateId] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const [sprintId, setSprintId] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [spentHours, setSpentHours] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function parseTaskLinks(linkToFile) {
    if (!linkToFile || typeof linkToFile !== 'string') return [];
    return linkToFile
      .split(/[\s,]+/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  }

  useEffect(() => {
    if (task) {
      setName(task.name || '');
      setDescription(task.description || '');
      setStateId(task.stateId ?? '');
      setAssignedUserId(task.userId ?? '');
      setPriorityId(task.priorityId ?? '');
      setSprintId(task.sprintId ?? '');
      setEstimatedHours(task.cost ?? '');
      setSpentHours(task.spentHours ?? '');
    }

    getTeamMatesController(teamId)
      .then((data) => setTeamMembers(data))
      .catch((error) => console.error('Error fetching team members:', error));

    getAllSprintsController(teamId)
      .then((data) => setSprints(data))
      .catch((error) => console.error('Error fetching sprints:', error));
  }, [task, teamId]);

  const handleSave = async () => {
    setError('');
    setSubmitting(true);
    const updatedTaskData = {
      name,
      description,
      userID: assignedUserId,
      userName:
        teamMembers.find((member) => Number(member.id) === Number(assignedUserId))?.name || '',
      sprintID: sprintId,
      sprintNumber: sprints.find((s) => Number(s.id) === Number(sprintId))?.number || '',
      sprintEndDate: sprints.find((s) => Number(s.id) === Number(sprintId))?.endDate || '',
      stateID: stateId,
      priorityID: priorityId,
      linkToFile: task.linkToFile || '',
      createdAt: task.createdAt || '',
      updatedAt: new Date().toISOString(),
      cost: estimatedHours,
      spentHours,
      visibility: task.visibility || 1,
    };

    try {
      const updatedTask = await updateTaskController(task.id, updatedTaskData);
      if (typeof onSave === 'function') {
        onSave(updatedTask);
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err?.message || 'Could not save changes. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this task? This cannot be undone.')) {
      setError('');
      setSubmitting(true);
      try {
        await deleteTaskController(task.id);
        if (typeof onDelete === 'function') {
          onDelete(task.id);
        }
        onClose();
      } catch (err) {
        console.error('Error deleting task:', err);
        setError(err?.message || 'Could not delete the task. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const taskLinks = parseTaskLinks(task?.linkToFile);

  if (!task) {
    return null;
  }

  const stateMeta = getStateMeta(stateId);
  const priorityMeta = getPriorityMeta(priorityId);
  const dueText = getTimeUntilDue(task);

  const modal = (
    <div className="tu-modal-overlay" onClick={onClose}>
      <div className="tu-modal-content tu-modal--edit" onClick={(e) => e.stopPropagation()}>
        <header className="tu-modal-top">
          <div className="tu-modal-top__lead">
            <span className={`tu-status-badge ${stateMeta.className}`}>{stateMeta.label}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="tu-modal-title-input"
              placeholder="Task name"
              aria-label="Task name"
            />
          </div>
          <div className="tu-modal-top__actions">
            <button type="button" className="tu-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="tu-btn-save" onClick={handleSave} disabled={submitting}>
              Save changes
            </button>
          </div>
        </header>

        <div className="tu-modal-body">
          <aside className="tu-modal-sidebar">
            <div className="tu-field">
              <label className="tu-field__label" htmlFor="tu-assignee">
                <FaUser size={12} aria-hidden="true" />
                Assignee
              </label>
              <select
                id="tu-assignee"
                className="tu-field__input"
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(Number(e.target.value))}
              >
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="tu-field">
              <label className="tu-field__label" htmlFor="tu-state">
                Status
              </label>
              <select
                id="tu-state"
                className={`tu-field__input tu-field__input--status ${stateMeta.className}`}
                value={stateId}
                onChange={(e) => setStateId(Number(e.target.value))}
              >
                {STATES.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="tu-field">
              <label className="tu-field__label" htmlFor="tu-priority">
                <FaFlag size={12} aria-hidden="true" />
                Priority
              </label>
              <select
                id="tu-priority"
                className={`tu-field__input tu-field__input--priority ${priorityMeta.className}`}
                value={priorityId}
                onChange={(e) => setPriorityId(Number(e.target.value))}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              {dueText && <p className="tu-field__hint tu-field__hint--due">{dueText}</p>}
            </div>

            <div className="tu-field">
              <label className="tu-field__label" htmlFor="tu-sprint">
                Sprint
              </label>
              <select
                id="tu-sprint"
                className="tu-field__input"
                value={sprintId}
                onChange={(e) => setSprintId(Number(e.target.value))}
              >
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="tu-field tu-field--row">
              <div className="tu-field__half">
                <label className="tu-field__label" htmlFor="tu-hours">
                  <FaClock size={12} aria-hidden="true" />
                  Est. hours
                </label>
                <input
                  id="tu-hours"
                  type="number"
                  className="tu-field__input"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  min="0"
                />
              </div>
              {Number(stateId) === 1 && (
                <div className="tu-field__half">
                  <label className="tu-field__label" htmlFor="tu-spent">
                    Spent hours
                  </label>
                  <input
                    id="tu-spent"
                    type="number"
                    className="tu-field__input"
                    value={spentHours}
                    onChange={(e) => setSpentHours(e.target.value)}
                    min="0"
                  />
                </div>
              )}
            </div>

            <div className="tu-meta-list">
              <div className="tu-meta-item">
                <FaCalendarAlt size={12} aria-hidden="true" />
                <span className="tu-meta-item__label">Delivery</span>
                <span className="tu-meta-item__value">
                  {task.sprintEndDate
                    ? new Date(task.sprintEndDate).toLocaleDateString()
                    : '—'}
                </span>
              </div>
              <div className="tu-meta-item">
                <span className="tu-meta-item__label">Created</span>
                <span className="tu-meta-item__value">
                  {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
              <div className="tu-meta-item">
                <span className="tu-meta-item__label">Updated</span>
                <span className="tu-meta-item__value">
                  {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </aside>

          <div className="tu-modal-main">
            <div className="tu-field tu-field--grow">
              <label className="tu-field__label" htmlFor="tu-description">
                Description
              </label>
              <textarea
                id="tu-description"
                className="tu-field__textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What needs to get done?"
              />
            </div>

            <div className="tu-field">
              <label className="tu-field__label">
                <FaLink size={12} aria-hidden="true" />
                Links
              </label>
              <div className="tu-links-panel">
                {taskLinks.length > 0 ? (
                  taskLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tu-link-item"
                    >
                      {link}
                    </a>
                  ))
                ) : (
                  <p className="tu-links-empty">No links attached to this task.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="tu-modal-footer">
          {error && <p className="tu-form-error" role="alert">{error}</p>}
          <button type="button" className="tu-btn-delete" onClick={handleDelete} disabled={submitting}>
            <FaTrash size={13} aria-hidden="true" />
            Delete task
          </button>
        </footer>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    <div data-theme="app-light">{modal}</div>,
    document.body,
  );
};

export default TaskUpdate;
