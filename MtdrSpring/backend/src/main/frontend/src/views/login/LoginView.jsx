import React, { useState } from 'react';
import './LoginView.css';
import logo from '../../assets/logo.png';

function LoginView({ onLogin, onGoToRegister }) {
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

          <div class="card-header">
            <div class="brand-title">
              <img src={logo} alt="OctoTask" class="brand-icon" />
              <h2 class="brand-text">OCTO</h2>
              <h2 class="brand-text2">Task</h2>
            </div>
            <p class="brand-subtitle">More arms for your tasks</p>
          </div>

          <h2 class="pageTitle">Iniciar Sesión</h2>
          
          <div class="inputGroup">
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

          <div class="inputGroup">
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
          <span class="underlinedText" onClick={ () => onGoToRegister('register')}> Registrar </span>
        </form>
      </div>
    </main>
  );
}

export default LoginView;
