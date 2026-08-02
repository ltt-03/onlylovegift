import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WalletPage = () => {
  const { user, api } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositCode, setDepositCode] = useState(null);
  const [isDepositing, setIsDepositing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWalletData();
  }, [user]);

  const fetchWalletData = async () => {
    try {
      const res = await api.get('/wallet');
      if (res.data.success) {
        setBalance(res.data.balance);
        setTransactions(res.data.transactions);
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu ví:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepositRequest = async () => {
    setIsDepositing(true);
    try {
      const res = await api.post('/wallet/deposit', {});
      if (res.data.success) {
        setDepositCode(res.data.transaction.txCode);
        setShowDeposit(true);
      }
    } catch (error) {
      alert('Không thể tạo mã nạp tiền lúc này');
    } finally {
      setIsDepositing(false);
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
        <h2 style={{ fontSize: '3rem', color: 'var(--color-primary)', margin: '0 0 20px 0', fontWeight: '800' }}>
          {balance.toLocaleString('vi-VN')} đ
        </h2>
        <button 
          className="btn-cute-candy" 
          onClick={handleDepositRequest}
          disabled={isDepositing}
          style={{ fontSize: '1.2rem', padding: '15px 40px' }}
        >
          {isDepositing ? 'Đang tạo...' : 'Nạp Tiền Ngay'}
        </button>
      </div>

      {showDeposit && depositCode && (
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center', marginBottom: '30px', border: '2px dashed var(--color-primary)' }}>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '15px' }}>Quét mã để nạp tiền tự động</h3>
          <p style={{ marginBottom: '20px' }}>Hệ thống sẽ tự động cộng tiền vào ví của bạn sau 1-3 phút.</p>
          
          <img 
            src={`https://img.vietqr.io/image/970422-0393278564-compact2.jpg?amount=0&addInfo=${depositCode}&accountName=LE%20THANH%20TUNG`} 
            alt="Mã VietQR" 
            style={{ width: '250px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
          />
          
          <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.8)', padding: '15px', borderRadius: '10px', display: 'inline-block', textAlign: 'left' }}>
            <p><strong>Ngân hàng:</strong> MB Bank (NH Quân Đội)</p>
            <p><strong>Số tài khoản:</strong> 0393278564</p>
            <p><strong>Chủ tài khoản:</strong> LE THANH TUNG</p>
            <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>
              <strong>Nội dung CK:</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{depositCode}</span>
            </p>
          </div>
          
          <p style={{ marginTop: '20px', color: '#ff4d4f', fontWeight: 'bold', fontSize: '0.9rem' }}>
            * Bắt buộc ghi đúng nội dung chuyển khoản là {depositCode} để được cộng tiền tự động. Số tiền nạp tuỳ ý.
          </p>
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
            <div key={tx.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
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
