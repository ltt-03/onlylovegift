import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../../context/AuthContext';
import { Gift, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const { api, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
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
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập Google thất bại');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1rem', minHeight: '80vh', alignItems: 'center' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '40px 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '15px', borderRadius: '24px', background: 'rgba(255, 42, 115, 0.1)', marginBottom: '1.5rem' }}>
            <Gift size={36} color="var(--color-primary)" />
          </div>
          <h2 style={{ color: 'var(--color-text)', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Tạo Tài Khoản</h2>
          <p style={{ color: 'var(--color-text-light)' }}>Bắt đầu tạo món quà bất ngờ</p>
        </div>

        {error && <div className="alert" style={{ backgroundColor: 'rgba(254, 226, 226, 0.8)', color: '#991b1b', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
        {success && <div className="alert" style={{ backgroundColor: 'rgba(220, 252, 227, 0.8)', color: '#166534', padding: '1rem', borderRadius: '15px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label className="auth-label"><User size={18} /> Họ và tên</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A" 
              className="auth-input"
            />
          </div>
          <div>
            <label className="auth-label"><Mail size={18} /> Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhap@email.com" 
              className="auth-input"
            />
          </div>
          <div>
            <label className="auth-label"><Lock size={18} /> Mật khẩu</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="auth-input"
              minLength={6}
            />
          </div>
          
          <button type="submit" className="btn-cute-candy" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={loading || success}>
            {loading ? 'Đang xử lý...' : 'Tạo Tài Khoản Ngay'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '2.5rem 0', color: 'var(--color-text-light)' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '13px', fontWeight: 600 }}>hoặc đăng ký bằng</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            useOneTap
            shape="pill"
            text="signup_with"
          />
        </div>

        <p style={{ textAlign: 'center', color: 'var(--color-text-light)' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
