import React from 'react';
import { ExternalLink, Sparkles, BookOpen, Music, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function FreeProjects() {
  const projects = [
    {
      id: 'study-together-vibes',
      name: 'Study Together Vibes',
      description: 'Nền tảng "Study with me" giả lập không gian học tập hoàn hảo. Tích hợp nhạc Lofi cực chill, đồng hồ đếm ngược Pomodoro chuẩn khoa học giúp bạn tăng cường tối đa sự tập trung.',
      url: 'https://study-together-vibes.vercel.app/',
      tags: ['Lofi Music', 'Pomodoro', 'Productivity'],
      features: [
        { icon: <Music size={16} />, text: 'Nhạc Lofi thư giãn' },
        { icon: <Clock size={16} />, text: 'Đồng hồ Pomodoro' },
        { icon: <BookOpen size={16} />, text: 'Không gian học tập ảo' }
      ]
    }
  ];

  return (
    <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
      <SEO 
        title="Chia Sẻ Source Code Web Tỏ Tình & Tiện Ích Miễn Phí"
        description="Tổng hợp kho source code website tỏ tình, mã code trái tim đập cực hot hoàn toàn miễn phí. Hỗ trợ chạy trực tiếp không cần biết code."
      />
      <div style={{ textAlign: 'center', marginBottom: '50px', animation: 'fadeInDown 0.6s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
          <Sparkles className="text-primary" size={32} />
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
            Kho Code & Dự Án Miễn Phí
          </h1>
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto' }}>
          Khám phá hệ sinh thái các trang web và công cụ tiện ích được phát triển và cung cấp hoàn toàn miễn phí cho cộng đồng.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
        {projects.map((project, index) => (
          <div key={project.id} className="card" style={{ 
            padding: 0, 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column',
            animation: `fadeInUp 0.6s ease ${index * 0.1}s forwards`,
            opacity: 0,
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ height: '200px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
               <h2 style={{ color: '#fff', fontSize: '2rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)', textAlign: 'center', padding: '0 20px' }}>{project.name}</h2>
               <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--color-primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                 Miễn Phí
               </div>
            </div>
            
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.4rem', margin: '0 0 10px 0', color: 'var(--color-text)' }}>{project.name}</h3>
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.6, marginBottom: '20px', fontSize: '0.95rem' }}>
                {project.description}
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                {project.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text)', background: 'var(--color-surface)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                    {feat.icon} {feat.text}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(239, 68, 68, 0.4)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Truy cập ngay <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
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
