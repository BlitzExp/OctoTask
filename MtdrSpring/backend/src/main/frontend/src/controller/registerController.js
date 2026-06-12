import { checkDuplicates, createUser } from '../services/RegisterService';

export async function registerUser(username, email, password, role) {
  const availability = await checkDuplicates(username, email);
  if (!availability.available) {
    throw new Error(availability.message || 'Username or email is already taken.');
  }

  return createUser(username, email, password, role);
}
