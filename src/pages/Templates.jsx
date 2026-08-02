import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, X } from 'lucide-react';

const dummyTemplates = [
  {
    id: 'love-box-01',
    name: 'Harumi Love Box',
    description: 'Hộp quà tình yêu lãng mạn với hiệu ứng mở hộp bất ngờ và trái tim bay.',
    price: '99,000đ',
    image: 'https://images.unsplash.com/photo-1518192161699-494f186358db?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Using Rick Roll as placeholder demo video
  },
  {
    id: 'anni-box-02',
    name: 'Anniversary Memories',
    description: 'Trang web kỷ niệm ngày yêu với timeline hình ảnh tuyệt đẹp.',
    price: '149,000đ',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'crush-confess-03',
    name: 'Crush Confession',
    description: 'Giao diện tỏ tình dễ thương, đảm bảo tỷ lệ thành công 99%.',
    price: '79,000đ',
    image: 'https://images.unsplash.com/photo-1581022295087-35e59dce04a0?q=80&w=600&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

export default function Templates() {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);

  const handleSelect = (templateId) => {
    navigate(`/create?template=${templateId}`);
  };

  return (
    <div className="container" style={{ padding: '60px 24px', position: 'relative' }}>
      <h1 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Kho Giao Diện Quà Tặng</h1>
      <p className="text-center text-light" style={{ marginBottom: '50px' }}>Chọn một mẫu để bắt đầu tạo món quà bất ngờ cho người ấy.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {dummyTemplates.map(template => (
          <div key={template.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={template.image} 
                alt={template.name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
              />
              <button
                onClick={() => setActiveVideo(template.videoUrl)}
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--color-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer'
                }}
              >
                <PlayCircle size={16} />
                Hướng dẫn
              </button>
            </div>
            
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{template.name}</h3>
                <span style={{ fontWeight: 'bold', color: 'var(--color-primary)', background: 'var(--color-border)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
                  {template.price}
                </span>
              </div>
              <p className="text-light" style={{ marginBottom: '24px', flex: 1 }}>{template.description}</p>
              <button 
                onClick={() => handleSelect(template.id)}
                className="btn btn-primary" 
                style={{ width: '100%' }}
              >
                Tạo Với Mẫu Này
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setActiveVideo(null)}
        >
          <div 
            style={{ width: '80%', maxWidth: '800px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on video container
          >
            <button 
              onClick={() => setActiveVideo(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <X size={32} />
            </button>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                src={activeVideo} 
                title="Video Hướng Dẫn"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
