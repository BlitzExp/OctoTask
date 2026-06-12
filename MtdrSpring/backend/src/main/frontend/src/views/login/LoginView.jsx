import React, { useMemo, useState } from 'react';
import './LoginView.css';
import { handleLogin } from '../../controller/logInController';
import PasswordInput from '../../components/auth/PasswordInput';
import AuthBrandPanel from '../../components/brand/AuthBrandPanel';
import { OCTOBUDDY_IMAGES, pickRandomImageKeys } from '../../components/brand/OctoBuddyDecor';
import OctoMascot from '../../components/brand/OctoMascot';

function LoginView({ onLogin, onGoToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const formBuddy = useMemo(() => pickRandomImageKeys(1)[0] ?? 'wave', []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const userData = await handleLogin(username, password);
      if (userData) {
        onLogin(userData);
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      const message =
        error?.message === 'Invalid credentials'
          ? 'Login failed. Please check your username and password.'
          : error?.message?.startsWith('Cannot reach the API')
            ? error.message
            : 'An error occurred during login. Please try again later.';
      alert(message);
    }
  }

  return (
    <div className="auth-split auth-split--login">
      <AuthBrandPanel variant="login" />

      <div className="auth-form-panel">
        <img src={OCTOBUDDY_IMAGES[formBuddy]} alt="" className="auth-form-buddy auth-form-buddy--wave" aria-hidden="true" />
        <div className="auth-form-buddy auth-form-buddy--svg" aria-hidden="true">
          <OctoMascot mood="chill" size={48} />
        </div>
        <section className="auth-card" aria-labelledby="login-heading">
          <header className="auth-card-header">
            <p className="auth-card-eyebrow">Hey, welcome back</p>
            <h2 id="login-heading" className="auth-card-title">Sign in</h2>
            <p className="auth-card-lede">
              Your OctoBuddy workspace is ready when you are.
            </p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="inputGroup">
              <label className="loginLabel" htmlFor="username">
                Username or email
              </label>
              <input
                className="loginInput"
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="you@company.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <PasswordInput
              id="password"
              label="Password"
              labelClassName="loginLabel"
              inputClassName="loginInput"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="loginButton auth-submit-btn">
              Dive in
            </button>
          </form>

          <footer className="auth-card-footer">
            <p className="auth-card-footer-text">
              New to the pod?{' '}
              <button
                type="button"
                className="auth-text-link"
                onClick={() => onGoToRegister('register')}
              >
                Create an account
              </button>
            </p>
          </footer>
        </section>
      </div>
    </div>
  );
}

export default LoginView;
