import React, { useMemo, useState } from 'react';
import './RegisterView.css';
import { registerUser } from '../../controller/registerController';

import PasswordInput from '../../components/auth/PasswordInput';
import AuthBrandPanel from '../../components/brand/AuthBrandPanel';
import { OCTOBUDDY_IMAGES, pickRandomImageKeys } from '../../components/brand/OctoBuddyDecor';
import OctoMascot from '../../components/brand/OctoMascot';

function RegisterView({ onRegister, onBackToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const formBuddy = useMemo(() => pickRandomImageKeys(1)[0] ?? 'party', []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const userData = await registerUser(username, email, password, role);
      if (userData) {
        onRegister(userData);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err?.message || 'An error occurred during registration. Please try again.');
    }
  }

  return (
    <div className="auth-split auth-split--register registerViewContainer">
      <AuthBrandPanel variant="register" />
      <div className="auth-form-panel">
        <img src={OCTOBUDDY_IMAGES[formBuddy]} alt="" className="auth-form-buddy auth-form-buddy--party" aria-hidden="true" />
        <div className="auth-form-buddy auth-form-buddy--svg" aria-hidden="true">
          <OctoMascot mood="celebrate" size={52} />
        </div>
        <section className="auth-card" aria-labelledby="register-heading">
          <header className="auth-card-header">
            <p className="auth-card-eyebrow">Join the pod</p>
            <h2 id="register-heading" className="auth-card-title">Create account</h2>
            <p className="auth-card-lede">
              A few details and OctoBuddy will have you swimming in no time.
            </p>
          </header>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label className="registerLabel" htmlFor="email">Email</label>
              <input
                className="registerInput"
                id="email"
                type="text"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="inputGroup">
              <label className="registerLabel" htmlFor="username">Username</label>
              <input
                className="registerInput"
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <PasswordInput
              id="password"
              label="Password"
              labelClassName="registerLabel"
              inputClassName="registerInput"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordInput
              id="confirmPassword"
              label="Confirm password"
              labelClassName="registerLabel"
              inputClassName="registerInput"
              autoComplete="new-password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="inputGroup">
              <label className="registerLabel" htmlFor="role">Role</label>
              <select
                className="registerInput"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled hidden>
                  Select your role
                </option>
                <option value="user">Developer</option>
                <option value="admin">Manager</option>
              </select>
            </div>
            {error && (
              <p className="auth-form-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="registerButton auth-submit-btn">
              Join OctoBuddy
            </button>
          </form>
          <footer className="auth-card-footer">
            <p className="auth-card-footer-text">
              Already have an account?{' '}
              <button
                type="button"
                className="auth-text-link"
                onClick={() => onBackToLogin('login')}
              >
                Sign in
              </button>
            </p>
          </footer>
        </section>
      </div>
    </div>
  );
}

export default RegisterView;
