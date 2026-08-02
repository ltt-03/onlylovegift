import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { Gift, LogOut, User, Sun, Moon, ChevronLeft, ChevronRight, Home as HomeIcon, LayoutTemplate, Sparkles, LogIn, Wallet } from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import { ThemeContext } from './context/ThemeContext';
import Home from './pages/Home';
import Templates from './pages/Templates';
import Customize from './pages/Customize';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Legal from './pages/Legal';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import WalletPage from './pages/Wallet';
import AIChat from './components/AIChat';


// Layout Component
const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="layout-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        {/* Toggle Button */}
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
        <div className="sidebar-logo">
          <Link to="/" className="sidebar-logo-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--color-primary)', fontWeight: '800', fontSize: '1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '28px' }}>
              <Gift size={28} fill="var(--color-primary)" />
            </div>
            <span className="sidebar-text logo-text">LoveGift IT</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link" title="Trang chủ">
            <HomeIcon size={22} /> <span className="sidebar-text">Trang chủ</span>
          </Link>
          <Link to="/templates" className="sidebar-link" title="Mẫu Giao Diện">
            <LayoutTemplate size={22} /> <span className="sidebar-text">Mẫu Giao Diện</span>
          </Link>
          <Link to="/create" className="sidebar-link" title="Tạo Quà">
            <Sparkles size={22} /> <span className="sidebar-text">Tạo Quà</span>
          </Link>
          {user && (
            <Link to="/wallet" className="sidebar-link" title="Ví Điện Tử">
              <Wallet size={22} /> <span className="sidebar-text">Ví ({user.balance ? user.balance.toLocaleString('vi-VN') : 0}đ)</span>
            </Link>
          )}
        </nav>

        <div className="sidebar-footer">
          <div style={{ padding: '0 15px', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            <button onClick={toggleTheme} className="theme-toggle-btn" title="Chuyển chế độ tối/sáng">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} 
              <span className="sidebar-text">{isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}</span>
            </button>
          </div>

          {user ? (
            <div className="sidebar-user">
              <span className="user-name sidebar-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <User size={20} /> {user.name}
              </span>
              <button onClick={logout} className="logout-btn" title="Đăng xuất">
                <LogOut size={20} /> <span className="sidebar-text">Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div style={{ padding: '0 15px', display: 'flex', justifyContent: 'center' }}>
              <Link to="/login" className="btn-cute-candy login-btn-sidebar" title="Đăng Nhập">
                <LogIn size={20} /> <span className="sidebar-text">Đăng Nhập</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
      
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <main>
          {children}
        </main>

    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>GiftLove IT</h3>
            <p className="text-light">Nền tảng tạo website quà tặng tình yêu lãng mạn, nhanh chóng và tự động.</p>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Da_thong_bao_bo_cong_thuong.svg/300px-Da_thong_bao_bo_cong_thuong.svg.png" 
              alt="Đã thông báo Bộ Công Thương" 
              className="bct-logo"
            />
          </div>
          <div className="footer-col">
            <h3>Sản Phẩm</h3>
            <ul className="footer-links">
              <li><Link to="/templates">Kho Mẫu</Link></li>
              <li><Link to="/create">Tạo Mới</Link></li>
              <li><Link to="/pricing">Bảng Giá</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Pháp Lý</h3>
            <ul className="footer-links">
              <li><Link to="/legal/terms">Điều khoản dịch vụ</Link></li>
              <li><Link to="/legal/privacy">Chính sách bảo mật</Link></li>
              <li><Link to="/legal/shipping">Chính sách giao nhận</Link></li>
              <li><Link to="/legal/refund">Chính sách hoàn tiền</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Hỗ Trợ</h3>
            <ul className="footer-links">
              <li>Hotline: 0123.456.789</li>
              <li>Email: hotro@giftlove.it</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 GiftLove IT. All rights reserved.</p>
        </div>
      </div>
    </footer>
      </div>
      <AIChat />
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
          <Route path="/legal/:pageId" element={<Legal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/wallet" element={<WalletPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
