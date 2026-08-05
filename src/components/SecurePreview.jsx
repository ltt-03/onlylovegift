import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, RefreshCw, Lock, X } from 'lucide-react';

export default function SecurePreview({ templateId, autoLoad = false }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'
  // Chỉ hiện màn hình cảnh báo cho x-mas-tree (template duy nhất cần cam/mic)
  // Tất cả template khác → tự load ngay, không hỏi
  const needsWarning = templateId === 'x-mas-tree';
  const [isStarted, setIsStarted] = useState(!needsWarning);

  const fetchToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/demo/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ templateId })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
      } else {
        setError(data.message || 'Lỗi lấy mã bảo mật');
      }
    } catch (err) {
      console.error(err);
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (templateId && isStarted) {
      fetchToken();
    }
  }, [templateId, isStarted]);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const iframeUrl = token ? `${apiUrl}/demo/secure/${token}` : '';

  if (!isStarted) {
    return (
      <div style={{
        width: '100%',
        padding: '40px 24px',
        background: 'var(--color-bg-alt, #1a1b1e)',
        border: '1px dashed var(--color-border, #2c2e33)',
        borderRadius: '16px',
        marginTop: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <Monitor size={48} color="var(--color-border, #2c2e33)" />
        <h3 style={{ margin: 0 }}>Xem Trước Cây Thông Noel 3D</h3>
        <p style={{ color: '#868e96', textAlign: 'center', fontSize: '0.9rem', margin: 0, maxWidth: '400px' }}>
          Mẫu này sử dụng nhạc nền và có thể yêu cầu quyền truy cập Camera/Micro để tương tác.
        </p>
        <button 
          onClick={(e) => { e.preventDefault(); setIsStarted(true); }}
          style={{
            marginTop: '16px',
            background: 'var(--color-primary, #ef4444)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          Bắt Đầu Xem Trước
        </button>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      background: 'var(--color-bg-alt, #1a1b1e)',
      border: '1px solid var(--color-border, #2c2e33)',
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      marginTop: '24px'
    }}>
      {/* Header Toolbar */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border, #2c2e33)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#25262b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={16} color="#10b981" />
          <span style={{ fontSize: '0.9rem', color: '#c1c2c5', fontWeight: '500' }}>Xem trước giao diện (Bảo mật)</span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            background: 'var(--color-bg, #1a1b1e)',
            borderRadius: '8px',
            padding: '4px',
            border: '1px solid var(--color-border, #2c2e33)'
          }}>
            <button
              onClick={(e) => { 
                e.preventDefault(); 
                if (viewMode !== 'mobile') {
                  setViewMode('mobile'); 
                  fetchToken();
                }
              }}
              style={{
                background: viewMode === 'mobile' ? 'var(--color-border, #2c2e33)' : 'transparent',
                border: 'none',
                color: viewMode === 'mobile' ? '#fff' : '#868e96',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Smartphone size={16} /> <span style={{ fontSize: '0.85rem' }}>Mobile</span>
            </button>
            <button
              onClick={(e) => { 
                e.preventDefault(); 
                if (viewMode !== 'desktop') {
                  setViewMode('desktop'); 
                  fetchToken();
                }
              }}
              style={{
                background: viewMode === 'desktop' ? 'var(--color-border, #2c2e33)' : 'transparent',
                border: 'none',
                color: viewMode === 'desktop' ? '#fff' : '#868e96',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Monitor size={16} /> <span style={{ fontSize: '0.85rem' }}>Desktop</span>
            </button>
          </div>
          
          <button
            onClick={(e) => { e.preventDefault(); fetchToken(); }}
            title="Tải lại bản xem trước"
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border, #2c2e33)',
              color: '#c1c2c5',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-border, #2c2e33)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
          </button>
          
          {!autoLoad && (
            <button
              onClick={(e) => { e.preventDefault(); setIsStarted(false); setToken(null); }}
              title="Đóng bản xem trước"
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border, #2c2e33)',
                color: '#fa5252',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(250, 82, 82, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        background: '#1a1b1e',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        position: 'relative'
      }}>
        {loading ? (
          <div style={{ color: '#868e96', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <RefreshCw size={24} className="spin" color="#10b981" />
            <span>Đang tạo liên kết xem trước an toàn...</span>
          </div>
        ) : error ? (
          <div style={{ color: '#fa5252', textAlign: 'center' }}>
            <p>{error}</p>
            <button onClick={(e) => { e.preventDefault(); fetchToken(); }} style={{
              marginTop: '12px', background: '#fa5252', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer'
            }}>Thử lại</button>
          </div>
        ) : (
          <div style={{
            width: viewMode === 'mobile' ? '375px' : '100%',
            maxWidth: '1000px',
            height: viewMode === 'mobile' ? '812px' : '650px',
            border: '8px solid #343a40',
            borderRadius: viewMode === 'mobile' ? '36px' : '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            backgroundColor: '#fff'
          }}>
            {/* Mobile Notch (Simulated) */}
            {viewMode === 'mobile' && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120px',
                height: '24px',
                background: '#343a40',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px',
                zIndex: 10
              }}></div>
            )}
            
            <iframe 
              src={iframeUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#fff'
              }}
              title="Template Preview"
              allow="autoplay; fullscreen"
            />
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
