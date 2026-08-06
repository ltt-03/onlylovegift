import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { X } from 'lucide-react';
import Login from './Login';
import Register from './Register';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode } = useContext(AuthContext);

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeAuthModal();
    }
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const isRegister = authModalMode === 'register';

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={handleOverlayClick}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '20px',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        <button 
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(0,0,0,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            color: 'var(--color-text)'
          }}
          title="Đóng"
        >
          <X size={18} />
        </button>

        <div className="auth-flip-container" style={{ margin: 0, width: '100%' }}>
          <div className={`auth-flip-card ${isRegister ? 'is-flipped' : ''}`}>
            <div className="auth-flip-face auth-flip-front">
              <Login isModal={true} />
            </div>
            <div className="auth-flip-face auth-flip-back">
              <Register isModal={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
