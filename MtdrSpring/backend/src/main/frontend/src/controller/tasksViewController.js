import * as tasksService from "../services/TasksService.js";
import Task from "../components/task/Task.js";

export async function fetchTeamTasksCon(teamId) {
  try {
    console.log("Fetching tasks for team ID:", teamId);
    const tasks = await tasksService.fetchTeamTasks(teamId);
    console.log("Tasks fetched for team: ", tasks);
    //return tasks;
    return tasks.map(
      (taskData) =>
        new Task({
          id: taskData.id,
          userId: taskData.userID ?? taskData.userId,
          userName: taskData.userName ?? taskData.username,
          name: taskData.name,
          description: taskData.description,
          sprintId: taskData.sprintID ?? taskData.sprintId,
          sprintNumber: taskData.sprintNumber,
          sprintEndDate: taskData.sprintEndDate,
          stateId: taskData.stateID ?? taskData.stateId,
          priorityId: taskData.priorityID ?? taskData.priorityId,
          linkToFile: taskData.linkToFile,
          createdAt: taskData.createdAt,
          updatedAt: taskData.updatedAt,
          cost: taskData.cost,
          spentHours: taskData.spentHours,
          visibility: taskData.visibility,
        }),
    );
  } catch (error) {
    console.error("Error fetching team tasks:", error);
    throw error;
  }
}

export const getAllTasks = async (userId) => {
  try {
    const tasks = await tasksService.fetchUserTasks(userId);
    const taskInstances = tasks.map(
      (taskData) =>
        new Task({
          id: taskData.id,
          userId: taskData.userID ?? taskData.userId,
          userName: taskData.userName ?? taskData.username,
          name: taskData.name,
          description: taskData.description,
          sprintId: taskData.sprintID ?? taskData.sprintId,
          sprintNumber: taskData.sprintNumber,
          sprintEndDate: taskData.sprintEndDate,
          stateId: taskData.stateID ?? taskData.stateId,
          priorityId: taskData.priorityID ?? taskData.priorityId,
          linkToFile: taskData.linkToFile,
          createdAt: taskData.createdAt,
          updatedAt: taskData.updatedAt,
          cost: taskData.cost,
          spentHours: taskData.spentHours,
          visibility: taskData.visibility,
        }),
    );
    return taskInstances;
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
};

export async function createTask(taskData) {
  try {
    // devuelve el id de la tarea creada
    const createdTask = await tasksService.createTask(taskData);

    const taskInstance = new Task({
      id: createdTask.id,
      userId: createdTask.userID ?? createdTask.userId,
      userName: createdTask.userName ?? createdTask.username,
      name: createdTask.name,
      description: createdTask.description,
      sprintId: createdTask.sprintID ?? createdTask.sprintId,
      sprintNumber: createdTask.sprintNumber,
      sprintEndDate: createdTask.sprintEndDate,
      stateId: createdTask.stateID ?? createdTask.stateId,
      priorityId: createdTask.priorityID ?? createdTask.priorityId,
      linkToFile: createdTask.linkToFile,
      createdAt: createdTask.createdAt,
      updatedAt: createdTask.updatedAt,
      cost: createdTask.cost,
      spentHours: createdTask.spentHours,
      visibility: createdTask.visibility,
    });

    console.log("Task created successfully:", taskInstance);
    return taskInstance;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}