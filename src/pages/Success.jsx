import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, ExternalLink, Rocket } from 'lucide-react';

export default function Success() {
  const [deployStatus, setDeployStatus] = useState('deploying');
  const [deployUrl, setDeployUrl] = useState('');
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get('orderCode');

  useEffect(() => {
    if (!orderCode) return;

    let isPolling = true;
    
    // Poll the backend until deployUrl is available
    const checkStatus = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderCode}`);
        const data = await res.json();
        
        if (data.success && data.order.status === 'SUCCESS' && data.order.deployUrl) {
          setDeployStatus('success');
          setDeployUrl(data.order.deployUrl);
          isPolling = false;
        }
      } catch (err) {
        // ignore
      }
      
      if (isPolling) {
        setTimeout(checkStatus, 2000);
      }
    };
    
    checkStatus();
    
    return () => { isPolling = false; };
  }, [orderCode]);

  return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '50px 30px' }}>
        <CheckCircle size={64} color="#2ecc71" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ fontSize: '2rem', marginBottom: '15px' }}>Thanh Toán Thành Công!</h1>
        <p className="text-light" style={{ marginBottom: '40px' }}>
          Cảm ơn bạn đã tin tưởng GiftLove IT. Hệ thống đang tiến hành tạo website quà tặng của bạn.
        </p>

        <div style={{ background: 'var(--color-surface-hover)', borderRadius: '12px', padding: '24px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Rocket size={20} color="var(--color-primary)" />
            Trạng thái Deploy Vercel
          </h3>
          
          {deployStatus === 'deploying' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <div className="spinner" style={{ width: '30px', height: '30px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p>Đang tự động deploy lên Vercel thông qua API...</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>(Quá trình này có thể mất khoảng 1-2 phút)</p>
            </div>
          ) : (
            <div style={{ color: '#2ecc71', fontWeight: '500' }}>
              <p style={{ marginBottom: '15px' }}>Đã deploy thành công!</p>
              <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', width: '100%', marginBottom: '15px' }}>
                Truy cập Website Của Bạn <ExternalLink size={16} />
              </a>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>Link: <a href={deployUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{deployUrl}</a></p>
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '30px' }}>
          <p style={{ marginBottom: '15px' }}>Bạn cũng có thể tải về Source Code để tự lưu trữ:</p>
          <button className="btn btn-primary" style={{ width: '100%' }}>
            <Download size={20} />
            Tải Source Code (.zip)
          </button>
        </div>

        <div style={{ marginTop: '30px' }}>
          <Link to="/" className="text-light" style={{ textDecoration: 'underline' }}>
            Về trang chủ
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
