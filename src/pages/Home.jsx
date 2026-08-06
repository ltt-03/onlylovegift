import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Wand2, CreditCard, Rocket, CheckCircle, PlayCircle, ShieldCheck, Sparkles, Zap, Star, MessageCircle, X, ChevronLeft, ChevronRight, Trophy, Gift } from 'lucide-react';
import { dummyTemplates } from './Templates';
import SecurePreview from '../components/SecurePreview';
import { getCreateRoute } from '../utils/templateRoutes';
import SEO from '../components/SEO';
import InstructionModal from '../components/InstructionModal';

const FallingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const emojis = ['💖', '💕', '💗', '🌸', '🎀', '✨', '🎁', '❄️', '🌹', '💌', '🎊', '🎈', '🍫', '🧸', '💝'];
    let heartId = 0;

    const interval = setInterval(() => {
      setHearts(prev => {
        const newHearts = [...prev, {
          id: heartId++,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          left: Math.random() * 100 + 20 + 'vw', // start slightly to the right to fall left diagonally
          duration: (Math.random() * 4 + 5) + 's',
          fontSize: (Math.random() * 15 + 15) + 'px'
        }];
        return newHearts.slice(-25);
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {hearts.map(heart => (
        <div
          key={heart.id}
          style={{
            position: 'absolute',
            left: heart.left,
            top: '-50px',
            animation: `fallDiagonal ${heart.duration} linear forwards`,
            fontSize: heart.fontSize,
            opacity: 0
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [instructionModal, setInstructionModal] = useState({ isOpen: false, templateName: '' });
  const [activePreview, setActivePreview] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        // Fetch leaderboard
        const resLead = await fetch(`${apiUrl}/api/leaderboard`);
        const dataLead = await resLead.json();
        if (dataLead.success) setLeaderboard(dataLead.leaderboard);

        // Fetch feedbacks
        const resFb = await fetch(`${apiUrl}/api/feedbacks`);
        const dataFb = await resFb.json();
        if (dataFb.success) setFeedbacks(dataFb.feedbacks);

        // Fetch template stats
        const resStats = await fetch(`${apiUrl}/api/templates/stats`);
        const dataStats = await resStats.json();
        if (dataStats.success) setStats(dataStats.stats);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const getTemplateStats = (template) => {
    const realCount = stats[template.id] || 0;
    return (template.baseCount || 0) + realCount;
  };

  const handlePreview = (templateId) => {
    setActivePreview(templateId);
  };

  // Dùng getCreateRoute từ utils/templateRoutes.js — KHÔNG viết if/else thủ công ở đây
  const handleSelect = (templateId) => navigate(getCreateRoute(templateId));

  return (
    <div className="home-page">
      <SEO
        title="Tạo Code Trái Tim Viral TikTok & Web Tỏ Tình 💝 — Miễn Phí"
        description="💝 Code trái tim tỏ tình 3D đang viral TikTok, hộp quà sinh nhật bất ngờ, thiệp valentine online siêu lãng mạn. Cá nhân hóa tên & lời chúc — tự lên mạng ngay chỉ 5 phút!"
        keywords="only gift, only gift online, onlylovegift, love gift IT, mã code trái tim, code trái tim tỏ tình, code trái tim đập, code trái tim tiktok, web tỏ tình, tạo website quà tặng, quà tặng sinh nhật, quà tặng bạn gái, quà valentine, thiệp online, trend tiktok, gift only, dear gift"
        url="https://www.onlygift.online/"
        softwareSchema={{
          name: "OnlyLoveGift",
          description: "Nền tảng tạo website quà tặng tình yêu online: mã code trái tim tỏ tình 3D trend TikTok, hộp quà sinh nhật bất ngờ, thiệp valentine online. Miễn phí & tự động lên mạng ngay!",
          price: "0",
          rating: "4.9",
          ratingCount: "850"
        }}
        faqSchema={[
          { q: "OnlyLoveGift là gì?", a: "OnlyLoveGift (onlygift.online) là nền tảng tạo website quà tặng tình yêu online miễn phí tại Việt Nam. Bạn có thể tạo mã code trái tim tỏ tình 3D trend TikTok, hộp quà sinh nhật bất ngờ, thiệp Valentine và nhiều mẫu quà tặng độc đáo khác chỉ trong 5 phút." },
          { q: "Mã code trái tim TikTok là gì và cách tạo?", a: "Mã code trái tim TikTok (code trái tim đập) là hiệu ứng trái tim lãng mạn tạo từ ký tự code lập trình, đang viral trên TikTok. Tại OnlyLoveGift, bạn tạo được mã code trái tim tỏ tình cá nhân hóa với tên người yêu và lời chúc trong vài phút." },
          { q: "Cách tạo web tỏ tình tặng người yêu?", a: "Tạo web tỏ tình tại OnlyLoveGift: 1) Chọn mẫu (code trái tim, hộp quà, thiệp...), 2) Nhập tên và lời nhắn, 3) Tải ảnh kỷ niệm lên, 4) Thanh toán và nhận link website ngay. Link tồn tại vĩnh viễn để gửi qua Zalo, Messenger." },
          { q: "Tạo quà tặng sinh nhật online có những mẫu nào?", a: "OnlyLoveGift có nhiều mẫu quà tặng sinh nhật online: Hộp quà bất ngờ 3D hiệu ứng mở hộp và bóng bay, code trái tim tỏ tình lãng mạn, vòng quay may mắn, thiệp Giáng Sinh 3D. Tất cả đều cá nhân hóa được." },
          { q: "Tạo quà tặng bạn gái online ở đâu đẹp?", a: "OnlyLoveGift là lựa chọn hàng đầu tạo quà tặng bạn gái online. Các mẫu 3D độc đáo như code trái tim tỏ tình, hộp quà bất ngờ, thiệp Valentine cá nhân hóa với link riêng gửi qua Zalo, Messenger." },
          { q: "Quà Valentine online có tạo được không?", a: "Có! OnlyLoveGift có nhiều mẫu quà Valentine online: thiệp Valentine 3D lãng mạn, hộp quà bất ngờ ngày Valentine, code trái tim tỏ tình. Chỉ cần nhập tên và lời chúc, hệ thống tạo website riêng đẹp mắt gửi tặng người ấy." },
          { q: "Chi phí tạo website quà tặng tại OnlyLoveGift?", a: "OnlyLoveGift có gói miễn phí và trả phí. Gói cơ bản miễn phí với các mẫu thiệp cơ bản. Các mẫu 3D cao cấp như hộp quà bất ngờ, code trái tim đặc biệt có phí rất thấp, phù hợp mọi ngân sách." },
          { q: "Website quà tặng tồn tại bao lâu?", a: "Website quà tặng tạo tại OnlyLoveGift tồn tại vĩnh viễn sau khi thanh toán. Bạn nhận link riêng gửi qua Zalo, Messenger hoặc bất kỳ nền tảng nào, xem lại được bất cứ lúc nào." }
        ]}
      />
      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'transparent' }}>
        
        <div className="gradient-bg-cloud-1"></div>
        <div className="gradient-bg-cloud-2"></div>
        <FallingHearts />

        <div className="container hero-cute">
          <div className="hero-cute-content" style={{ animation: 'slideInLeft 1s ease forwards' }}>
            {/* Top Badge */}
            <div className="cute-badge" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#ff4d4f' }}>
              🌟 Nền Tảng Tạo Website Quà Tặng Số 1 Việt Nam
            </div>
          <h1 className="hero-title-cute" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: 1.2 }}>
            Tạo Website Tỏ Tình & Quà Tặng <br />
            <span style={{ color: 'var(--color-primary)' }}>Siêu Trend TikTok 💝</span>
          </h1>
          
          {/* Subtitle */}
          <p className="hero-subtitle-cute" style={{ color: 'var(--color-text-light)', fontSize: '1.1rem', maxWidth: '500px' }}>
            Nền tảng giúp bạn tạo ra những trang web tỏ tình, code trái tim đập độc quyền làm quà tặng sinh nhật, kỷ niệm đầy ý nghĩa.
          </p>
          
          {/* CTA */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button onClick={() => {
              document.getElementById('featured-templates').scrollIntoView({ behavior: 'smooth' });
            }} className="btn-cute-candy" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
              Khám Phá Mẫu Ngay 🚀
            </button>
          </div>
          
          {/* Realistic Features Highlight */}
          <div className="social-proof-cute" style={{ background: 'transparent', padding: '0', backdropFilter: 'none', border: 'none', boxShadow: 'none', marginTop: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
              <CheckCircle size={20} color="#10b981" />
              <span style={{ fontSize: '15px', fontWeight: '600' }}>Thiết kế độc đáo, cá nhân hóa</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
              <CheckCircle size={20} color="#10b981" />
              <span style={{ fontSize: '15px', fontWeight: '600' }}>Tự động lên mạng tức thì</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
              <CheckCircle size={20} color="#10b981" />
              <span style={{ fontSize: '15px', fontWeight: '600' }}>Thanh toán bảo mật 100%</span>
            </div>
          </div>
          </div>
          
          {/* Unique Image Wrapper */}
          <div className="hero-image-wrapper" style={{ animation: 'slideInRight 1s ease forwards', position: 'relative' }}>
            <div style={{ 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '8px solid white'
            }}>
              <img src="/images/heart-code.jpg" alt="Trái Tim Mã Nguồn" style={{ width: '100%', display: 'block', objectFit: 'cover', height: '400px' }} />
            </div>
            <div className="floating-emoji" style={{ top: '-5%', right: '-5%', fontSize: '32px', animationDelay: '0s', background: 'white', padding: '10px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>🎁</div>
            <div className="floating-emoji" style={{ bottom: '10%', left: '-10%', fontSize: '28px', animationDelay: '1.5s', background: 'white', padding: '10px', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>💖</div>
            
            {/* Trust badge overlapping image */}
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              right: '20px',
              background: 'linear-gradient(135deg, #ff4d4f, #ff7875)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '30px',
              fontWeight: 'bold',
              boxShadow: '0 10px 15px -3px rgba(255, 77, 79, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'float 3s ease-in-out infinite'
            }}>
              <Star size={18} fill="white" />
              Bán chạy nhất
            </div>
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section id="featured-templates" style={{ padding: '80px 0', backgroundColor: 'transparent' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 850, color: 'var(--color-text)', marginBottom: '12px' }}>🔥 Sản Phẩm Nổi Bật</h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto' }}>Những giao diện quà tặng được khách hàng yêu thích và tạo nhiều nhất trong tháng này.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {dummyTemplates.map(template => (
              <div key={template.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #fce4ec', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setInstructionModal({ isOpen: true, templateName: template.name });
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: 'var(--color-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      zIndex: 999
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span style={{ fontSize: '1.1rem' }}>📚</span>
                    Hướng dẫn
                  </button>
                </div>
                
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 700 }}>{template.name}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {template.discountPrice && (
                          <span style={{ textDecoration: 'line-through', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                            {template.price}
                          </span>
                        )}
                        <span style={{ fontWeight: 'bold', color: 'white', background: 'var(--color-primary)', padding: '4px 12px', borderRadius: 'var(--radius-full)', boxShadow: '0 4px 10px rgba(255, 107, 158, 0.3)' }}>
                          {template.discountPrice || template.price}
                        </span>
                      </div>
                      {template.discountPercent && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold', background: '#ff4d4f', padding: '2px 6px', borderRadius: '4px' }}>
                            {template.discountPercent}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#ff4d4f', fontWeight: 'bold' }}>
                            {template.discountLabel}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-light" style={{ marginBottom: '15px', flex: 1, fontSize: '0.95rem', lineHeight: 1.5 }}>{template.description}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '20px', padding: '10px', background: 'var(--color-surface-hover)', borderRadius: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🔄 {template.lastUpdated}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', color: '#f59e0b' }}>🔥 {getTemplateStats(template)} lượt tạo</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handlePreview(template.id)}
                      className="btn btn-outline" 
                      style={{ flex: 1, padding: '12px 0', fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                    >
                      Xem Demo
                    </button>
                    <button 
                      onClick={() => handleSelect(template.id)}
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '12px 0', fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(255, 107, 158, 0.4)' }}
                    >
                      Tạo Quà
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/templates" className="btn btn-outline" style={{ display: 'inline-flex', padding: '12px 30px', fontWeight: 'bold', fontSize: '1.05rem' }}>
              Xem Toàn Bộ Kho Mẫu 👉
            </Link>
          </div>
        </div>
      </section>

      {/* Ecosystem & Services Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--color-bg-alt)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white', marginBottom: '16px', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)' }}>
              <Sparkles size={28} />
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 850, color: 'var(--color-text)', marginBottom: '12px' }}>Hệ Sinh Thái & Dịch Vụ</h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto' }}>Không chỉ là quà tặng, chúng tôi còn mang đến những giải pháp công nghệ và tiện ích mở rộng.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            
            {/* Free Projects Card */}
            <div className="card" style={{ padding: '40px', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                 <Rocket size={40} className="text-primary" />
               </div>
               <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px', color: 'var(--color-text)' }}>Dự Án Web Miễn Phí</h3>
               <p style={{ color: 'var(--color-text-light)', lineHeight: 1.6, marginBottom: '32px', fontSize: '1.05rem' }}>Khám phá các nền tảng học tập, tiện ích (Study with me, nhạc Lofi, Pomodoro...) do đội ngũ phát triển hoàn toàn miễn phí.</p>
               <Link to="/free-projects" className="btn btn-outline" style={{ marginTop: 'auto', padding: '12px 30px', fontSize: '1.05rem', fontWeight: 'bold', width: '100%' }}>
                 Khám phá ngay 👉
               </Link>
            </div>

            {/* IT Services Card */}
            <div className="card" style={{ padding: '40px', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                 <ShieldCheck size={40} color="#10b981" />
               </div>
               <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px', color: 'var(--color-text)' }}>Hỗ Trợ Đồ Án IT & Setup</h3>
               <p style={{ color: 'var(--color-text-light)', lineHeight: 1.6, marginBottom: '32px', fontSize: '1.05rem' }}>Nhận làm đồ án môn học, tốt nghiệp IT trọn gói (Code + Slide + Báo cáo). Hỗ trợ cài đặt và triển khai hệ thống.</p>
               <Link to="/it-services" className="btn btn-primary" style={{ marginTop: 'auto', padding: '12px 30px', fontSize: '1.05rem', fontWeight: 'bold', width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff' }}>
                 Xem chi tiết dịch vụ
               </Link>
            </div>

          </div>
        </div>
      </section>


      {/* Customer Feedbacks Section (Tạm ẩn để duyệt BCT)
      <section style={{ padding: '80px 0', backgroundColor: 'transparent' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b9e, #ffb3c6)', color: 'white', marginBottom: '16px', boxShadow: '0 10px 25px rgba(255, 107, 158, 0.4)' }}>
              <MessageCircle size={28} />
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 850, color: 'var(--color-text)', marginBottom: '12px' }}>Khách Hàng Nói Gì</h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto' }}>Những phản hồi chân thực từ người dùng đã trải nghiệm Only Love Gift.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {feedbacks.slice((currentPage - 1) * feedbacksPerPage, currentPage * feedbacksPerPage).map((fb, index) => (
              <div key={fb.id || index} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {fb.avatar ? (
                    <img src={fb.avatar} alt={fb.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fce4ec' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff6b9e, #ffb3c6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {fb.name ? fb.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{fb.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < fb.rating ? '#fbbf24' : 'transparent'} color={i < fb.rating ? '#fbbf24' : '#d1d5db'} />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                        {new Date(fb.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--color-text)', lineHeight: 1.6 }}>"{fb.message}"</p>
              </div>
            ))}
          </div>

          {feedbacks.length > feedbacksPerPage && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '40px' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: currentPage === 1 ? 'rgba(0,0,0,0.05)' : 'var(--color-surface)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={20} color={currentPage === 1 ? '#9ca3af' : 'var(--color-text)'} />
              </button>
              
              <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                Trang {currentPage} / {Math.ceil(feedbacks.length / feedbacksPerPage)}
              </span>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(feedbacks.length / feedbacksPerPage)))}
                disabled={currentPage === Math.ceil(feedbacks.length / feedbacksPerPage)}
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: currentPage === Math.ceil(feedbacks.length / feedbacksPerPage) ? 'rgba(0,0,0,0.05)' : 'var(--color-surface)', cursor: currentPage === Math.ceil(feedbacks.length / feedbacksPerPage) ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={20} color={currentPage === Math.ceil(feedbacks.length / feedbacksPerPage) ? '#9ca3af' : 'var(--color-text)'} />
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/feedback" className="btn btn-outline" style={{ display: 'inline-flex', padding: '12px 30px', fontWeight: 'bold', fontSize: '1.05rem' }}>
              Viết Đánh Giá Của Bạn 👉
            </Link>
          </div>
        </div>
      </section>
      */}

      {/* How it works */}
      <section className="steps-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '16px', background: '#fff0f6', color: 'var(--color-primary)', marginBottom: '16px' }}>
              <Rocket size={24} />
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 850, color: 'var(--color-text)', marginBottom: '12px' }}>Chỉ với 4 bước đơn giản</h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-light)', maxWidth: '500px', margin: '0 auto' }}>Tạo ra món quà kỹ thuật số độc đáo mang đậm dấu ấn cá nhân chưa bao giờ dễ dàng đến thế.</p>
          </div>
          
          <div className="steps-grid">
            <div className="steps-connector"></div>
            
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon-wrap">
                <Heart size={32} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '18px', color: 'var(--color-text)', marginBottom: '12px' }}>Chọn mẫu thiết kế</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-light)', lineHeight: 1.6 }}>Lựa chọn từ hàng chục mẫu giao diện tình yêu lãng mạn đa dạng.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon-wrap">
                <Wand2 size={32} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '18px', color: 'var(--color-text)', marginBottom: '12px' }}>Tùy chỉnh dễ dàng</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-light)', lineHeight: 1.6 }}>Thêm tên, hình ảnh và thông điệp cá nhân hóa để món quà thêm phần ý nghĩa.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon-wrap">
                <CreditCard size={32} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '18px', color: 'var(--color-text)', marginBottom: '12px' }}>Thanh toán nhanh</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-light)', lineHeight: 1.6 }}>Hỗ trợ thanh toán bảo mật, quét mã QR cực nhanh gọn và tiện lợi.</p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-icon-wrap">
                <Rocket size={32} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '18px', color: 'var(--color-text)', marginBottom: '12px' }}>Tự động triển khai</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-light)', lineHeight: 1.6 }}>Hệ thống sẽ tự động lên sóng website của bạn và trả link sử dụng ngay.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {activePreview && (
        <div 
          className="preview-modal-overlay"
          onClick={() => setActivePreview(null)}
        >
          <div 
            className="preview-modal-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActivePreview(null)}
              className="preview-modal-close"
            >
              <X size={28} />
            </button>
            <SecurePreview templateId={activePreview} />
          </div>
          <style>{`
            .preview-modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background-color: rgba(0,0,0,0.85);
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              box-sizing: border-box;
            }
            .preview-modal-inner {
              width: 100%;
              max-width: 1000px;
              position: relative;
            }
            .preview-modal-close {
              position: absolute;
              top: -44px;
              right: 0;
              background: transparent;
              border: none;
              color: white;
              cursor: pointer;
              z-index: 10;
              padding: 4px;
            }
            @media (max-width: 768px) {
              .preview-modal-overlay {
                padding: 0;
                align-items: flex-start;
              }
              .preview-modal-inner {
                width: 100vw;
                max-width: 100vw;
                height: 100vh;
                display: flex;
                flex-direction: column;
              }
              .preview-modal-close {
                position: fixed;
                top: 8px;
                right: 8px;
                top: env(safe-area-inset-top, 8px);
                background: rgba(0,0,0,0.6);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
              }
            }
          `}</style>
        </div>
      )}

      {/* Instruction Modal */}
      <InstructionModal
        isOpen={instructionModal.isOpen}
        onClose={() => setInstructionModal({ isOpen: false, templateName: '' })}
        templateName={instructionModal.templateName}
      />
    </div>
  );
}
