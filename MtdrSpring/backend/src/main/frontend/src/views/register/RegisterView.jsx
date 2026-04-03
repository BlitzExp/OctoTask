import React, { useState } from 'react';
import './RegisterView.css';
import { checkDuplicates, createUser } from '../../services/RegisterService';

function RegisterView({ onRegister, onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <form onSubmit={handleSubmit}>
        <h2>Registro</h2>
        <button type="submit">Registrar</button>
      </form>
    </main>
  );
}

export default RegisterView;
