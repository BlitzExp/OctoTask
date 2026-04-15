import * as tasksService from '../services/TasksService.js';
import Task from '../components/task/Task.js';


export const getAllTasks = async (req, res) => {
  try {
    if (true)
        {
            const userId = req.params.userId;
            const tasks = await tasksService.fetchUserTaskMock(userId);
            const taskInstances = tasks.map((taskData) => new Task(taskData));
            res.json(taskInstances);
            return;
        }
        
    const userId = req.params.userId;
    const tasks = await tasksService.fetchUserTasks(userId);

    const taskInstances = tasks.map((taskData) => new Task(taskData));

    res.json(taskInstances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};