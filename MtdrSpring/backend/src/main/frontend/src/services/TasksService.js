import API_LIST from "../API";
import Task from "../components/task/Task";

var mockTasks = [
  new Task({
    id: 1,
    userId: 1,
    name: "Task 1",
    userName: "John Doe",
    description: "Description for Task 1",
    sprintId: 1,
    sprintNumber: 1,
    sprintEndDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    stateId: 2,
    priorityId: 1,
    linkToFile: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    cost: 100,
    spentHours: 5,
    visibility: 0,
  }),
  new Task({
    id: 2,
    userId: 1,
    name: "Task 2",
    userName: "John Doe",
    description: "Description for Task 2",
    sprintId: 1,
    sprintNumber: 1,
    sprintEndDate: new Date(),
    stateId: 3,
    priorityId: 2,
    linkToFile: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    cost: 200,
    spentHours: 10,
    visibility: 0,
  }),
  new Task({
    id: 3,
    userId: 1,
    name: "Task 3",
    userName: "John Doe",
    description: "Description for Task 3",
    sprintId: 1,
    sprintNumber: 1,
    sprintEndDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    stateId: 4,
    priorityId: 3,
    linkToFile: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    cost: 300,
    spentHours: 15,
    visibility: 0,
  }),
  new Task({
    id: 4,
    userId: 1,
    name: "Task 4",
    description: "Description for Task 4",
    sprintId: 1,
    sprintNumber: 1,
    sprintEndDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    stateId: 1,
    priorityId: 1,
    linkToFile: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    cost: 400,
    spentHours: 20,
    visibility: 0,
  }),
];

export function fetchTeamTasks(teamId) {
  return fetch(API_LIST + `/tasks/team/${teamId}`).then((response) => {
    if (!response.ok) {
      throw new Error("Something went wrong ...");
    }
    return response.json();
  });
}

export function fetchUserTasks(userId) {
  return fetch(API_LIST + `/tasks/user/${userId}`).then((response) => {
    if (!response.ok) {
      throw new Error("Something went wrong ...");
    }
    return response.json();
  });
}

export function fetchUserTaskMock(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTasks.filter((task) => task.userId === userId));
    }, 1000);
  });
}
