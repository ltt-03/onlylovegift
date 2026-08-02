import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Wand2, CreditCard, Rocket, CheckCircle } from 'lucide-react';

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
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--color-background)' }}>
        
        <div className="gradient-bg-cloud-1"></div>
        <div className="gradient-bg-cloud-2"></div>
        <FallingHearts />

        <div className="container hero-cute">
          <div className="hero-cute-content" style={{ animation: 'slideInLeft 1s ease forwards' }}>
            {/* Top Badge */}
            <div className="cute-badge">
              💻 Lập trình Website tình yêu không cần viết code
            </div>
          <h1 className="hero-title-cute">
            Nơi tình yêu tỏa sáng, <br />
            <span>nơi hạnh phúc thăng hoa 💫</span>
          </h1>
          
          {/* Subtitle */}
          <p className="hero-subtitle-cute">
            Không cần biết lập trình, bạn vẫn có thể tự tay tạo ra một trang web lãng mạn vô giá làm quà tặng độc quyền cho một nửa yêu thương.
          </p>
          
          {/* CTA */}
          <Link to="/templates" className="btn-cute-candy">
            Bắt Đầu Hành Trình 🚀
          </Link>
          
          {/* Realistic Features Highlight */}
          <div className="social-proof-cute" style={{ background: 'transparent', padding: '0', backdropFilter: 'none', border: 'none', boxShadow: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
              <CheckCircle size={18} color="#10b981" />
              <span style={{ fontSize: '14.5px', fontWeight: '600' }}>Mẫu giao diện đa dạng</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
              <CheckCircle size={18} color="#10b981" />
              <span style={{ fontSize: '14.5px', fontWeight: '600' }}>Hoàn thành trong 5 phút</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
              <CheckCircle size={18} color="#10b981" />
              <span style={{ fontSize: '14.5px', fontWeight: '600' }}>Lưu trữ vĩnh viễn</span>
            </div>
          </div>
          </div>
          
          {/* Unique Image Wrapper */}
          <div className="hero-image-wrapper" style={{ animation: 'slideInRight 1s ease forwards' }}>
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Sparkling%20Heart.png" alt="Sparkling Heart" style={{ width: '100%', maxWidth: '380px' }} />
            <div className="floating-emoji" style={{ top: '15%', left: '-10%', fontSize: '32px', animationDelay: '0s' }}>✨</div>
            <div className="floating-emoji" style={{ bottom: '15%', right: '-15%', fontSize: '36px', animationDelay: '1.5s' }}>💖</div>
            <div className="floating-emoji" style={{ top: '-5%', right: '15%', fontSize: '28px', animationDelay: '2.5s' }}>💫</div>
          </div>
        </div>
      </section>

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
