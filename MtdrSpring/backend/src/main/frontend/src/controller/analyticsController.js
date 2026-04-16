
import { getNumTasksSprint, getNumTasksAll, getNumCompletedTasksSprint, 
    getNumCompletedTasksAll, getNumPendingTasksSprint, getNumPendingTasksAll,
    getNumLateTasksSprint, getNumLateTasksAll
 } from "../services/AnalyticsService";

export async function fetchNumTasksSprintController(teamId, sprintId) {
    try {
        const data = await getNumTasksSprint(teamId, sprintId);
        return data;
    } catch (error) {
        console.error('Error fetching task count for sprint:', error);
        throw error;
    }
}

export async function fetchNumTasksAllController(teamId) {
    try {
        const data = await getNumTasksAll(teamId);
        return data;
    } catch (error) {
        console.error('Error fetching task count for all sprints:', error);
        throw error;
    }
}

export async function fetchNumCompletedTasksSprintController(teamId, sprintId) {
    try {
        const data = await getNumCompletedTasksSprint(teamId, sprintId);
        return data;
    } catch (error) {
        console.error('Error fetching completed task count for sprint:', error);
        throw error;
    }
}

export async function fetchNumCompletedTasksAllController(teamId) {
    try {
        const data = await getNumCompletedTasksAll(teamId);
        return data;
    } catch (error) {
        console.error('Error fetching completed task count for all sprints:', error);
        throw error;
    }
}

export async function fetchNumPendingTasksSprintController(teamId, sprintId) {
    try {
        const data = await getNumPendingTasksSprint(teamId, sprintId);
        return data;
    } catch (error) {
        console.error('Error fetching pending task count for sprint:', error);
        throw error;
    }
}

export async function fetchNumPendingTasksAllController(teamId) {
    try {
        const data = await getNumPendingTasksAll(teamId);
        return data;
    } catch (error) {
        console.error('Error fetching pending task count for all sprints:', error);
        throw error;
    }
}

export async function fetchNumLateTasksSprintController(teamId, sprintId) {
    try {
        const data = await getNumLateTasksSprint(teamId, sprintId);
        return data;
    } catch (error) {
        console.error('Error fetching late task count for sprint:', error);
        throw error;
    }
}

export async function fetchNumLateTasksAllController(teamId) {
    try {
        const data = await getNumLateTasksAll(teamId);
        return data;
    } catch (error) {
        console.error('Error fetching late task count for all sprints:', error);
        throw error;
    }
}
