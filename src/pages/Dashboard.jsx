import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Gift, CreditCard, ExternalLink, Clock, CheckCircle, XCircle,
  ArrowUpRight, ArrowDownLeft, AlertTriangle, X, Send, Copy, Check
} from 'lucide-react';

// ── Floating Report Bubble ──────────────────────────────
function ReportBubble({ api, user }) {
  const [open, setOpen] = useState(false);
  const [giftUrl, setGiftUrl] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const openBubble = (url = '', code = '') => {
    setGiftUrl(url || window.location.href);
    setOrderCode(code);
    setMessage('');
    setSent(false);
    setOpen(true);
  };

  // expose to window for use by order cards
  useEffect(() => {
    window.__openReportBubble = openBubble;
    return () => { delete window.__openReportBubble; };
  }, []);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      const res = await fetch(`${backendUrl}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          giftUrl,
          orderCode,
          message,
          userName: user?.name || 'Ẩn danh'
        })
      });
      if (res.ok) { setSent(true); setMessage(''); }
    } catch (e) {
      alert('Gửi báo cáo thất bại, vui lòng thử lại!');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => openBubble()}
        title="Báo cáo lỗi quà tặng"
        style={{
          position: 'fixed', bottom: '88px', right: '16px', zIndex: 999,
          width: '50px', height: '50px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
          color: 'white', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(238,90,36,0.45)',
          fontSize: '20px', transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <AlertTriangle size={22} />
      </button>

      {/* Modal */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'flex-end', justifyContent: 'center',
          padding: '0 0 80px 0'
        }} onClick={() => setOpen(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '430px',
              background: 'white', borderRadius: '24px 24px 0 0',
              padding: '24px 20px', boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
              animation: 'slideUpModal 0.3s ease'
            }}
          >
            <style>{`@keyframes slideUpModal { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '22px' }}>🚨</span>
                <h3 style={{ margin: 0, color: '#ee5a24', fontSize: '1.1rem', fontWeight: 800 }}>Báo Cáo Lỗi Quà Tặng</h3>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}>
                <X size={22} />
              </button>
            </div>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                <h4 style={{ color: '#22c55e', margin: '0 0 8px' }}>Đã gửi thành công!</h4>
                <p style={{ color: '#666', fontSize: '14px', margin: '0 0 20px' }}>Admin sẽ xem xét và xử lý sớm nhất có thể.</p>
                <button onClick={() => setOpen(false)} style={{
                  background: 'linear-gradient(135deg, #ee5a24, #ff6b6b)',
                  color: 'white', border: 'none', borderRadius: '50px',
                  padding: '12px 28px', fontWeight: 700, cursor: 'pointer'
                }}>Đóng</button>
              </div>
            ) : (
              <>
                {/* URL field */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#666', display: 'block', marginBottom: '6px' }}>
                    🔗 Link quà tặng bị lỗi
                  </label>
                  <input
                    value={giftUrl}
                    onChange={e => setGiftUrl(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '12px',
                      border: '1.5px solid #e0e0e0', fontSize: '13px',
                      fontFamily: 'monospace', color: '#333', boxSizing: 'border-box',
                      background: '#f9f9f9'
                    }}
                  />
                </div>

                {/* Message field */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#666', display: 'block', marginBottom: '6px' }}>
                    📝 Mô tả lỗi của bạn <span style={{ color: '#ee5a24' }}>*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Ví dụ: Quà không hiển thị nhạc, ảnh bị lỗi, trang trắng..."
                    rows={4}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '1.5px solid #e0e0e0', fontSize: '14px',
                      resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                      color: '#333', lineHeight: 1.5
                    }}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || sending}
                  style={{
                    width: '100%', padding: '14px',
                    background: message.trim() ? 'linear-gradient(135deg, #ee5a24, #ff6b6b)' : '#ccc',
                    color: 'white', border: 'none', borderRadius: '50px',
                    fontWeight: 800, fontSize: '15px', cursor: message.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  {sending ? 'Đang gửi...' : <><Send size={16} /> Gửi Báo Cáo</>}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── Order Card (mobile-friendly) ───────────────────────
function OrderCard({ order, getStatusBadge }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (order.deployUrl) {
      navigator.clipboard.writeText(order.deployUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReport = () => {
    if (window.__openReportBubble) {
      window.__openReportBubble(order.deployUrl || window.location.href, order.orderCode);
    }
  };

  return (
    <div style={{
      background: 'var(--color-surface)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid var(--color-border)',
      padding: '16px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      transition: 'transform 0.2s',
    }}>
      {/* Top row: Order code + Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-light)', fontWeight: 600, marginBottom: '2px' }}>MÃ ĐƠN HÀNG</div>
          <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-primary-dark)' }}>{order.orderCode}</div>
        </div>
        {getStatusBadge(order.status)}
      </div>

      {/* Info row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        <div style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '12px', padding: '10px 12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-light)', marginBottom: '2px' }}>🎁 Gửi tới</div>
          <div style={{ fontWeight: 700, fontSize: '14px' }}>{order.receiverName}</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '12px', padding: '10px 12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-light)', marginBottom: '2px' }}>💰 Số tiền</div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-primary)' }}>{order.amount.toLocaleString()}đ</div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {order.status === 'SUCCESS' && order.deployUrl ? (
          <>
            <a
              href={order.deployUrl} target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, minWidth: '100px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                color: 'white', borderRadius: '50px', padding: '10px 16px',
                fontWeight: 700, fontSize: '13px', textDecoration: 'none'
              }}
            >
              <ExternalLink size={14} /> Xem Quà
            </a>
            <button
              onClick={handleCopyLink}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: copied ? '#22c55e' : 'rgba(0,0,0,0.08)',
                color: copied ? 'white' : 'var(--color-text)',
                border: 'none', borderRadius: '50px', padding: '10px 14px',
                fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {copied ? <><Check size={13} /> Đã copy!</> : <><Copy size={13} /> Copy Link</>}
            </button>
            <button
              onClick={handleReport}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: 'rgba(238,90,36,0.1)', color: '#ee5a24',
                border: '1.5px solid rgba(238,90,36,0.3)',
                borderRadius: '50px', padding: '10px 14px',
                fontWeight: 700, fontSize: '12px', cursor: 'pointer'
              }}
            >
              <AlertTriangle size={13} /> Báo lỗi
            </button>
          </>
        ) : (
          <Link
            to={`/checkout?orderCode=${order.orderCode}`}
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              background: 'linear-gradient(135deg, #f57f17, #ff8f00)',
              color: 'white', borderRadius: '50px', padding: '10px 16px',
              fontWeight: 700, fontSize: '13px', textDecoration: 'none'
            }}
          >
            💳 Thanh toán ngay
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────
export default function Dashboard() {
  const { user, loading: authLoading, api } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [data, setData] = useState({ orders: [], transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/user/dashboard');
        if (response.data.success) {
          setData({
            orders: response.data.orders || [],
            transactions: response.data.transactions || []
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, api]);

  if (authLoading) return <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>Đang tải...</div>;
  if (!user) return <Navigate to="/login" />;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '5px 12px', borderRadius: '50px',
            background: 'rgba(34,197,94,0.12)', color: '#16a34a',
            fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap'
          }}>
            <CheckCircle size={13} /> Hoàn thành
          </span>
        );
      case 'PENDING':
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '5px 12px', borderRadius: '50px',
            background: 'rgba(245,158,11,0.12)', color: '#d97706',
            fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap'
          }}>
            <Clock size={13} /> Chờ xử lý
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '5px 12px', borderRadius: '50px',
            background: 'rgba(239,68,68,0.12)', color: '#dc2626',
            fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap'
          }}>
            <XCircle size={13} /> Thất bại
          </span>
        );
    }
  };

  return (
    <div style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
        borderRadius: '24px', padding: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '20px', color: 'white',
        boxShadow: '0 8px 24px rgba(214,138,150,0.35)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.3rem', margin: '0 0 4px', color: 'white', fontWeight: 800 }}>
            👋 Xin chào, {user.name}!
          </h1>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            Số dư ví: <strong style={{ fontSize: '16px' }}>{user.balance?.toLocaleString()}đ</strong>
          </p>
        </div>
        <Link
          to="/wallet"
          style={{
            background: 'white', color: 'var(--color-primary)',
            borderRadius: '50px', padding: '10px 16px',
            fontWeight: 800, fontSize: '13px', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <CreditCard size={16} /> Nạp Tiền
        </Link>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', background: 'var(--color-surface)',
        borderRadius: '16px', padding: '4px',
        border: '1px solid var(--color-border)', marginBottom: '16px'
      }}>
        {[
          { key: 'orders', label: '🎁 Món Quà Đã Tạo' },
          { key: 'transactions', label: '💳 Giao Dịch' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer',
              borderRadius: '12px', fontWeight: 700, fontSize: '13px',
              transition: 'all 0.2s',
              background: activeTab === tab.key
                ? 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))'
                : 'transparent',
              color: activeTab === tab.key ? 'white' : 'var(--color-text-light)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-light)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-light)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎁</div>
                  <p style={{ marginBottom: '20px', fontWeight: 600 }}>Bạn chưa tạo món quà nào.</p>
                  <Link to="/templates" className="btn btn-primary">Tạo Quà Ngay ✨</Link>
                </div>
              ) : (
                data.orders.map(order => (
                  <OrderCard key={order.id} order={order} getStatusBadge={getStatusBadge} />
                ))
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.transactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-light)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>💳</div>
                  Chưa có giao dịch nào.
                </div>
              ) : (
                data.transactions.map(tx => (
                  <div key={tx.id} style={{
                    background: 'var(--color-surface)', borderRadius: '16px',
                    border: '1px solid var(--color-border)', padding: '14px 16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: tx.type === 'DEPOSIT' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {tx.type === 'DEPOSIT'
                          ? <ArrowDownLeft size={18} style={{ color: '#16a34a' }} />
                          : <ArrowUpRight size={18} style={{ color: '#dc2626' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>
                          {tx.type === 'DEPOSIT' ? 'Nạp Tiền' : 'Thanh Toán'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                          {tx.txCode} · {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontWeight: 800, fontSize: '15px',
                        color: tx.type === 'DEPOSIT' ? '#16a34a' : '#dc2626'
                      }}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount.toLocaleString()}đ
                      </div>
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Floating Report Bubble */}
      <ReportBubble api={api} user={user} />
    </div>
  );
}
