import API_LIST from '../API';

export function logIn(username, password) {
  return fetch(API_LIST + '/users/Login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      return response.json();
    })
    .catch((error) => {
      if (error instanceof TypeError) {
        throw new Error(
          'Cannot reach the API. Start the backend on port 8080:\n' +
            'cd MtdrSpring/backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local\n' +
            'Then restart npm start if you changed setupProxy.js.'
        );
      }
      throw error;
    });
}
