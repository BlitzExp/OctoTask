import React, { useState } from 'react';
import './LoginView.css';

function LoginView({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onLogin(username, password);
  }

  return (
    <main>
      <div class="loginContainer">
        <form onSubmit={handleSubmit}>
          <h2 class="pageTitle">Iniciar Sesión</h2>
          
          <div>
            <label class="loginLabel">Nombre de usuario</label>
            <input class="loginInput"
              id="username"
              type="text"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label class="loginLabel">Contraseña</label>
            <input class="loginInput"
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" class="loginButton">Iniciar Sesión</button>
        </form>
      </div>
    </main>
  );
}

export default LoginView;
