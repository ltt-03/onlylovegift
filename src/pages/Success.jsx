import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ExternalLink, Copy, Shield, Sparkles, Lock, Globe } from 'lucide-react';

export default function Success() {
  const [deployStatus, setDeployStatus] = useState('deploying');
  const [deployUrl, setDeployUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!orderCode) return;
    let isPolling = true;
    const checkStatus = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderCode}`);
        const data = await res.json();
        if (data.success && data.order.status === 'SUCCESS' && data.order.deployUrl) {
          setDeployStatus('success');
          setDeployUrl(data.order.deployUrl);
          isPolling = false;
        }
      } catch (err) {}
      if (isPolling) setTimeout(checkStatus, 2000);
    };
    checkStatus();
    return () => { isPolling = false; };
  }, [orderCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(deployUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(255,105,180,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(180,100,255,0.1) 0%, transparent 50%), var(--color-bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-120px', left: '-120px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,105,180,0.12), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-100px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147,51,234,0.1), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '540px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '28px',
        padding: '0',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.05)',
        position: 'relative',
        animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}>

        {/* Top gradient band */}
        <div style={{
          height: '5px',
          background: 'linear-gradient(90deg, #f43f5e, #ec4899, #a855f7)',
        }} />

        {/* Header section */}
        <div style={{ padding: '48px 40px 36px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 24px',
            background: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(16,185,129,0.05))',
            border: '2px solid rgba(52,211,153,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pulse-ring 2.5s ease-in-out infinite',
          }}>
            <CheckCircle size={40} color="#34d399" strokeWidth={2} />
          </div>
          <h1 style={{
            fontSize: '1.85rem', fontWeight: '800', marginBottom: '10px',
            background: 'linear-gradient(135deg, #f43f5e, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}>
            Thanh Toán Thành Công!
          </h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto' }}>
            Cảm ơn bạn đã tin tưởng <strong style={{ color: 'var(--color-primary)' }}>Only Love Gift</strong>. Chúng tôi đang chuẩn bị một món quà bất ngờ thật đặc biệt cho người bạn yêu thương 💝
          </p>
        </div>

        {/* Main content */}
        <div style={{ padding: '32px 40px' }}>

          {deployStatus === 'deploying' ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              {/* Heart pulse loader */}
              <div style={{ fontSize: '3.5rem', animation: 'heartbeat 1.2s ease-in-out infinite', display: 'block', margin: '0 auto 16px', lineHeight: 1 }}>💌</div>
              <p style={{ fontWeight: '700', color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: '8px' }}>
                Đang gói ghém yêu thương{dots}
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-light)', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto 24px' }}>
                Chúng tôi đang tạo một trang web cực kỳ đặc biệt cho bạn. Hãy chờ một chút nhé! 🌸
              </p>
              {/* Progress dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f43f5e, #a855f7)',
                    animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.5s ease forwards' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
                borderRadius: '100px', padding: '8px 18px', width: 'fit-content', margin: '0 auto 24px',
              }}>
                <Sparkles size={14} color="#34d399" />
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#34d399' }}>Website đã sẵn sàng!</span>
              </div>

              {/* Meaningful quote */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(244,63,94,0.06), rgba(168,85,247,0.06))',
                border: '1px solid rgba(244,63,94,0.15)',
                borderRadius: '14px', padding: '16px 20px', marginBottom: '20px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  "Một lời yêu thương gửi đúng lúc — có thể làm sáng cả một ngày dài của người nhận."
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', marginTop: '6px' }}>— Only Love Gift 💕</p>
              </div>

              {/* Link display box */}
              <div style={{
                background: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                padding: '18px 20px',
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Globe size={14} color="var(--color-text-light)" />
                  <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--color-text-light)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Link Trang Web Quà Tặng Của Bạn</span>
                </div>
                {/* URL row */}
                <div style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '12px',
                  overflow: 'hidden',
                }}>
                  <span style={{
                    fontSize: '0.85rem', color: 'var(--color-text)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    fontFamily: 'monospace', display: 'block',
                  }}>{deployUrl}</span>
                </div>
                {/* Big animated copy button */}
                <button
                  onClick={handleCopy}
                  style={{
                    width: '100%', padding: '14px 20px',
                    background: copied
                      ? 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.1))'
                      : 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.12))',
                    border: `2px solid ${copied ? 'rgba(52,211,153,0.5)' : 'rgba(99,102,241,0.3)'}`,
                    borderRadius: '12px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    color: copied ? '#34d399' : '#818cf8',
                    fontWeight: '700', fontSize: '0.95rem',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    animation: copied ? 'none' : 'copy-pulse 2s ease-in-out infinite',
                    transform: copied ? 'scale(0.97)' : 'scale(1)',
                  }}
                >
                  <Copy size={18} style={{ transition: 'transform 0.3s', transform: copied ? 'rotate(10deg) scale(1.2)' : 'rotate(0)' }} />
                  {copied ? '✅ Đã sao chép vào bộ nhớ!' : '📋 Nhấn để sao chép link'}
                </button>
              </div>

              {/* CTA button */}
              <a
                href={deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  width: '100%', padding: '15px 24px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f43f5e, #a855f7)',
                  color: '#fff', fontWeight: '700', fontSize: '1rem',
                  textDecoration: 'none', border: 'none', cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(244,63,94,0.35)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  marginBottom: '20px',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(244,63,94,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(244,63,94,0.35)'; }}
              >
                <Globe size={18} />
                Truy Cập Website Quà Tặng
                <ExternalLink size={16} />
              </a>
            </div>
          )}

        </div>


        {/* Footer */}
        <div style={{
          padding: '20px 40px 28px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={12} color="var(--color-text-light)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-light)' }}>Mã đơn: <strong style={{ color: 'var(--color-text)' }}>{orderCode}</strong></span>
          </div>
          <Link to="/" style={{
            fontSize: '0.83rem', color: 'var(--color-text-light)',
            textDecoration: 'none', borderBottom: '1px solid var(--color-border)',
          }}>
            ← Về trang chủ
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.25); }
          50%       { box-shadow: 0 0 0 10px rgba(52,211,153,0); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14%       { transform: scale(1.25); }
          28%       { transform: scale(1); }
          42%       { transform: scale(1.18); }
          56%       { transform: scale(1); }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-10px); opacity: 1; }
        }
        @keyframes copy-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.2); }
          50%       { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
        }
      `}</style>
    </div>
  );
}
