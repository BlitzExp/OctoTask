export default class Task {
  constructor({
    id,
    userId,
    userName,
    name,
    description,
    sprintNumber,
    sprintEndDate,
    stateId,
    priorityId,
    linkToFile,
    visible = 1,
    createdAt,
    updatedAt,
    cost,
    spentHours,
    visibility = 0,
  }) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.name = name;
    this.description = description;
    this.sprintNumber = sprintNumber;
    this.sprintEndDate = sprintEndDate;
    this.stateId = stateId;
    this.priorityId = priorityId;
    this.linkToFile = linkToFile;
    this.visible = visible;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.cost = cost;
    this.spentHours = spentHours;
    this.visibility = visibility;
  }

  isVisible() {
    return this.visible === 1;
  }

  getPriorityLabel() {
    const map = {
      1: "L",
      2: "M",
      3: "H",
    };
    return map[this.priorityId] || "Unknown";
  }

  getStateLabel() {
    const map = {
      1: "Done",
      2: "Pending",
      3: "On Going",
      4: "Late",
    };
    return map[this.stateId] || "Unknown";
  }
}
