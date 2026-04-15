import React, { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";

import getTimeUntilDue from "../../controller/operationsController";
import './TaskModal.css';

const TaskModal = ({ task, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stateId, setStateId] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const [sprintNumber, setSprintNumber] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [states, setStates] = useState([]);
  const [spentHours, setSpentHours] = useState('');

  useEffect(() => {
    if (task) {
      setName(task.name || '');
      setDescription(task.description || '');
      setStateId(task.stateId || '');
      setAssignedUserId(task.userId || '');
      setPriorityId(task.priorityId || '');
      setSprintNumber(task.sprintNumber || '');
      setEstimatedHours(task.cost || '');
      setSpentHours(task.spentHours || '');
    }

    // Mock team members, including the currently assigned user if not in the list
    const mockTeam = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ];

    if (task && task.userId && !mockTeam.some(member => member.id === task.userId)) {
        mockTeam.push({ id: task.userId, name: task.userName });
    }

    setTeamMembers(mockTeam);

    const mockStates = [
        { id: 1, name: 'Done' },
        { id: 2, name: 'Pending' },
        { id: 3, name: 'On Going' },
        { id: 4, name: 'Late' },
    ];
    setStates(mockStates);
    
  }, [task]);

  const handleSave = () => {
    if (stateId === 1 )
      {
        onSave({
          ...task,
          name,
          description,
          stateId,
          userId: assignedUserId,
          userName: teamMembers.find(member => member.id === assignedUserId)?.name || '',
          priorityId,
          sprintNumber,
          cost: estimatedHours,
          spentHours: spentHours

        });
      }
    onSave({
      ...task,
      name,
      description,
      stateId,
      userId: assignedUserId,
      userName: teamMembers.find(member => member.id === assignedUserId)?.name || '',
      priorityId,
      sprintNumber,
      cost: estimatedHours,
      spentHours: null

    });
  };

  const getPriorityClass = () => {
    switch (task.getPriorityLabel()) {
      case "H":
        return "priority-high-modal";
      case "M":
        return "priority-medium-modal";
      case "L":
        return "priority-low-modal";
      default:
        return "";
    }
  };

  if (!task) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <div className='modal-header-container'>
          <div className='modal-header'>Edit Task: </div>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='modal-header-input'
          />
          <div className="modal-actions">
            <button className="btn-save" onClick={handleSave}>
            Save
            </button>
            <button className="btn-close" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>

        <div className='modal-task-info'>
          <div className="modal-task-info-task-column">
            <div className="modal-task-info-task-row-person">
              <div className="modal-task-info-task-row-person-tag">
                Assigned to:
              </div>
              <div className="modal-task-info-task-row-person-name">
                <FaUser className="modal-task-info-task-row-person-icon" />
                <select className="modal-task-info-task-row-person-name" value={assignedUserId} onChange={(e) => setAssignedUserId(Number(e.target.value))}>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-task-info-task-row-priority">
              <div className="modal-task-info-task-row-priority-tag">
                Priority:
              </div>
              <div className="modal-task-info-task-row-priority-value">
                <div className={`card-info-pill-modal ${getPriorityClass()}`}>
                  {task.getPriorityLabel()}
                </div>
                <div className="modal-overdue-text">{getTimeUntilDue(task)}</div>
              </div>
            </div>
            <div className="modal-task-info-task-row-general">
              <div className="modal-task-info-task-row-general-tag">
                General:
              </div>
              <div className='modal-task-info-task-col-general'>
                <div className='modal-task-info-task-col-general-text'>Sprint Number: </div>
                <input 
                  type="text"
                  value={sprintNumber}
                  onChange={(e) => setSprintNumber(e.target.value)}
                  className='modal-task-info-task-col-general-input'
                />
              </div>
              <div className='modal-task-info-task-col-general'>
                <div className='modal-task-info-task-col-general-text'>Estimated Hours: </div>
                <input 
                  type="text"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  className='modal-task-info-task-col-general-input'
                />
              </div>
              <div className='modal-task-info-task-col-general'>
                <div className='modal-task-info-task-col-general-text'>Deliver Date: </div>
                <div className="modal-task-info-task-col-general-text-value">
                  {task.sprintEndDate.toLocaleDateString()}
                </div>
              </div>
              <div className='modal-task-info-task-col-general'>
                <div className='modal-task-info-task-col-general-text'>Created at: </div>
                <div className="modal-task-info-task-col-general-text-value">
                  {task.createdAt.toLocaleDateString()}
                </div>
              </div>
              <div className='modal-task-info-task-col-general'>
                <div className='modal-task-info-task-col-general-text'>Updated at: </div>
                <div className="modal-task-info-task-col-general-text-value">
                  {task.updatedAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-task-info-description-column">
            <div className="modal-task-info-task-row-state">
              <div className="modal-task-info-task-row-state-tag">State</div>
              <div className="state-select-wrapper">
                <select className="state-select" value={stateId} onChange={(e) => setStateId(Number(e.target.value))}>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {stateId === 1 && 
                <div className="modal-estimated-hours">
                  <div className="modal-estimated-hours-text">Spent Hours: </div>
                  <input 
                  type="text"
                  value={spentHours}
                  onChange={(e) => setSpentHours(e.target.value)}
                  className='modal-task-info-task-col-general-input-estimated-hours'
                />
                </div>}
              </div>
            </div>
            <div className="modal-task-info-task-row-description">
              <div className="modal-task-info-task-row-description-tag">
                Description:
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='modal-task-info-task-row-description-input'
              />
            </div>
          </div>
          <div className="modal-task-info-link-column">
            <div className="modal-task-info-link-column-tag">
              Links:
            </div>
            <div className="modal-task-info-link-column-content">
              {task.links && task.links.length > 0 ? (
                task.links.map((link, index) => (
                  <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="modal-task-info-link">
                    {link}
                  </a>
                ))
              ) : (
                <div className="modal-task-info-link-column-empty">No links available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
