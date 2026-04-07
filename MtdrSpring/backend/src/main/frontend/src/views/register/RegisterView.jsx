import React, { useState } from 'react';
import './RegisterView.css';
import { checkDuplicates, createUser } from '../../services/RegisterService';
import logo from '../../assets/logo.png';

function RegisterView({ onRegister, onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const success = checkDuplicates(username, email, password, role);
    if (!success) {
      setError('Nombre de usuario o correo electrónico ya registrados.');
    } else {
      const createUserSuccess = createUser(username, email, password, role);
      if (!createUserSuccess) {
        setError('Error al crear el usuario. Inténtalo de nuevo.');
      } else {
        onRegister(username, password);
      }
    }
  }

  return (
    <main>
      <button onClick={onBackToLogin}>Volver al Login</button>
      <div class="registerContainer">
        <form onSubmit={handleSubmit}>

          <div class="card-header">
            <div class="brand-title">
              <img src={logo} alt="OctoTask" class="brand-icon" />
              <h2 class="brand-text">OCTO</h2>
              <h2 class="brand-text2">Task</h2>
            </div>
            <p class="brand-subtitle">More arms for your tasks</p>
          </div>

          <h2 class="pageTitle">Registro</h2>

           <div class="inputGroup">
            <label class="registerLabel">Correo</label>
            <input class="registerInput"
              id="email"
              type="text"
              placeholder="Ingrese su correo electronico..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div class="inputGroup">
            <label class="registerLabel">Nombre de usuario</label>
            <input class="registerInput"
              id="username"
              type="text"
              placeholder="Ingrese su usuario..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div class="inputGroup">
            <label class="registerLabel">Contraseña</label>
            <input class="registerInput"
              id="password"
              type="password"
              placeholder="Ingrese su contraseña..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div class="inputGroup">
            <label class="registerLabel">Confirmar Contraseña</label>
            <input class="registerInput"
              id="confirmPassword"
              type="password"
              placeholder="Confirme su contraseña..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div class="inputGroup">
            <label class="registerLabel">Rol</label>
            <select 
              class="registerInput"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled hidden>Seleccione su rol...</option>              
              <option value="user">Desarrollador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button type="submit" class="registerButton">Registrar</button>
          <span class="underlinedText" onClick={() => onBackToLogin('login')}> Iniciar Sesion </span>
        </form>
      </div>
    </main>
  );
}

export default RegisterView;
