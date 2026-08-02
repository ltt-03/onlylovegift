import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isPaid, setIsPaid] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(false);
  
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

  if (error) {
    return <div className="container" style={{ padding: '60px' }}><h1>Lỗi tải đơn hàng</h1><p>Không tìm thấy đơn hàng hoặc backend chưa chạy.</p></div>;
  }

  if (!orderDetails) {
    return <div className="container" style={{ padding: '60px' }}><p>Đang tải thông tin đơn hàng...</p></div>;
  }

  const qrUrl = `https://img.vietqr.io/image/970422-0329509223-compact2.png?amount=${orderDetails.amount}&addInfo=${orderDetails.orderCode}&accountName=LE THANH TUNG`;

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '900px' }}>
      <h1 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Thanh Toán Đơn Hàng</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
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
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Quét mã QR để thanh toán</h2>
          <p className="text-light" style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
            Hệ thống tự động xác nhận qua <strong>Casso / Sepay</strong>. 
            Vui lòng không thay đổi nội dung chuyển khoản.
          </p>
          
          <div style={{ background: '#fff', padding: '15px', borderRadius: '16px', border: '1px solid #eee', marginBottom: '20px' }}>
            <img src={qrUrl} alt="Mã QR Thanh Toán MBBank" style={{ width: '250px', height: '250px' }} />
          </div>

          {isPaid ? (
            <div style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              ✓ Đã xác nhận thanh toán thành công!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
                <div className="spinner" style={{ width: '20px', height: '20px', border: '3px solid', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                Đang chờ thanh toán...
              </div>
              <button onClick={handleManualConfirm} className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                (Dev Mode: Bấm để xác nhận)
              </button>
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
