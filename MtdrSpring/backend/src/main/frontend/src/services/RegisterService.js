import API_LIST from '../API';

async function parseErrorMessage(response) {
  try {
    const data = await response.json();
    return data?.message || `Request failed (HTTP ${response.status})`;
  } catch {
    return `Request failed (HTTP ${response.status})`;
  }
}

export async function checkDuplicates(username, email) {
  const response = await fetch(API_LIST + '/users/Check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email }),
  });

  if (response.ok) {
    return { available: true };
  }

  if (response.status === 409) {
    const message = await parseErrorMessage(response);
    return { available: false, message };
  }

  const message = await parseErrorMessage(response);
  throw new Error(message);
}

export async function createUser(username, email, password, role) {
  const response = await fetch(API_LIST + '/users/CreateUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, role }),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  return response.json();
}
