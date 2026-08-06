import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Loader2, Rocket } from 'lucide-react';

export default function UploadProgressModal() {
  const { uploadProgress } = useContext(AuthContext);

  if (!uploadProgress.isOpen) return null;

  const { percent, text } = uploadProgress;
  const isDone = percent === 100;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999, // Ensure it's on top of everything
    }}>
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '20px',
        padding: '40px',
        width: '90%',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'zoomIn 0.3s ease-out forwards'
      }}>
        
        {/* Icon & Status */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          {isDone ? (
            <CheckCircle2 size={60} color="#10b981" style={{ animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
          ) : percent > 0 ? (
            <Rocket size={60} color="var(--color-primary)" style={{ animation: 'bounce 2s infinite' }} />
          ) : (
            <Loader2 size={60} color="var(--color-primary)" style={{ animation: 'spin 1.5s linear infinite' }} />
          )}
        </div>

        <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', color: 'var(--color-text)' }}>
          {isDone ? 'Hoàn tất!' : 'Đang tải lên...'}
        </h3>
        
        <p style={{ color: 'var(--color-text-light)', marginBottom: '30px', fontSize: '0.95rem' }}>
          {text}
        </p>

        {/* Progress Bar Container */}
        <div style={{
          width: '100%',
          height: '12px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Progress Bar Fill */}
          <div style={{
            height: '100%',
            width: `${percent}%`,
            background: 'linear-gradient(90deg, var(--color-primary), #ff9a9e)',
            borderRadius: '10px',
            transition: 'width 0.4s ease-out',
            boxShadow: '0 0 10px var(--color-primary)'
          }}></div>
        </div>

        {/* Percentage Text */}
        <div style={{ marginTop: '15px', fontWeight: 'bold', color: 'var(--color-text)', fontSize: '1.2rem' }}>
          {percent}%
        </div>

      </div>

      <style>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
