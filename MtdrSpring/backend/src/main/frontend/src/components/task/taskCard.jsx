import React, { useRef } from 'react';
import './taskCard.css';
import { FaUser } from 'react-icons/fa';
import { getTimeUntilDue } from '../../controller/operationsController';

const TaskCard = ({
  task,
  onCardClick,
  onDragStart,
  onDragEnd,
  isDragging = false,
  isSaving = false,
  dragDisabled = false,
}) => {
  const suppressClickRef = useRef(false);

  const getPriorityMeta = () => {
    switch (task.getPriorityLabel()) {
      case 'H':
        return { className: 'priority-high', label: 'High', dotClass: 'priority-dot--high' };
      case 'M':
        return { className: 'priority-medium', label: 'Medium', dotClass: 'priority-dot--medium' };
      case 'L':
        return { className: 'priority-low', label: 'Low', dotClass: 'priority-dot--low' };
      default:
        return { className: '', label: '—', dotClass: '' };
    }
  };

  const priority = getPriorityMeta();

  const handleDragStart = (event) => {
    if (dragDisabled || isSaving) {
      event.preventDefault();
      return;
    }
    suppressClickRef.current = false;
    event.dataTransfer.setData('application/x-octotask-id', String(task.id));
    event.dataTransfer.effectAllowed = 'move';
    onDragStart?.(task);
  };

  const handleDragEnd = () => {
    suppressClickRef.current = true;
    onDragEnd?.();
  };

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onCardClick(task);
  };

  const classNames = [
    'card-container',
    isDragging ? 'card-container--dragging' : '',
    isSaving ? 'card-container--saving' : '',
    dragDisabled ? 'card-container--drag-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      draggable={!dragDisabled && !isSaving}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Open task: ${task.name}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
      aria-grabbed={isDragging}
      aria-busy={isSaving}
    >
      <div className="card-header">
        <span className={`priority-dot ${priority.dotClass}`} aria-hidden="true" />
        <div className="card-title">{task.name}</div>
      </div>
      <div className="card-information">
        <div className="card-container-info">
          <div className="card-container-info-text">Priority</div>
          <div className={`card-info-pill ${priority.className}`}>
            {priority.label}
          </div>
        </div>
        <div className="card-container-info">
          <div className="card-container-info-text">Est. hours</div>
          <div className="card-info-pill cost-pill">{task.cost}</div>
        </div>
        <div className="card-container-info">
          <div className="card-container-info-text">Delivery Date</div>
          <div className="card-info-pill date-pill">
            {task.sprintEndDate
              ? new Date(task.sprintEndDate).toLocaleDateString()
              : 'No date'}
          </div>
        </div>
      </div>

      <div className="card-overdue">
        <div className="card-overdue-text">{getTimeUntilDue(task)}</div>
      </div>

      <div className="card-person">
        <FaUser className="card-person-icon" size={20} />
        <div className="card-person-text">{task.userName}</div>
      </div>
    </div>
  );
};

export default TaskCard;
