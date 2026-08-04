import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, X } from 'lucide-react';

export const dummyTemplates = [
  {
    id: 'love-box-01',
    name: 'Hộp Quà Sinh Nhật 3D',
    description: 'Hộp quà sinh nhật độc đáo với hiệu ứng mở hộp bất ngờ, thiệp chúc mừng và bóng bay. Tùy chỉnh tên, ảnh và lời chúc dễ dàng.',
    price: '49,000đ',
    discountPrice: '29,000đ',
    discountPercent: '-41%',
    discountLabel: 'Chỉ áp dụng cho lần đầu!',
    image: '/images/love-box-01.jpeg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    baseCount: 34,
    lastUpdated: '12/12/2025 14:30'
  },
  {
    id: 'x-mas-tree',
    name: 'Cây Thông Noel 3D',
    description: 'Mẫu cây thông Noel 3D tuyệt đẹp với lời chúc bay lượn và nhạc nền giáng sinh sôi động. Món quà độc đáo mùa lễ hội.',
    price: 'Miễn phí',
    discountPrice: null,
    discountPercent: null,
    discountLabel: 'Tặng bạn!',
    image: '/images/x-mas-tree.jpg',
    videoUrl: null,
    baseCount: 15,
  },
  {
    id: 'gift-surprise-v2',
    name: 'Bông Hoa 8/3 Bất Ngờ',
    description: 'Món quà 8/3 với hiệu ứng bông hoa nở, màn hình khóa bằng mật khẩu đặc biệt và thư tình lãng mạn. Tùy chỉnh ảnh, nhạc và lời chúc.',
    price: '79,000đ',
    discountPrice: '49,000đ',
    discountPercent: '-38%',
    discountLabel: 'Dành cho phái đẹp!',
    image: '/images/love-box-01.jpeg',
    videoUrl: null,
    baseCount: 8,
  },
  {
    id: 'love-gift-3d',
    name: 'Trái Tim 3D Tình Yêu',
    description: 'Trái tim 3D lãng mạn bay bổng, hiển thị ảnh kỉ niệm và lời chúc. Tùy chỉnh ảnh, nhạc và thông điệp dài.',
    price: '99,000đ',
    discountPrice: '59,000đ',
    discountPercent: '-40%',
    discountLabel: 'Mới nhất!',
    image: '/images/love-box-01.jpeg',
    videoUrl: null,
    baseCount: 5,
    lastUpdated: '03/08/2026 12:00'
  },
  {
    id: 'lucky-chance',
    name: 'Cỏ 4 Lá May Mắn',
    description: 'Trang trí cỏ 4 lá may mắn với lời chúc động viên bay lượn và nhạc nền nhẹ nhàng.',
    price: '59,000đ',
    discountPrice: '39,000đ',
    discountPercent: '-33%',
    discountLabel: 'Gửi may mắn!',
    image: '/images/love-box-01.jpeg',
    videoUrl: null,
    baseCount: 7,
  },
  {
    id: 'merry-christmas',
    name: 'Thư Giáng Sinh',
    description: 'Bức thư gửi gắm yêu thương đêm Giáng Sinh với lời chúc ý nghĩa, kèm nhạc lãng mạn và hiệu ứng tuyết rơi tuyệt đẹp.',
    price: 'Miễn phí',
    discountPrice: null,
    discountPercent: null,
    discountLabel: 'Tặng bạn!',
    image: '/images/merry-christmas.jpg',
    videoUrl: null,
    baseCount: 15,
  },
  {
    id: 'christmas',
    name: 'Thiệp Giáng Sinh Động',
    description: 'Thiệp Giáng Sinh 3D có cây thông, hiệu ứng lung linh. Lời chúc hiện ra như phép màu.',
    price: 'Miễn phí',
    discountPrice: null,
    discountPercent: null,
    discountLabel: 'Tặng bạn!',
    image: '/images/christmas.jpg',
    videoUrl: null,
    baseCount: 10,
  }
];


export default function Templates() {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/templates/stats`);
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (e) {
        console.error('Failed to fetch template stats', e);
      }
    };
    fetchStats();
  }, []);

  const getTemplateStats = (template) => {
    const realCount = stats[template.id] || 0;
    return (template.baseCount || 0) + realCount;
  };

  const handlePreview = (templateId) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.open(`${apiUrl}/demo/${templateId}`, '_blank');
  };

  const handleSelect = (templateId) => {
    if (templateId === 'x-mas-tree') {
      navigate(`/create/x-mas-tree`);
    } else if (templateId === 'merry-christmas') {
      navigate(`/create/merry-christmas`);
    } else if (templateId === 'christmas') {
      navigate(`/create/christmas`);
    } else if (templateId === 'gift-surprise-v2') {
      navigate(`/create/gift-surprise-v2`);
    } else if (templateId === 'love-gift-3d') {
      navigate(`/create/love-gift-3d`);
    } else if (templateId === 'lucky-chance') {
      navigate(`/create/lucky-chance`);
    } else {
      navigate(`/create?template=${templateId}`);
    }
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {template.discountPrice && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                        {template.price}
                      </span>
                    )}
                    <span style={{ fontWeight: 'bold', color: 'var(--color-primary)', background: 'var(--color-border)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
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
              <p className="text-light" style={{ marginBottom: '15px', flex: 1 }}>{template.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🔄 {template.lastUpdated}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', color: '#f59e0b' }}>🔥 {getTemplateStats(template)} lượt tạo</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handlePreview(template.id)}
                  className="btn btn-outline" 
                  style={{ flex: 1, padding: '10px 0', fontSize: '0.95rem' }}
                >
                  <div>Xem Demo</div>
                  {template.id === 'gift-surprise-v2' && <div style={{fontSize: '0.75rem', marginTop: '2px', opacity: 0.8}}>(mã khoá 0803)</div>}
                </button>
                <button 
                  onClick={() => handleSelect(template.id)}
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '10px 0', fontSize: '0.95rem' }}
                >
                  Tạo Quà
                </button>
              </div>
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
