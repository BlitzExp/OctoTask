import { getAllSprints } from "../services/FilterService";

export async function getAllSprintsController(teamId) {
  try {
    return await getAllSprints(teamId);
  } catch (error) {
    console.error("Error fetching sprints:", error);
    throw error;
  }
}
