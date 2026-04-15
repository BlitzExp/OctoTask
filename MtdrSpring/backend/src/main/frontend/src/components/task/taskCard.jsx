import React from "react";
import "./taskCard.css";
import { FaUser } from "react-icons/fa";

const TaskCard = ({ task, onCardClick }) => {
  function daysUntilDue() {
    const today = new Date();
    const dueDate = new Date(task.sprintEndDate);
    const timeDiff = dueDate - today;

    const days = Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((Math.abs(timeDiff) / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((Math.abs(timeDiff) / 1000 / 60) % 60);

    if (timeDiff < 0) {
      if (days > 0) {
        return `Late by ${days} day${days > 1 ? "s" : ""}`;
      }
      if (hours > 0) {
        return `Late by ${hours} hour${hours > 1 ? "s" : ""}`;
      }
      return `Late by ${minutes} minute${minutes > 1 ? "s" : ""}`;
    }

    if (days > 0) {
      return `Due in ${days} day${days > 1 ? "s" : ""}`;
    }
    if (hours > 0) {
      return `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return `Due in ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  const getPriorityClass = () => {
    switch (task.getPriorityLabel()) {
      case "H":
        return "priority-high";
      case "M":
        return "priority-medium";
      case "L":
        return "priority-low";
      default:
        return "";
    }
  };

  return (
    <div className="card-container" onClick={() => onCardClick(task)}>
      <div className="card-header">
        <div className="card-title">{task.name}</div>
      </div>
      <div className="card-information">
        <div className="card-container-info">
          <div className="card-container-info-text">Difficulty</div>
          <div className={`card-info-pill ${getPriorityClass()}`}>
            {task.getPriorityLabel()}
          </div>
        </div>
        <div className="card-container-info">
          <div className="card-container-info-text">Cost</div>
          <div className="card-info-pill cost-pill">{task.cost}</div>
        </div>
        <div className="card-container-info">
          <div className="card-container-info-text">Delivery Date</div>
          <div className="card-info-pill date-pill">
            {task.sprintEndDate.toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="card-overdue">
        <div className="card-overdue-text">{daysUntilDue()}</div>
      </div>

      <div className="card-person">
        <FaUser />
        <div className="card-person-text">{task.userName}</div>
      </div>
    </div>
  );
};

export default TaskCard;