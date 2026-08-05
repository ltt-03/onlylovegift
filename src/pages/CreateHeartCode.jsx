import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { X, Music, ImagePlus, CheckCircle2, Eye } from 'lucide-react';


const MAX_IMAGES = 1;

export default function CreateHeartCode() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, api } = useContext(AuthContext);
  const [showPreview, setShowPreview] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('pendingOrderData');
    if (saved) return JSON.parse(saved);
    return {
      senderName: searchParams.get('senderName') || '',
      receiverName: searchParams.get('receiverName') || '',
      message: searchParams.get('message') || '',
      musicUrl: searchParams.get('musicUrl') || ''
    };
  });

  const [images, setImages] = useState([]);
  const [musicFile, setMusicFile] = useState(null);

  const imageInputRef = useRef(null);
  const musicInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const processFiles = (files) => {
    const allowed = 1 - images.length;
    if (files.length === 0) return;
    if (allowed <= 0) { alert('Bạn chỉ được tải 1 ảnh lên cho mẫu này.'); return; }
    const toAdd = files.slice(0, allowed);
    setImages(prev => [...prev, ...toAdd]);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleImagesChange = (e) => {
    processFiles(Array.from(e.target.files || []));
  };

  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (!user) return alert('Vui lòng đăng nhập để tải ảnh lên');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    processFiles(files);
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleMusicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('audio/')) { alert('Vui lòng chọn file nhạc định dạng MP3, WAV, ...'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('File nhạc tối đa 10MB.'); return; }
    setMusicFile(file);
  };

  const removeMusicFile = () => {
    setMusicFile(null);
    setFormData(f => ({ ...f, musicUrl: '' }));
    if (musicInputRef.current) musicInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      sessionStorage.setItem('pendingOrderData', JSON.stringify(formData));
      sessionStorage.setItem('pendingOrderTemplate', 'heart-code');
      alert('Bạn cần đăng nhập để tiếp tục. Thông tin đã được lưu tạm!');
      navigate('/login?returnUrl=/create/heart-code');
      return;
    }

    setIsSubmitting(true);
    try {
      sessionStorage.removeItem('pendingOrderData');
      sessionStorage.removeItem('pendingOrderTemplate');
      const submitData = new FormData();
      submitData.append('templateId', 'heart-code');
      submitData.append('senderName', formData.senderName);
      submitData.append('receiverName', formData.receiverName);
      submitData.append('message', formData.message); // Will be mapped to copyright
      submitData.append('musicUrl', formData.musicUrl);
      images.forEach(img => submitData.append('images', img));
      if (musicFile) submitData.append('musicFile', musicFile);

      const response = await api.post('/orders', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (response.data.success) {
        navigate('/checkout?orderCode=' + response.data.order.orderCode);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login?returnUrl=/create/heart-code');
      } else {
        alert('Không thể kết nối đến máy chủ. (Bạn đã chạy backend chưa?)');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '1200px' }}>
      <div className="create-page-grid">
        {/* Form bên trái */}
        <div className="card">
          <button 
            onClick={() => navigate('/templates')} 
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
          >
            <span style={{ fontSize: '1.2rem' }}>←</span> Quay lại
          </button>

          <h1 style={{ fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>❤️</span>
            Tạo Trái Tim Mã Nguồn
          </h1>
          
          <div style={{ background: 'rgba(156,66,94,0.1)', border: '1px solid rgba(156,66,94,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '28px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '4px' }}>Ảnh của bạn sẽ được hiển thị ở trung tâm trái tim!</strong>
              Chỉ cần tải lên 1 ảnh đẹp nhất. Nếu không tải, hệ thống sẽ dùng ảnh mặc định.
              Bạn cũng có thể thay đổi lời chúc ở góc dưới và nhạc nền.
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label>Tên người nhận (để quản lý đơn) <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                name="receiverName"
                value={formData.receiverName}
                onChange={handleChange}
                className="input-field"
                placeholder="VD: Crush của tôi ❤️"
                required
              />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label>Dòng chữ lời chúc (hiện ở góc dưới màn hình) — Tùy chọn</label>
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="input-field"
                placeholder="VD: Happy Birthday! Chúc mừng sinh nhật..."
              />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label>
                Ảnh hiển thị bên trong trái tim ({images.length}/1)
              </label>
              <div 
                style={{
                  border: '2px dashed var(--color-border)',
                  borderRadius: '12px',
                  padding: '28px',
                  textAlign: 'center',
                  backgroundColor: isDragging ? 'var(--color-surface)' : 'transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => { if(user) imageInputRef.current?.click(); else alert('Đăng nhập để tải ảnh') }}
              >
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  ref={imageInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleImagesChange}
                />
                <ImagePlus size={36} color="var(--color-text-light)" style={{ marginBottom: '8px' }} />
                <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>Kéo thả hoặc Click để tải ảnh lên</p>
                <p style={{ fontSize: '0.82rem', marginTop: '6px', color: 'var(--color-text-light)' }}>Chỉ hỗ trợ 1 ảnh (JPEG, PNG). Tối đa 5MB.</p>
              </div>

              {images.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                      <img src={URL.createObjectURL(img)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                        style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label>Tải nhạc lên (MP3, WAV) - Tùy chọn</label>
              {!musicFile ? (
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: '1px solid var(--color-border)', borderRadius: '10px', cursor: 'pointer' }}
                  onClick={() => musicInputRef.current?.click()}
                >
                  <Music size={20} color="var(--color-text-light)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Chọn file nhạc MP3</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Mặc định: Nhạc Falling You lãng mạn có sẵn • Tối đa 10MB</div>
                  </div>
                  <input type="file" accept="audio/*" ref={musicInputRef} style={{ display: 'none' }} onChange={handleMusicChange} />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 15px', background: 'var(--color-surface)', borderRadius: '10px', border: '1px solid var(--color-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={20} color="var(--color-primary)" />
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{musicFile.name}</span>
                  </div>
                  <button type="button" onClick={removeMusicFile} style={{ background: 'transparent', border: 'none', color: '#ff4d4f', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                style={{
                  flex: '0 0 auto',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '14px 20px',
                  background: 'transparent',
                  border: '1px solid var(--color-primary)',
                  color: 'var(--color-primary)',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,107,157,0.08)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Eye size={18} /> Xem Trước
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ flex: 1, padding: '14px', fontSize: '1rem' }}>
                {isSubmitting ? 'Đang xử lý...' : 'Tiếp tục Thanh Toán'}
              </button>
            </div>
          </form>
        </div>

        {/* Demo bên phải - ẩn trên mobile, dùng nút Xem Trước thay thế */}
        <div className="create-preview-panel">
          <div className="card" style={{ padding: 0, overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column', position: 'sticky', top: '100px' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', fontWeight: 600, fontSize: '0.9rem' }}>
              Xem Trước Giao Diện
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <SecurePreviewInline templateId="heart-code" />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowPreview(false)}
        >
          <div
            style={{
              width: '100%', maxWidth: '420px', height: '90vh', maxHeight: '820px',
              borderRadius: '24px', overflow: 'hidden',
              position: 'relative',
              border: '2px solid rgba(255,107,157,0.3)',
              boxShadow: '0 0 60px rgba(255,107,157,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreview(false)}
              style={{
                position: 'absolute', top: '12px', right: '12px', zIndex: 10,
                background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff',
                borderRadius: '50%', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', backdropFilter: 'blur(8px)'
              }}
            >
              <X size={16} />
            </button>
            <SecurePreviewInline templateId="heart-code" />
          </div>
        </div>
      )}

      <style>{`
        .create-page-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 768px) {
          .create-page-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .create-preview-panel {
            display: none;
          }
          .container {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

// Inline preview without the heavy SecurePreview wrapper (no margin-top, no extra border)
function SecurePreviewInline({ templateId }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchToken = async () => {
    setLoading(true);
    setError(null);
    setToken(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/demo/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId })
      });
      const data = await res.json();
      if (data.success && data.token) setToken(data.token);
      else setError(data.message || 'Lỗi lấy mã xem trước');
    } catch (err) {
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchToken(); }, [templateId]);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const iframeUrl = token ? `${apiUrl}/demo/secure/${token}` : '';

  if (loading) return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d', color: '#888', gap: '10px' }}>
      <span style={{ fontSize: '1.5rem' }}>❤️</span>
      <span style={{ fontSize: '0.85rem' }}>Đang tải xem trước...</span>
    </div>
  );

  if (error) return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0d0d0d', color: '#fa5252', gap: '10px' }}>
      <p style={{ fontSize: '0.85rem' }}>Lỗi: {error}</p>
      <button onClick={fetchToken} style={{ padding: '6px 14px', background: '#fa5252', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Thử lại</button>
    </div>
  );

  return (
    <iframe
      src={iframeUrl}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block', background: '#020912' }}
      title="Heart Code Preview"
      allow="autoplay"
    />
  );
}
