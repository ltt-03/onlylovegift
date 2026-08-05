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

  // Dùng state khởi tạo dựa trên needsWarning
  const [isStarted, setIsStarted] = useState(!needsWarning);

  // Khi templateId thay đổi (user mở preview template khác),
  // reset isStarted đúng theo needsWarning mới để tránh hiện warning sai
  useEffect(() => {
    setIsStarted(!needsWarning);
    setToken(null);
    setError(null);
  }, [templateId]);

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

  // Chỉ hiện màn hình cảnh báo khi template thực sự cần (x-mas-tree)
  // Nếu không phải needsWarning mà isStarted=false (vd: user bấm X), tự động reset lại
  if (!isStarted && needsWarning) {
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
    <div className="secure-preview-container">
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
          
          {!autoLoad && needsWarning && (
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
      <div className="preview-content-area">
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
          <div className={`preview-frame ${viewMode === 'mobile' ? 'mobile-mode' : 'desktop-mode'}`}>
            {/* Mobile Notch (Simulated) */}
            {viewMode === 'mobile' && (
              <div className="mobile-notch"></div>
            )}
            
            <iframe 
              src={iframeUrl}
              className="preview-iframe"
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

        .secure-preview-container {
          width: 100%;
          background: var(--color-bg-alt, #1a1b1e);
          border: 1px solid var(--color-border, #2c2e33);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          margin-top: 24px;
        }
        
        .preview-content-area {
          background: #1a1b1e;
          padding: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          position: relative;
        }
        
        .preview-frame {
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          background-color: #fff;
        }
        
        .preview-frame.mobile-mode {
          width: 100%;
          max-width: 375px;
          height: 812px;
          max-height: 75vh;
          border: 8px solid #343a40;
          border-radius: 36px;
        }
        
        .preview-frame.desktop-mode {
          width: 100%;
          max-width: 1000px;
          height: 650px;
          max-height: 75vh;
          border: 8px solid #343a40;
          border-radius: 12px;
        }
        
        .mobile-notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 24px;
          background: #343a40;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          z-index: 10;
        }
        
        .preview-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: #fff;
          display: block;
        }
        
        @media (max-width: 768px) {
          .secure-preview-container {
            border-radius: 0;
            margin-top: 0;
            border: none;
            flex: 1;
            height: 100%;
          }
          
          .preview-content-area {
            padding: 0;
            min-height: auto;
            flex: 1;
          }
          
          .preview-frame.mobile-mode, .preview-frame.desktop-mode {
            width: 100%;
            max-width: 100%;
            height: 100%;
            max-height: none;
            border: none;
            border-radius: 0;
            box-shadow: none;
          }
          
          .mobile-notch {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
