import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Gift, CreditCard, ExternalLink, Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

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
        return <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '12px', fontWeight: 'bold' }}><CheckCircle size={12} style={{ marginRight: '4px' }} />Hoàn thành</span>;
      case 'PENDING':
        return <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#fff8e1', color: '#f57f17', fontSize: '12px', fontWeight: 'bold' }}><Clock size={12} style={{ marginRight: '4px' }} />Chờ xử lý</span>;
      default:
        return <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#ffebee', color: '#c62828', fontSize: '12px', fontWeight: 'bold' }}><XCircle size={12} style={{ marginRight: '4px' }} />Thất bại</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Quản lý tài khoản</h1>
          <p className="text-light">Xin chào, <strong>{user.name}</strong>! Số dư ví: <strong style={{ color: 'var(--color-primary)' }}>{user.balance?.toLocaleString()}đ</strong></p>
        </div>
        <Link to="/wallet" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CreditCard size={18} /> Nạp Tiền
        </Link>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'orders' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--color-text-light)', fontWeight: activeTab === 'orders' ? 'bold' : 'normal', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Gift size={18} /> Món Quà Đã Tạo
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'transactions' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'transactions' ? 'var(--color-primary)' : 'var(--color-text-light)', fontWeight: activeTab === 'transactions' ? 'bold' : 'normal', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <CreditCard size={18} /> Lịch Sử Giao Dịch
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải dữ liệu...</div>
          ) : (
            <>
              {activeTab === 'orders' && (
                <div>
                  {data.orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-light)' }}>
                      Bạn chưa tạo món quà nào. <br/><br/>
                      <Link to="/templates" className="btn btn-primary">Tạo Quà Ngay</Link>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                            <th style={{ padding: '12px 8px', color: 'var(--color-text-light)' }}>Mã ĐH</th>
                            <th style={{ padding: '12px 8px', color: 'var(--color-text-light)' }}>Gửi Tới</th>
                            <th style={{ padding: '12px 8px', color: 'var(--color-text-light)' }}>Số Tiền</th>
                            <th style={{ padding: '12px 8px', color: 'var(--color-text-light)' }}>Trạng Thái</th>
                            <th style={{ padding: '12px 8px', color: 'var(--color-text-light)' }}>Link Quà Tặng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.orders.map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>{order.orderCode}</td>
                              <td style={{ padding: '16px 8px' }}>{order.receiverName}</td>
                              <td style={{ padding: '16px 8px' }}>{order.amount.toLocaleString()}đ</td>
                              <td style={{ padding: '16px 8px' }}>{getStatusBadge(order.status)}</td>
                              <td style={{ padding: '16px 8px' }}>
                                {order.status === 'SUCCESS' && order.deployUrl ? (
                                  <a href={order.deployUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                                    Xem Quà <ExternalLink size={14} />
                                  </a>
                                ) : (
                                  <Link to={`/checkout?orderCode=${order.orderCode}`} style={{ color: '#f57f17', textDecoration: 'none' }}>
                                    Thanh toán ngay
                                  </Link>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'transactions' && (
                <div>
                  {data.transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-light)' }}>
                      Chưa có giao dịch nào.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                            <th style={{ padding: '12px 8px', color: 'var(--color-text-light)' }}>Mã GD</th>
                            <th style={{ padding: '12px 8px', color: 'var(--color-text-light)' }}>Loại</th>
                            <th style={{ padding: '12px 8px', color: 'var(--color-text-light)' }}>Số Tiền</th>
                            <th style={{ padding: '12px 8px', color: 'var(--color-text-light)' }}>Thời Gian</th>
                            <th style={{ padding: '12px 8px', color: 'var(--color-text-light)' }}>Trạng Thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.transactions.map(tx => (
                            <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                              <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>{tx.txCode}</td>
                              <td style={{ padding: '16px 8px' }}>
                                {tx.type === 'DEPOSIT' ? (
                                  <span style={{ color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowDownLeft size={14}/> Nạp Tiền</span>
                                ) : (
                                  <span style={{ color: '#c62828', display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight size={14}/> Thanh Toán</span>
                                )}
                              </td>
                              <td style={{ padding: '16px 8px', fontWeight: 'bold', color: tx.type === 'DEPOSIT' ? '#2e7d32' : '#c62828' }}>
                                {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount.toLocaleString()}đ
                              </td>
                              <td style={{ padding: '16px 8px', color: 'var(--color-text-light)' }}>{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                              <td style={{ padding: '16px 8px' }}>{getStatusBadge(tx.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
