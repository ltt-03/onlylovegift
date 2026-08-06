import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WalletPage = () => {
  const { user, api, openAuthModal } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositCode, setDepositCode] = useState(null);
  const [depositMethod, setDepositMethod] = useState('auto'); // 'auto' | 'manual'

  useEffect(() => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    fetchWalletData();
  }, [user]);

  const fetchWalletData = async () => {
    try {
      const res = await api.get('/wallet');
      if (res.data.success) {
        setBalance(res.data.balance);
        setDepositCode(res.data.depositCode);
        setTransactions(res.data.transactions);
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu ví:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-screen">Đang tải dữ liệu ví...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Wallet size={36} /> Ví Điện Tử
        </h1>
        <p className="text-light">Quản lý số dư và lịch sử giao dịch của bạn</p>
      </div>

      <div className="glass-card" style={{ padding: '30px', textAlign: 'center', marginBottom: '30px', background: 'linear-gradient(135deg, rgba(255, 107, 158, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%)' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-color)', marginBottom: '10px' }}>Số dư khả dụng</p>
        <h2 style={{ fontSize: '3rem', color: 'var(--color-primary)', margin: '0', fontWeight: '800' }}>
          {balance.toLocaleString('vi-VN')} đ
        </h2>
      </div>

      {depositCode && (
        <div className="glass-card deposit-section" style={{ padding: '0', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--color-border)', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
            <button 
              onClick={() => setDepositMethod('auto')}
              style={{ flex: 1, padding: '16px', border: 'none', background: depositMethod === 'auto' ? 'var(--color-primary)' : 'transparent', color: depositMethod === 'auto' ? 'white' : 'var(--color-text)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              ⚡ Nạp Tự Động (1-3 phút)
            </button>
            <button 
              onClick={() => setDepositMethod('manual')}
              style={{ flex: 1, padding: '16px', border: 'none', background: depositMethod === 'manual' ? 'var(--color-primary)' : 'transparent', color: depositMethod === 'manual' ? 'white' : 'var(--color-text)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              🛠 Nạp Thủ Công (Dự phòng)
            </button>
          </div>

          <div style={{ padding: '30px', textAlign: 'center' }}>
            {depositMethod === 'auto' ? (
              <div className="animate-fade-in">
                <h3 style={{ color: 'var(--color-primary)', marginBottom: '10px', fontSize: '1.5rem' }}>Quét mã để nạp tiền tự động</h3>
                <p style={{ marginBottom: '25px', color: 'var(--color-text-light)', fontSize: '1.1rem' }}>Hệ thống sẽ tự động nhận diện và cộng tiền vào ví của bạn.</p>
                
                <div style={{ background: 'white', padding: '15px', borderRadius: '20px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <img 
                    src={`https://img.vietqr.io/image/970448-SEPSEPLOVEGIFT-compact2.jpg?amount=0&addInfo=${depositCode}&accountName=LE%20THANH%20TUNG`} 
                    alt="Mã VietQR Tự Động" 
                    style={{ width: '280px', borderRadius: '10px' }}
                  />
                </div>
                
                <div style={{ marginTop: '30px', background: 'var(--color-surface-hover)', padding: '20px', borderRadius: '15px', display: 'inline-block', textAlign: 'left', minWidth: '300px', border: '1px solid var(--color-border)' }}>
                  <p style={{ margin: '5px 0' }}><strong>Ngân hàng:</strong> OCB (Phương Đông)</p>
                  <p style={{ margin: '5px 0' }}><strong>Số tài khoản:</strong> <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>SEPSEPLOVEGIFT</span></p>
                  <p style={{ margin: '5px 0' }}><strong>Chủ tài khoản:</strong> LE THANH TUNG</p>
                  <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255, 42, 115, 0.1)', borderRadius: '8px', border: '1px dashed var(--color-primary)' }}>
                    <p style={{ margin: 0, fontSize: '1.2rem', textAlign: 'center' }}>
                      <strong>Nội dung CK:</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 'bold', letterSpacing: '1px' }}>{depositCode}</span>
                    </p>
                  </div>
                </div>
                
                <p style={{ marginTop: '25px', color: '#ff4d4f', fontWeight: 'bold', fontSize: '0.95rem', padding: '0 20px' }}>
                  * BẮT BUỘC: Ghi chính xác nội dung chuyển khoản là {depositCode} để hệ thống tự động xử lý. (Số tiền nạp tuỳ ý)
                </p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <h3 style={{ color: '#faad14', marginBottom: '10px', fontSize: '1.5rem' }}>Nạp Tiền Thủ Công</h3>
                <p style={{ marginBottom: '25px', color: 'var(--color-text-light)', fontSize: '1.1rem' }}>Dùng khi nạp tự động bị lỗi. Admin sẽ duyệt tay cho bạn.</p>
                
                <div style={{ background: 'white', padding: '15px', borderRadius: '20px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '2px solid #faad14' }}>
                  <img 
                    src={`https://img.vietqr.io/image/970407-9520102006-compact2.jpg?amount=0&addInfo=${depositCode}&accountName=LE%20THANH%20TUNG`} 
                    alt="Mã VietQR Thủ Công" 
                    style={{ width: '280px', borderRadius: '10px' }}
                  />
                </div>
                
                <div style={{ marginTop: '30px', background: 'var(--color-surface-hover)', padding: '20px', borderRadius: '15px', display: 'inline-block', textAlign: 'left', minWidth: '300px', border: '1px solid #faad14' }}>
                  <p style={{ margin: '5px 0' }}><strong>Ngân hàng:</strong> Techcombank</p>
                  <p style={{ margin: '5px 0' }}><strong>Số tài khoản:</strong> <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>9520 1020 06</span></p>
                  <p style={{ margin: '5px 0' }}><strong>Chủ tài khoản:</strong> LE THANH TUNG</p>
                  <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(250, 173, 20, 0.1)', borderRadius: '8px', border: '1px dashed #faad14' }}>
                    <p style={{ margin: 0, fontSize: '1.2rem', textAlign: 'center' }}>
                      <strong>Nội dung CK:</strong> <span style={{ color: '#d48806', fontWeight: 'bold', letterSpacing: '1px' }}>{depositCode}</span>
                    </p>
                  </div>
                </div>
                
                <div style={{ marginTop: '25px', padding: '15px', background: '#fffbe6', borderRadius: '10px', border: '1px solid #ffe58f', color: '#d48806', textAlign: 'left' }}>
                  <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} /> Quá trình này sẽ mất nhiều thời gian hơn
                  </p>
                  <ul style={{ margin: '0 0 0 20px', padding: 0 }}>
                    <li style={{ marginBottom: '5px' }}>Vui lòng chờ Admin kiểm tra và duyệt tay (khoảng 30 phút - 1 tiếng).</li>
                    <li>Liên hệ Zalo hỗ trợ sớm nhất (khi Admin rảnh): <strong>0848290617</strong></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <h3 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '10px' }}>Lịch sử giao dịch</h3>
      
      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)', background: 'var(--bg-glass)', borderRadius: '15px' }}>
          Chưa có giao dịch nào
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '15px 20px',
                  border: '1px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {tx.type === 'DEPOSIT' ? (
                    <ArrowDownCircle size={36} color="#52c41a" />
                  ) : (
                    <ArrowUpCircle size={36} color="#ff4d4f" />
                  )}
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{tx.description || (tx.type === 'DEPOSIT' ? 'Nạp tiền' : 'Thanh toán')}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={12} /> {new Date(tx.createdAt).toLocaleString('vi-VN')}
                    <span style={{ margin: '0 5px' }}>•</span>
                    Mã: {tx.txCode}
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: tx.type === 'DEPOSIT' ? '#52c41a' : '#ff4d4f' }}>
                  {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} đ
                </div>
                <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px', marginTop: '5px', color: tx.status === 'SUCCESS' ? '#52c41a' : (tx.status === 'PENDING' ? '#faad14' : '#ff4d4f') }}>
                  {tx.status === 'SUCCESS' && <CheckCircle size={14} />}
                  {tx.status === 'PENDING' && <Clock size={14} />}
                  {tx.status === 'FAILED' && <XCircle size={14} />}
                  {tx.status === 'SUCCESS' ? 'Thành công' : (tx.status === 'PENDING' ? 'Đang chờ' : 'Thất bại')}
                </div>
              </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default WalletPage;
