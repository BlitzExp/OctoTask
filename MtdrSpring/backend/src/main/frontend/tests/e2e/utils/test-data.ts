// Create interfaces, types, and constants and group them together
export interface UserCredentials {
  email: string;
  password: string;
  role: 'developer' | 'manager';
}

export const USERS = {
  developer: { email: 'Diego', password: 'hola', role: 'developer' } as UserCredentials,
  manager: { email: 'JDD', password: 'juanito1234', role: 'manager' } as UserCredentials,
  invalid: { email: 'wrong@test.com', password: 'bad', role: 'developer' } as UserCredentials,
};

export const SELECTORS = {
  loginBtn: 'button[type="submit"]',
  emailInput: '#username',   // Changed from input[name="email"]
  passwordInput: '#password', // Changed from input[name="password"]
  errorMessage: '.error-toast', // Double check this matches your actual alert/toast class later!
};

// Data for parameterization
export const TASKS_TO_CREATE = [
  { title: 'Update UI', desc: 'Fix navbar CSS', priority: 'High' },
  { title: 'Write Tests', desc: 'Add Playwright E2E', priority: 'Medium' },
];