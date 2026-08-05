import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, api } = useContext(AuthContext);
  
  const [isPaid, setIsPaid] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(false);
  const [payingWithWallet, setPayingWithWallet] = useState(false);
  
  const orderCode = searchParams.get('orderCode');

  // Fetch order details
  useEffect(() => {
    if (!orderCode) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderCode}`);
        const data = await res.json();
        if (data.success) {
          setOrderDetails(data.order);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };
    
    fetchOrder();
  }, [orderCode]);

  // Poll for payment status
  useEffect(() => {
    if (!orderCode || isPaid || error) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderCode}`);
        const data = await res.json();
        if (data.success && (data.order.status === 'PAID' || data.order.status === 'SUCCESS')) {
          setIsPaid(true);
        }
      } catch (err) {
        // ignore fetch errors on polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderCode, isPaid, error]);

  useEffect(() => {
    if (isPaid) {
      setTimeout(() => {
        navigate('/success?orderCode=' + orderCode);
      }, 1500);
    }
  }, [isPaid, navigate, orderCode]);

  const handleManualConfirm = async () => {
    if (!orderCode) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderCode}/mock-pay`, {
        method: 'POST'
      });
      setIsPaid(true);
    } catch (err) {
      alert('Mock payment failed');
    }
  };

  const handleWalletPay = async () => {
    if (!user || !orderCode || payingWithWallet) return;
    setPayingWithWallet(true);
    try {
      const res = await api.post(`/orders/${orderCode}/pay-with-wallet`);
      if (res.data.success) {
        setIsPaid(true);
      } else {
        alert(res.data.message || 'Thanh toán thất bại');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi thanh toán ví');
    } finally {
      setPayingWithWallet(false);
    }
  };

  if (error) {
    return <div className="container" style={{ padding: '60px' }}><h1>Lỗi tải đơn hàng</h1><p>Không tìm thấy đơn hàng hoặc backend chưa chạy.</p></div>;
  }

  if (!orderDetails) {
    return <div className="container" style={{ padding: '60px' }}><p>Đang tải thông tin đơn hàng...</p></div>;
  }

  const qrUrl = `https://img.vietqr.io/image/970448-SEPSEPLOVEGIFT-compact2.png?amount=${orderDetails.amount}&addInfo=${orderDetails.orderCode}&accountName=LE%20THANH%20TUNG`;

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '900px' }}>
      <h1 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Thanh Toán Đơn Hàng</h1>
      
      <div className="grid-2col-layout">
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Thông tin đơn hàng</h2>
          <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--color-border)' }}>
            <p className="text-light" style={{ marginBottom: '5px' }}>Mã đơn hàng</p>
            <p style={{ fontWeight: '600', fontSize: '1.2rem' }}>{orderDetails.orderCode}</p>
          </div>
          <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--color-border)' }}>
            <p className="text-light" style={{ marginBottom: '5px' }}>Sản phẩm</p>
            <p style={{ fontWeight: '500' }}>Mẫu {orderDetails.templateId} + Auto Deploy</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '500' }}>Tổng thanh toán</span>
            <span className="text-primary" style={{ fontSize: '1.8rem', fontWeight: '700' }}>{orderDetails.amount.toLocaleString()}đ</span>
          </div>
        </div>

        <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* WALLET PAYMENT SECTION */}
          {user && (
            <div style={{ width: '100%', marginBottom: '25px', padding: '20px', background: 'var(--bg-glass)', borderRadius: '15px', border: '1px solid rgba(255,107,158,0.2)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-primary)' }}>
                <Wallet size={20} /> Thanh toán bằng số dư Ví
              </h3>
              <p style={{ marginBottom: '15px' }}>Số dư khả dụng: <strong>{user.balance?.toLocaleString('vi-VN')} đ</strong></p>
              
              {user.balance >= orderDetails.amount ? (
                <button 
                  onClick={handleWalletPay}
                  disabled={payingWithWallet || isPaid}
                  className="btn-cute-candy" 
                  style={{ width: '100%', fontSize: '1rem', padding: '12px' }}
                >
                  {payingWithWallet ? 'Đang xử lý...' : 'Thanh Toán Siêu Tốc Ngay'}
                </button>
              ) : (
                <div>
                  <p style={{ color: '#ff4d4f', fontSize: '0.9rem', marginBottom: '15px' }}>Số dư không đủ để thanh toán đơn hàng này.</p>
                  <button 
                    onClick={() => navigate('/wallet')} 
                    className="btn btn-outline" 
                    style={{ width: '100%' }}
                  >
                    Nạp Tiền Vào Ví
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* QR CODE PAYMENT SECTION */}
          <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', borderTop: user ? '1px dashed #ddd' : 'none', paddingTop: user ? '20px' : '0', width: '100%' }}>Hoặc chuyển khoản trực tiếp</h2>
          <p className="text-light" style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
            Hệ thống tự động xác nhận qua <strong>Casso / Sepay</strong>. 
            Vui lòng không thay đổi nội dung chuyển khoản.
          </p>
          
          <div style={{ background: '#fff', padding: '15px', borderRadius: '16px', border: '1px solid #eee', marginBottom: '20px' }}>
            <img src={qrUrl} alt="Mã QR Thanh Toán OCB" style={{ width: '250px', height: '250px' }} />
          </div>

          {isPaid ? (
            <div style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              ✓ Đã xác nhận thanh toán thành công!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
                <div className="spinner" style={{ width: '20px', height: '20px', border: '3px solid', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                Đang chờ xác nhận thanh toán...
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', margin: 0, textAlign: 'center' }}>
                Hệ thống sẽ tự động xác nhận trong vòng <strong>1–3 phút</strong> sau khi chuyển khoản thành công.
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
