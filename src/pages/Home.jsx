import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Wand2, CreditCard, Rocket, CheckCircle, PlayCircle, Star, Trophy, Gift } from 'lucide-react';
import { dummyTemplates } from './Templates';

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
  const [activeVideo, setActiveVideo] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard`);
        const data = await res.json();
        if (data.success) {
          setLeaderboard(data.leaderboard);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleSelect = (templateId) => {
    navigate(`/create?template=${templateId}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'transparent' }}>
        
        <div className="gradient-bg-cloud-1"></div>
        <div className="gradient-bg-cloud-2"></div>
        <FallingHearts />

        <div className="container hero-cute">
          <div className="hero-cute-content" style={{ animation: 'slideInLeft 1s ease forwards' }}>
            {/* Top Badge */}
            <div className="cute-badge" style={{ backgroundColor: '#fff', border: '1px solid #eee', color: '#ff4d4f' }}>
              🌟 Nền Tảng Tạo Website Quà Tặng Số 1 Việt Nam
            </div>
          <h1 className="hero-title-cute" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: 1.2 }}>
            Tạo Bất Ngờ Cho Người Ấy <br />
            <span style={{ color: 'var(--color-primary)' }}>Chỉ Trong 5 Phút 💝</span>
          </h1>
          
          {/* Subtitle */}
          <p className="hero-subtitle-cute" style={{ color: '#4b5563', fontSize: '1.1rem', maxWidth: '500px' }}>
            Hàng ngàn người đã dùng GiftLove để tạo ra những trang web tình yêu độc quyền làm quà tặng sinh nhật, kỷ niệm đầy ý nghĩa.
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151' }}>
              <CheckCircle size={20} color="#10b981" />
              <span style={{ fontSize: '15px', fontWeight: '600' }}>Hơn 10,000+ món quà đã tạo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151' }}>
              <CheckCircle size={20} color="#10b981" />
              <span style={{ fontSize: '15px', fontWeight: '600' }}>Tự động lên mạng tức thì</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151' }}>
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
              <img src="/images/love-box-01.jpeg" alt="Quà Tặng Sinh Nhật 3D" style={{ width: '100%', display: 'block', objectFit: 'cover', height: '400px' }} />
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
      <section id="featured-templates" style={{ padding: '80px 0', backgroundColor: '#fffafb' }}>
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
                    onClick={() => setActiveVideo(template.videoUrl)}
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: 'var(--color-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <PlayCircle size={16} />
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
                  <p className="text-light" style={{ marginBottom: '24px', flex: 1, fontSize: '0.95rem', lineHeight: 1.5 }}>{template.description}</p>
                  <button 
                    onClick={() => handleSelect(template.id)}
                    className="btn btn-primary" 
                    style={{ width: '100%', fontSize: '1.05rem', padding: '12px', boxShadow: '0 4px 15px rgba(255, 107, 158, 0.4)' }}
                  >
                    Tạo Ngay Mẫu Này
                  </button>
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

      {/* VIP Leaderboard */}
      <section id="vip-leaderboard" style={{ padding: '80px 0', backgroundColor: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #ffd700, #ffa500)', color: 'white', marginBottom: '16px', boxShadow: '0 10px 25px rgba(255, 165, 0, 0.4)' }}>
              <Trophy size={28} />
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 850, color: 'var(--color-text)', marginBottom: '12px' }}>Bảng Xếp Hạng VIP</h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto' }}>Vinh danh những khách hàng thân thiết đã tạo ra nhiều món quà ý nghĩa nhất.</p>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto 24px auto', padding: '16px 20px', background: 'linear-gradient(to right, #fff5f5, #fff)', borderRadius: '12px', borderLeft: '4px solid var(--color-primary)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #fce4ec' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gift size={20} color="var(--color-primary)" />
              Cơ cấu phần thưởng Tri ân Top 3 tháng này
            </h4>
            <ul style={{ margin: 0, paddingLeft: '24px', fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
              <li><strong>Top 1:</strong> Tặng Voucher giảm <strong>50%</strong> (Áp dụng cho mọi mẫu trong 1 tháng)</li>
              <li><strong>Top 2:</strong> Tặng Voucher giảm <strong>30%</strong> (Áp dụng cho mọi mẫu trong 1 tháng)</li>
              <li><strong>Top 3:</strong> Tặng Voucher giảm <strong>20%</strong> (Áp dụng cho mọi mẫu trong 1 tháng)</li>
            </ul>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic' }}>* Hướng dẫn: Bảng xếp hạng sẽ chốt sổ vào ngày cuối cùng của tháng. Hệ thống tự động gửi mã Voucher qua email cho Top 3. Hãy nạp thêm để leo top nhé!</p>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
            {leaderboard.length > 0 ? (
              leaderboard.map((user, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '20px 24px', 
                  borderBottom: index < leaderboard.length - 1 ? '1px solid #f3f4f6' : 'none',
                  backgroundColor: index === 0 ? '#fffdf0' : (index === 1 ? '#f8f9fa' : '#fff'),
                  transition: 'background-color 0.2s'
                }}>
                  <div style={{ width: '40px', fontWeight: 'bold', fontSize: '1.2rem', color: index === 0 ? '#fbbf24' : (index === 1 ? '#9ca3af' : (index === 2 ? '#b45309' : '#d1d5db')) }}>
                    {index === 0 ? <Trophy size={24} /> : (index === 1 ? <Star size={24} /> : (index === 2 ? <Star size={24} /> : `#${index + 1}`))}
                  </div>
                  
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      style={{
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '16px',
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, var(--color-primary), #ff8da1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      marginRight: '16px'
                    }}>
                      {(user.name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1f2937', fontWeight: 600 }}>{user.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} color="#10b981" />
                      Đã xác minh
                    </span>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {user.totalDeposited.toLocaleString()}đ
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: index <= 2 ? '4px' : '0' }}>Tổng nạp</div>
                    {index <= 2 && (
                      <div>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold', 
                          color: '#fff', 
                          background: index === 0 ? 'linear-gradient(135deg, #f87171, #ef4444)' : (index === 1 ? 'linear-gradient(135deg, #fb923c, #f97316)' : 'linear-gradient(135deg, #facc15, #eab308)'), 
                          padding: '3px 8px', 
                          borderRadius: '12px',
                          display: 'inline-block',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>
                          🎁 Giảm {index === 0 ? '50%' : (index === 1 ? '30%' : '20%')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Đang tải bảng xếp hạng...</div>
            )}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => setActiveVideo(null)}
        >
          <div 
            style={{ position: 'relative', width: '90%', maxWidth: '800px', aspectRatio: '16/9' }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveVideo(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              <X size={32} />
            </button>
            <iframe 
              src={activeVideo} 
              title="Video Demo"
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

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
    </div>
  );
}
