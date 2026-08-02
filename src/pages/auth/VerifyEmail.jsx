import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CheckCircle, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { api } = useContext(AuthContext);

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Đang xác minh email của bạn...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Link xác minh không hợp lệ.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await api.post('/auth/verify-email', { token });
        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Có lỗi xảy ra khi xác minh email.');
      }
    };

    verifyToken();
  }, [token, api]);

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
      <div className="checkout-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        {status === 'loading' && (
          <div style={{ padding: '2rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ padding: '1rem' }}>
            <CheckCircle size={64} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ color: '#16a34a', marginBottom: '1rem' }}>Thành Công!</h2>
            <p className="text-light" style={{ marginBottom: '2rem' }}>{message}</p>
            <Link to="/login" className="candy-btn w-100">Đến trang Đăng Nhập</Link>
          </div>
        )}

        {status === 'error' && (
          <div style={{ padding: '1rem' }}>
            <XCircle size={64} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Xác Minh Thất Bại</h2>
            <p className="text-light" style={{ marginBottom: '2rem' }}>{message}</p>
            <Link to="/login" className="candy-btn w-100" style={{ background: '#f3f4f6', color: '#374151' }}>Về trang Đăng Nhập</Link>
          </div>
        )}
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
};

export default VerifyEmail;
