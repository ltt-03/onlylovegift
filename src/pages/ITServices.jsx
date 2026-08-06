import React, { useState } from 'react';
import { Code, Server, Smartphone, GraduationCap, ArrowRight, ShieldCheck, Zap, MessageCircle, Users, Copy, Check } from 'lucide-react';
import SEO from '../components/SEO';

export default function ITServices() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('0848290617');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const services = [
    {
      icon: <GraduationCap size={32} className="text-primary" />,
      title: 'Đồ Án Môn Học & Tốt Nghiệp',
      description: 'Nhận làm trọn gói đồ án môn học, đồ án tốt nghiệp ngành IT (Website, Mobile App, AI/ML). Bàn giao đầy đủ Source Code, Báo cáo chi tiết (Word), và Slide thuyết trình chuyên nghiệp.'
    },
    {
      icon: <Code size={32} className="text-primary" />,
      title: 'Thiết Kế Website/App Theo Yêu Cầu',
      description: 'Phát triển các hệ thống phần mềm, website, landing page, ứng dụng di động chất lượng cao, tối ưu UI/UX và chuẩn SEO theo yêu cầu riêng của doanh nghiệp hoặc cá nhân.'
    },
    {
      icon: <Server size={32} className="text-primary" />,
      title: 'Hướng Dẫn Cài Đặt (Setup & Deploy)',
      description: 'Hỗ trợ setup môi trường, cài đặt source code lên máy tính cá nhân. Hướng dẫn deploy ứng dụng lên Vercel, Heroku, VPS, hoặc các nền tảng Cloud nhanh chóng.'
    }
  ];

  return (
    <div className="home-page" style={{ paddingBottom: '60px' }}>
      <SEO title="Dịch Vụ IT & Thiết Kế" description="Cung cấp các dịch vụ IT, thiết kế web và lập trình theo yêu cầu." />
      {/* Hero Section */}
      <section style={{ 
        padding: '80px 0 60px', 
        background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-alt) 100%)',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container" style={{ animation: 'fadeInDown 0.6s ease' }}>
          <div style={{ display: 'inline-block', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-primary)', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', marginBottom: '20px', fontSize: '0.9rem' }}>
            IT Solutions & Academic Support
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 800, margin: '0 0 20px 0', color: 'var(--color-text)', lineHeight: 1.2 }}>
            Dịch Vụ Hỗ Trợ Đồ Án IT & Lập Trình
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', maxWidth: '700px', margin: '0 auto 30px', lineHeight: 1.6 }}>
            Đội ngũ kỹ sư phần mềm chuyên nghiệp cung cấp các giải pháp công nghệ toàn diện. Hỗ trợ sinh viên công nghệ thông tin hoàn thiện đồ án chất lượng cao và chinh phục điểm số xuất sắc.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
            <a 
              href="https://zalo.me/0848290617" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-cute-candy"
              style={{ display: 'inline-flex', padding: '14px 28px', fontSize: '1.1rem', gap: '8px' }}
            >
              <MessageCircle size={20} />
              Zalo tư vấn ngay
            </a>

            {/* Phone + Copy */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              border: '2px solid var(--color-border)',
              borderRadius: '50px',
              padding: '12px 20px',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}>
              <MessageCircle size={18} style={{ color: 'var(--color-primary)' }} />
              <span>0848.290.617</span>
              <button
                onClick={handleCopy}
                title="Sao chép số điện thoại"
                style={{
                  background: copied ? '#22c55e' : 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? <><Check size={14} /> Đã sao chép!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)' }}>Các Dịch Vụ Cung Cấp</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {services.map((service, index) => (
              <div key={index} className="card" style={{ 
                animation: `fadeInUp 0.6s ease ${index * 0.15}s forwards`, 
                opacity: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div style={{ 
                  width: '60px', height: '60px', 
                  background: 'var(--color-surface)', 
                  borderRadius: '16px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--color-border)'
                }}>
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--color-text)' }}>{service.title}</h3>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 1.6, margin: 0 }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us / Trust Section */}
      <section style={{ padding: '60px 0', background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div style={{ 
            background: 'var(--color-surface)', 
            border: '1px solid var(--color-border)',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'row',
            gap: '40px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Users size={32} className="text-primary" />
                <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--color-text)' }}>Về Chúng Tôi</h2>
              </div>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: '20px' }}>
                Chúng tôi là những lập trình viên, kỹ sư phần mềm xuất thân từ các trường đại học top đầu về Công Nghệ Thông Tin tại Việt Nam. Với kinh nghiệm thực chiến từ nhiều dự án lớn, chúng tôi hiểu rõ sinh viên cần gì để đạt điểm cao và doanh nghiệp cần gì để hệ thống vận hành trơn tru.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)' }}>
                  <ShieldCheck size={20} className="text-primary" /> Bảo mật thông tin tuyệt đối 100%
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)' }}>
                  <Zap size={20} className="text-primary" /> Bàn giao đúng deadline, hỗ trợ tận tình
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)' }}>
                  <Code size={20} className="text-primary" /> Code chuẩn, sạch, dễ dàng đọc hiểu và bảo trì
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
