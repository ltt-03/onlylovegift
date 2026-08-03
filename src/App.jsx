import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { Gift, LogOut, User, Sun, Moon, ChevronLeft, ChevronRight, Home as HomeIcon, LayoutTemplate, Sparkles, LogIn, Wallet, Trophy } from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import Home from './pages/Home';
import Templates from './pages/Templates';
import Customize from './pages/Customize';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Legal from './pages/Legal';
import AuthContainer from './pages/auth/AuthContainer';
import VerifyEmail from './pages/auth/VerifyEmail';
import WalletPage from './pages/Wallet';
import Dashboard from './pages/Dashboard';
import AIChat from './components/AIChat';
import GiftView from './pages/GiftView';


// Layout Component
const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  return (
    <div className="layout-container">
      <div className="mobile-app-wrapper">
        {/* Top Header */}
        <header className="top-header">
          <Link to="/" className="header-logo">
            <Gift size={24} fill="var(--color-primary)" />
            <span>Only Love Gift</span>
          </Link>
          
          <nav className="desktop-nav">
            <Link to="/" className={`desktop-nav-link ${location.pathname === '/' ? 'active' : ''}`}>Trang chủ</Link>
            <Link to="/templates" className={`desktop-nav-link ${location.pathname === '/templates' ? 'active' : ''}`}>Mẫu Giao Diện</Link>
            <a 
              href="/#vip-leaderboard" 
              className="desktop-nav-link"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('vip-leaderboard')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Top VIP
            </a>
            {user && (
              <Link to="/dashboard" className={`desktop-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Quản Lý</Link>
            )}
          </nav>

          <div className="header-actions">
            <button onClick={toggleTheme} className="theme-toggle-btn" title="Chuyển chế độ tối/sáng">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <button onClick={logout} className="theme-toggle-btn" style={{ color: 'var(--color-primary)' }} title="Đăng xuất">
                <LogOut size={20} />
              </button>
            ) : (
              <Link to="/login" className="theme-toggle-btn" style={{ color: 'var(--color-primary)' }} title="Đăng Nhập">
                <LogIn size={20} />
              </Link>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="main-content">
          <main>
            {children}
          </main>

          <footer>
            <div className="container">
              <div className="footer-grid">
                <div className="footer-col">
                  <h3>Only Love Gift</h3>
                  <p className="text-light" style={{ fontSize: '15px' }}>Nền tảng tạo website quà tặng tình yêu lãng mạn.</p>
                  <p className="text-light" style={{ fontSize: '15px', marginTop: '10px' }}>
                    Đại diện quản lý: <strong>Lê Thanh Tùng</strong>
                  </p>
                </div>
                <div className="footer-col">
                  <h3>Hỗ Trợ & Pháp Lý</h3>
                  <ul className="footer-links" style={{ fontSize: '15px' }}>
                    <li><Link to="/legal/terms">Điều khoản dịch vụ</Link></li>
                    <li><Link to="/legal/privacy">Chính sách bảo mật</Link></li>
                    <li><Link to="/legal/shipping">Chính sách giao nhận</Link></li>
                    <li><Link to="/legal/refund">Chính sách hoàn tiền</Link></li>
                    <li><Link to="/legal/payment">Hướng dẫn thanh toán</Link></li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h3>Thông Tin Liên Hệ</h3>
                  <ul className="footer-links" style={{ fontSize: '15px' }}>
                    <li>Hotline/Zalo: 0848.290.617</li>
                    <li>Email: tunglecode@gmail.com</li>
                  </ul>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Only Love Gift. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>

        {/* Bottom Navigation */}
        <nav className="bottom-nav">
          <Link to="/" className={`bottom-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <HomeIcon size={22} />
            Trang chủ
          </Link>
          <Link to="/templates" className={`bottom-nav-link ${location.pathname === '/templates' ? 'active' : ''}`}>
            <LayoutTemplate size={22} />
            Mẫu
          </Link>
          <a 
            href="/#vip-leaderboard" 
            className="bottom-nav-link"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                document.getElementById('vip-leaderboard')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Trophy size={22} />
            Top VIP
          </a>
          {user && (
            <Link to="/dashboard" className={`bottom-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <User size={22} />
              Quản Lý
            </Link>
          )}
        </nav>

        <AIChat />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/create" element={<Customize />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/gift/view/:orderCode" element={<GiftView />} />
          <Route path="/legal/:pageId" element={<Legal />} />
          <Route path="/login" element={<AuthContainer />} />
          <Route path="/register" element={<AuthContainer />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
