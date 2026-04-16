import * as tasksService from '../services/TasksService.js';
import Task from '../components/task/Task.js';

export async function fetchTeamTasks(teamId) {
  try {
    const tasks = await tasksService.fetchTeamTasks(teamId);
    console.log('Tasks fetched for team:', tasks);
    return tasks.map((taskData) => new Task(taskData));
  } catch (error) {
    console.error('Error fetching team tasks:', error);
    throw error;
  }
};


export const getAllTasks = async (req, res) => {
  try {
        
    const userId = req.params.userId;
    const tasks = await tasksService.fetchUserTasks(userId);

    const taskInstances = tasks.map((taskData) => new Task(taskData));

    res.json(taskInstances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};