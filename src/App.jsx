import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { Gift, LogOut, User, Sun, Moon, ChevronLeft, ChevronRight, Home as HomeIcon, LayoutTemplate, Sparkles, LogIn, Wallet, Trophy, MessageSquareHeart, Globe, Wrench } from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import Home from './pages/Home';
import Templates from './pages/Templates';
import Customize from './pages/Customize';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Legal from './pages/Legal';
import AuthContainer from './pages/auth/AuthContainer';
import AuthModal from './pages/auth/AuthModal';
import UploadProgressModal from './components/UploadProgressModal';
import VerifyEmail from './pages/auth/VerifyEmail';
import WalletPage from './pages/Wallet';
import Dashboard from './pages/Dashboard';
import AIChat from './components/AIChat';
import GiftView from './pages/GiftView';
import Feedback from './pages/Feedback';
import Admin from './pages/Admin';
import CreateXMasTree from './pages/CreateXMasTree';
import CreateGiftSurprise from './pages/CreateGiftSurprise';
import CreateHeartCode from './pages/CreateHeartCode';
import CreateLoveGift3D from './pages/CreateLoveGift3D';
import CreateLuckyChance from './pages/CreateLuckyChance';
import CreateMerryChristmas from './pages/CreateMerryChristmas';
import CreateChristmas from './pages/CreateChristmas';
import FreeProjects from './pages/FreeProjects';
import ITServices from './pages/ITServices';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout Component
const Layout = ({ children }) => {
  const { user, logout, openAuthModal } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);

  if (location.pathname.startsWith('/gift/view')) {
    return <>{children}</>;
  }

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
            <div className="nav-dropdown-container">
              <div 
                className={`desktop-nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                onClick={() => {
                  if (location.pathname !== '/') {
                    navigate('/');
                  } else {
                    setIsHomeMenuOpen(!isHomeMenuOpen);
                  }
                }}
              >
                Trang chủ <span style={{ fontSize: '0.8em' }}>▼</span>
              </div>
              
              {isHomeMenuOpen && (
                <div className="nav-dropdown-menu">
                  <a 
                    href="/#featured-templates" 
                    className="nav-dropdown-item"
                    onClick={(e) => {
                      setIsHomeMenuOpen(false);
                      if (location.pathname === '/') {
                        e.preventDefault();
                        document.getElementById('featured-templates')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Sản phẩm nổi bật
                  </a>
                </div>
              )}
            </div>
            <Link to="/templates" className={`desktop-nav-link ${location.pathname === '/templates' ? 'active' : ''}`}>Mẫu Quà Tặng</Link>
            <Link to="/free-projects" className={`desktop-nav-link ${location.pathname === '/free-projects' ? 'active' : ''}`}>Web Miễn Phí</Link>
            <Link to="/it-services" className={`desktop-nav-link ${location.pathname === '/it-services' ? 'active' : ''}`}>Dịch Vụ IT</Link>
            
            {user && (
              <Link to="/dashboard" className={`desktop-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Quản Lý</Link>
            )}
            {user && user.role === 'ADMIN' && (
              <Link to="/admin" className={`desktop-nav-link ${location.pathname === '/admin' ? 'active' : ''}`} style={{ color: '#ff8a65' }}>Admin</Link>
            )}
          </nav>

          <div className="header-actions">
            <button onClick={toggleTheme} className="theme-toggle-btn" title="Chuyển chế độ tối/sáng">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <button onClick={logout} className="theme-toggle-btn" style={{ color: 'var(--color-primary)', borderRadius: '20px', padding: '6px 14px', gap: '6px' }} title="Đăng xuất">
                <LogOut size={18} />
                <span style={{ fontSize: '14px', fontWeight: '600' }} className="hide-on-mobile">Đăng xuất</span>
              </button>
            ) : (
              <button onClick={() => openAuthModal('login')} className="theme-toggle-btn" style={{ color: 'var(--color-primary)', borderRadius: '20px', padding: '6px 14px', gap: '6px', textDecoration: 'none', background: 'var(--color-surface)', border: 'none', cursor: 'pointer' }} title="Đăng Nhập">
                <LogIn size={18} />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Đăng Nhập</span>
              </button>
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
                  <div className="text-light" style={{ fontSize: '14px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>Đại diện quản lý: <strong>Lê Thanh Tùng</strong></div>
                    <div>MST: <strong>8781172614</strong></div>
                    <div>Địa chỉ: <strong>La Xuyên, Cổ Đô, Hà Nội</strong></div>
                  </div>
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
                    <li>Hotline: 0583.652.509</li>
                    <li>Zalo: 0848.290.617</li>
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
          <div
            className={`bottom-nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', flex: 1 }}
          >
            <HomeIcon size={22} />
            Trang chủ
          </div>

          <Link to="/templates" className={`bottom-nav-link ${location.pathname === '/templates' ? 'active' : ''}`}>
            <LayoutTemplate size={22} />
            Mẫu
          </Link>

          <Link to="/free-projects" className={`bottom-nav-link ${location.pathname === '/free-projects' ? 'active' : ''}`}>
            <Globe size={20} />
            Khám Phá
          </Link>

          <Link to="/it-services" className={`bottom-nav-link ${location.pathname === '/it-services' ? 'active' : ''}`}>
            <Wrench size={20} />
            Dịch Vụ IT
          </Link>

          {user && (
            <Link to="/dashboard" className={`bottom-nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <User size={22} />
              Quản Lý
            </Link>
          )}
        </nav>

        {/* <AIChat /> */}
        <AuthModal />
        <UploadProgressModal />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/create" element={<Customize />} />
          <Route path="/create/x-mas-tree" element={<CreateXMasTree />} />
          <Route path="/create/gift-surprise-v2" element={<CreateGiftSurprise />} />
          <Route path="/create/heart-code" element={<CreateHeartCode />} />
          <Route path="/create/love-gift-3d" element={<CreateLoveGift3D />} />
          <Route path="/create/lucky-chance" element={<CreateLuckyChance />} />
          <Route path="/create/merry-christmas" element={<CreateMerryChristmas />} />
          <Route path="/create/christmas" element={<CreateChristmas />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/free-projects" element={<FreeProjects />} />
          <Route path="/it-services" element={<ITServices />} />
          <Route path="/admin" element={<Admin />} />
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
