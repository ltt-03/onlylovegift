import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, ShoppingBag, CreditCard, MessageSquare, TrendingUp, Check, X, Trash2 } from 'lucide-react';

export default function Admin() {
  const { user, api } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data States
  const [stats, setStats] = useState({ usersCount: 0, ordersCount: 0, revenue: 0, system: null });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // Chặn người dùng không phải Admin
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  // Fetch functions
  const fetchStats = async () => {
    try { const res = await api.get('/admin/stats'); setStats(res.data.stats); } catch (e) {}
  };
  const fetchUsers = async () => {
    try { const res = await api.get('/admin/users'); setUsers(res.data.users); } catch (e) {}
  };
  const fetchOrders = async () => {
    try { const res = await api.get('/admin/orders'); setOrders(res.data.orders); } catch (e) {}
  };
  const fetchTransactions = async () => {
    try { const res = await api.get('/admin/transactions'); setTransactions(res.data.transactions); } catch (e) {}
  };
  const fetchFeedbacks = async () => {
    try { const res = await api.get('/admin/feedbacks'); setFeedbacks(res.data.feedbacks); } catch (e) {}
  };

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'transactions') fetchTransactions();
    else if (activeTab === 'feedbacks') fetchFeedbacks();
  }, [activeTab]);

  // Actions
  const handleUpdateBalance = async (userId, amount) => {
    const amt = prompt('Nhập số tiền muốn CỘNG (nhập số âm để TRỪ):', amount || 0);
    if (!amt || isNaN(amt)) return;
    try {
      await api.post(`/admin/users/${userId}/balance`, { amount: Number(amt) });
      fetchUsers();
      alert('Đã cập nhật số dư thành công!');
    } catch (e) {
      alert('Lỗi cập nhật số dư');
    }
  };

  const handleUpdateTxStatus = async (txId, status) => {
    if (!window.confirm(`Bạn muốn đổi trạng thái thành ${status}?`)) return;
    try {
      await api.post(`/admin/transactions/${txId}/status`, { status });
      fetchTransactions();
    } catch (e) {
      alert('Lỗi cập nhật giao dịch');
    }
  };

  const handleUpdateFeedbackStatus = async (fbId, status) => {
    try {
      await api.post(`/admin/feedbacks/${fbId}/status`, { status });
      fetchFeedbacks();
    } catch (e) {
      alert('Lỗi cập nhật đánh giá');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', display: 'flex', gap: '30px', minHeight: '80vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--color-primary)' }}>Trang Quản Trị</h2>
        
        <button className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('dashboard')} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', padding: '12px' }}>
          <TrendingUp size={20} /> Tổng quan
        </button>
        <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('users')} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', padding: '12px' }}>
          <Users size={20} /> Người dùng
        </button>
        <button className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('orders')} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', padding: '12px' }}>
          <ShoppingBag size={20} /> Đơn hàng
        </button>
        <button className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('transactions')} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', padding: '12px' }}>
          <CreditCard size={20} /> Nạp tiền
        </button>
        <button className={`btn ${activeTab === 'feedbacks' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('feedbacks')} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', padding: '12px' }}>
          <MessageSquare size={20} /> Đánh giá
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '30px' }}>
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h3>Thống kê tổng quan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--color-text-light)', marginBottom: '10px' }}>Tổng Doanh Thu</h4>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.revenue.toLocaleString()}đ</div>
              </div>
              <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--color-text-light)', marginBottom: '10px' }}>Tổng Người Dùng</h4>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.usersCount}</div>
              </div>
              <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--color-text-light)', marginBottom: '10px' }}>Đơn Đã Bán</h4>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.ordersCount}</div>
              </div>
            </div>
            
            {stats.system && (
              <>
                <h3 style={{ marginTop: '40px' }}>Thông tin Máy chủ (Server)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                  <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--color-text-light)', marginBottom: '10px' }}>Dung lượng Ảnh (Disk)</h4>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.system.storageMB} <span style={{fontSize: '14px', color: 'var(--color-text-light)'}}>MB</span></div>
                  </div>
                  <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--color-text-light)', marginBottom: '10px' }}>RAM Hệ thống</h4>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.system.ramUsedGB} <span style={{fontSize: '14px', color: 'var(--color-text-light)'}}>/ {stats.system.ramTotalGB} GB</span></div>
                  </div>
                  <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--color-text-light)', marginBottom: '10px' }}>Node.js RAM</h4>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.system.processRamMB} <span style={{fontSize: '14px', color: 'var(--color-text-light)'}}>MB</span></div>
                  </div>
                  <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--color-text-light)', marginBottom: '10px' }}>Hệ điều hành</h4>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'capitalize' }}>{stats.system.osPlatform}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h3>Quản lý người dùng</h3>
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Tên</th>
                  <th style={{ padding: '10px' }}>Email</th>
                  <th style={{ padding: '10px' }}>Số dư</th>
                  <th style={{ padding: '10px' }}>Quyền</th>
                  <th style={{ padding: '10px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px' }}>{u.name}</td>
                    <td style={{ padding: '10px' }}>{u.email}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#4ade80' }}>{u.balance.toLocaleString()}đ</td>
                    <td style={{ padding: '10px' }}>{u.role}</td>
                    <td style={{ padding: '10px' }}>
                      <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => handleUpdateBalance(u.id, 0)}>Cộng/Trừ Tiền</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h3>Danh sách đơn hàng</h3>
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Mã Đơn</th>
                  <th style={{ padding: '10px' }}>Khách Hàng</th>
                  <th style={{ padding: '10px' }}>Mẫu</th>
                  <th style={{ padding: '10px' }}>Giá</th>
                  <th style={{ padding: '10px' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px' }}>{o.orderCode}</td>
                    <td style={{ padding: '10px' }}>{o.user?.name || o.senderName}</td>
                    <td style={{ padding: '10px' }}>{o.templateId}</td>
                    <td style={{ padding: '10px' }}>{o.amount.toLocaleString()}đ</td>
                    <td style={{ padding: '10px', color: o.status === 'SUCCESS' ? '#4ade80' : 'orange' }}>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            <h3>Giao dịch nạp tiền</h3>
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Mã GD</th>
                  <th style={{ padding: '10px' }}>Khách Hàng</th>
                  <th style={{ padding: '10px' }}>Số tiền</th>
                  <th style={{ padding: '10px' }}>Trạng thái</th>
                  <th style={{ padding: '10px' }}>Duyệt tay</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px' }}>{t.txCode}</td>
                    <td style={{ padding: '10px' }}>{t.user?.name || t.userId}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{t.amount.toLocaleString()}đ</td>
                    <td style={{ padding: '10px', color: t.status === 'SUCCESS' ? '#4ade80' : t.status === 'FAILED' ? '#f87171' : 'orange' }}>{t.status}</td>
                    <td style={{ padding: '10px' }}>
                      {t.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button className="btn" style={{ padding: '5px', background: '#4ade80', color: '#000' }} onClick={() => handleUpdateTxStatus(t.id, 'SUCCESS')}><Check size={16} /></button>
                          <button className="btn" style={{ padding: '5px', background: '#f87171', color: '#fff' }} onClick={() => handleUpdateTxStatus(t.id, 'FAILED')}><X size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Feedbacks Tab */}
        {activeTab === 'feedbacks' && (
          <div>
            <h3>Kiểm duyệt đánh giá</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginTop: '20px' }}>
              {feedbacks.map(fb => (
                <div key={fb.id} className="card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{fb.name} - {fb.rating} Sao</h4>
                    <p style={{ margin: 0, color: 'var(--color-text-light)' }}>{fb.message}</p>
                    <span style={{ fontSize: '12px', color: fb.status === 'APPROVED' ? '#4ade80' : fb.status === 'REJECTED' ? '#f87171' : 'orange' }}>
                      Trạng thái: {fb.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {fb.status !== 'APPROVED' && (
                      <button className="btn" style={{ padding: '8px 12px', background: '#4ade80', color: '#000' }} onClick={() => handleUpdateFeedbackStatus(fb.id, 'APPROVED')}>Duyệt</button>
                    )}
                    {fb.status !== 'REJECTED' && (
                      <button className="btn" style={{ padding: '8px 12px', background: '#f87171', color: '#fff' }} onClick={() => handleUpdateFeedbackStatus(fb.id, 'REJECTED')}>Từ chối</button>
                    )}
                    <button className="btn" style={{ padding: '8px', background: 'transparent', border: '1px solid var(--color-border)' }} onClick={() => handleUpdateFeedbackStatus(fb.id, 'DELETED')}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
