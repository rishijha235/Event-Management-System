import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = ({ title, links }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>{title}</h1>
        <div className="navbar-links">
          {links && links.map((link, idx) => (
            link.isButton ? (
              <button key={idx} onClick={link.onClick}>
                {link.label}
              </button>
            ) : (
              <Link key={idx} to={link.href}>
                {link.label}
              </Link>
            )
          ))}
        </div>
      </div>
    </nav>
  );
};

export const Alert = ({ type, message }) => {
  if (!message) return null;
  return <div className={`alert alert-${type}`}>{message}</div>;
};

export const FormInput = ({ label, name, type = 'text', value, onChange, required = false, placeholder = '' }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export const FormSelect = ({ label, name, options, value, onChange, required = false }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
      <select id={name} name={name} value={value} onChange={onChange} required={required}>
        <option value="">-- Select {label} --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const FormRadio = ({ label, name, options, value, onChange, required = false }) => {
  return (
    <div className="form-group">
      <label>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
      <div className="radio-group">
        {options.map((opt) => (
          <label key={opt.value}>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              required={required}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export const FormCheckbox = ({ label, name, checked, onChange }) => {
  return (
    <div className="form-group">
      <label>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
        />
        {label}
      </label>
    </div>
  );
};

export const Button = ({ label, onClick, type = 'button', variant = 'primary', disabled = false, block = false }) => {
  const className = `btn btn-${variant} ${block ? 'btn-block' : ''}`;
  return (
    <button className={className} type={type} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export const Card = ({ title, children, footer }) => {
  return (
    <div className="card">
      {title && <h3>{title}</h3>}
      {children}
      {footer && <div style={{ marginTop: '1rem' }}>{footer}</div>}
    </div>
  );
};

export const Loading = () => (
  <div className="loading">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);
