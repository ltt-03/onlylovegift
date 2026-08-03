import React from 'react';
import { useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const AuthContainer = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1rem', minHeight: '80vh', alignItems: 'center' }}>
      <div className="auth-flip-container">
        <div className={`auth-flip-card ${isRegister ? 'is-flipped' : ''}`}>
          <div className="auth-flip-face auth-flip-front">
            <Login />
          </div>
          <div className="auth-flip-face auth-flip-back">
            <Register />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
