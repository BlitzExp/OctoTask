import React, { useState } from 'react';
import './RegisterView.css';
import { checkDuplicates, createUser } from '../../services/RegisterService';

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
          <h2 class="pageTitle">Registro</h2>

           <div class="inputGroup">
            <label class="registerLabel">Correo</label>
            <input class="registerInput"
              id="email"
              type="text"
              placeholder="Ingrese su correo electronico"
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
              placeholder="Ingrese su usuario"
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
              placeholder="Ingrese su contraseña"
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
              placeholder="Confirme su contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" class="registerButton">Registrar</button>
        </form>
      </div>
    </main>
  );
}

export default RegisterView;
