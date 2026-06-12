import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

function PasswordInput({
  id,
  label,
  labelClassName,
  inputClassName,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="inputGroup">
      <label className={labelClassName} htmlFor={id}>
        {label}
      </label>
      <div className="auth-password-wrap">
        <input
          className={`${inputClassName} auth-password-input`}
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          aria-controls={id}
        >
          {visible ? (
            <MdVisibilityOff size={20} aria-hidden="true" />
          ) : (
            <MdVisibility size={20} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
