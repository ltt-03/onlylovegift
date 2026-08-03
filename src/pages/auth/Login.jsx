import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../../context/AuthContext';
import { Gift, Mail, Lock, Heart } from 'lucide-react';

const Login = () => {
  const { login, api } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get('returnUrl');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate(returnUrl || '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate(returnUrl || '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập Google thất bại');
    }
  };

  return (
    <>
      <div className="notebook-card">
        <div className="notebook-holes">
          <div className="notebook-hole"></div>
          <div className="notebook-hole"></div>
          <div className="notebook-hole"></div>
          <div className="notebook-hole"></div>
          <div className="notebook-hole"></div>
          <div className="notebook-hole"></div>
          <div className="notebook-hole"></div>
          <div className="notebook-hole"></div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 2 }}>
          <div className="love-letter-icon-wrapper">
            <Mail size={36} color="var(--color-primary)" strokeWidth={1.5} />
            <Heart size={16} className="heart-badge" fill="var(--color-primary)" />
          </div>
          <h2 style={{ color: 'var(--color-text)', fontSize: '28px', fontWeight: 800, marginBottom: '8px', fontFamily: "'Quicksand', sans-serif" }}>Đăng Nhập</h2>
          <p style={{ color: 'var(--color-text-light)', fontFamily: "'Quicksand', sans-serif", fontStyle: 'italic' }}>Chào mừng bạn quay lại Only Love Gift</p>
        </div>

        {error && <div className="alert" style={{ position: 'relative', zIndex: 2, backgroundColor: 'rgba(254, 226, 226, 0.8)', color: '#991b1b', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
          <div>
            <label className="notebook-label"><Mail size={16} /> Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhap@email.com" 
              className="notebook-input"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label className="notebook-label"><Lock size={16} /> Mật khẩu</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="notebook-input"
              style={{ width: '100%' }}
            />
          </div>
          
          <button type="submit" className="notebook-btn" style={{ marginTop: '20px' }} disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}
          </button>
        </form>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', margin: '2.5rem 0', color: 'var(--color-text-light)' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '13px', fontWeight: 600, fontFamily: "'Quicksand', sans-serif" }}>hoặc tiếp tục với</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            useOneTap
            shape="pill"
          />
        </div>

        <p style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'var(--color-text-light)', fontFamily: "'Quicksand', sans-serif" }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
