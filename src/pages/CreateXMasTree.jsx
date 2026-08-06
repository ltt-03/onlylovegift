import { useState, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, X, Music, TreePine, ImagePlus, CheckCircle2 } from 'lucide-react';
import SecurePreview from '../components/SecurePreview';

const MAX_IMAGES = 30;

export default function CreateXMasTree() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, api, openAuthModal, startProgress, updateProgress, finishProgress, closeProgress } = useContext(AuthContext);

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
    const allowed = MAX_IMAGES - images.length;
    if (files.length === 0) return;
    if (allowed <= 0) { alert('Bạn đã tải đủ 30 ảnh rồi.'); return; }
    const toAdd = files.slice(0, allowed);
    if (files.length > allowed) alert('Chỉ thêm được ' + allowed + ' ảnh nữa. Các ảnh thừa đã bị bỏ qua.');
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
      sessionStorage.setItem('pendingOrderTemplate', 'x-mas-tree');
      alert('Bạn cần đăng nhập để tiếp tục. Thông tin đã được lưu tạm!');
      openAuthModal('login');
      return;
    }
    if (!formData.receiverName.trim()) { alert('Vui lòng nhập tên người nhận quà.'); return; }

    startProgress('Đang tạo cây thông Noel 3D...');
    try {
      sessionStorage.removeItem('pendingOrderData');
      sessionStorage.removeItem('pendingOrderTemplate');
      const submitData = new FormData();
      submitData.append('templateId', 'xmas-tree');
      submitData.append('senderName', formData.senderName);
      submitData.append('receiverName', formData.receiverName);
      submitData.append('message', formData.message); 
      submitData.append('musicUrl', formData.musicUrl);
      images.forEach(img => submitData.append('images', img));
      if (musicFile) submitData.append('musicFile', musicFile);

      const response = await api.post('/orders', submitData, { 
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          updateProgress(percentCompleted, percentCompleted === 100 ? 'Đang xử lý dữ liệu...' : `Đang tải lên... ${percentCompleted}%`);
        }
      });
      if (response.data.success) {
        finishProgress('Tuyệt vời! Đang chuyển hướng sang thanh toán...');
        setTimeout(() => {
          closeProgress();
          navigate('/checkout?orderCode=' + response.data.order.orderCode);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      closeProgress();
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        openAuthModal('login');
      } else {
        alert('Không thể kết nối đến máy chủ. (Bạn đã chạy backend chưa?)');
      }
    } finally {
      setIsSubmitting(false); // fallback
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '860px' }}>
      <div className="card" style={{ padding: '40px' }}>

        {/* Back button */}
        <button 
          onClick={() => navigate('/templates')} 
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
        >
          <span style={{ fontSize: '1.2rem' }}>←</span> Quay lại
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a472a, #2d6a4f)', borderRadius: '14px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TreePine size={32} color="#a8e6cf" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Cây Thông Noel 3D Tương Tác</h1>
            <p style={{ color: 'var(--color-text-light)', margin: '4px 0 0', fontSize: '0.95rem' }}>
              Tùy chỉnh cây thông với ảnh của bạn & lời chúc riêng
            </p>
          </div>
        </div>

        {searchParams.get('autoFill') === 'true' && (
          <div style={{ padding: '16px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '8px', marginBottom: '20px', marginTop: '16px', border: '1px solid #c8e6c9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <div style={{ fontSize: '0.95rem' }}>Trợ lý AI đã tự động điền thông tin giúp bạn. Bạn có thể kiểm tra và tải thêm ảnh nhé!</div>
          </div>
        )}

        {/* Info banner */}
        <div style={{ background: 'rgba(26,71,42,0.1)', border: '1px solid rgba(45,106,79,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '32px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🎄</span>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '4px' }}>Ảnh của bạn sẽ xuất hiện trên các quả cầu trang trí cây thông!</strong>
            Tải lên từ 1 đến 30 ảnh. Nếu không tải ảnh, hệ thống sẽ dùng ảnh mẫu mặc định.
            Nhạc mặc định là bài Giáng Sinh lãng mạn — bạn có thể đổi bằng nhạc yêu thích.
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Names */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '24px' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label>Tên người nhận (để lưu đơn) <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" name="receiverName" value={formData.receiverName} onChange={handleChange}
                placeholder="VD: Chu Vận ❤️" className="input-field" required />
            </div>
          </div>

          {/* Heading message */}
          <div className="input-group" style={{ marginBottom: '32px' }}>
            <label>Lời chúc hiển thị trên cây thông</label>
            <input type="text" name="message" value={formData.message} onChange={handleChange}
              placeholder="VD: Merry Christmas Chu Vận ❄️ (mặc định: Merry Christmas)"
              className="input-field" maxLength={80} />
            <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '6px' }}>
              Dòng chữ này sẽ xuất hiện nổi bật ở trung tâm phía trên cây thông.
            </p>
          </div>

          {/* Image upload */}
          <div className="input-group" style={{ marginBottom: '32px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Ảnh trang trí quả cầu ({images.length}/{MAX_IMAGES})</span>
              {images.length === MAX_IMAGES && (
                <span style={{ color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> Đủ ảnh!
                </span>
              )}
            </label>

            <div 
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '10px', marginBottom: '14px', padding: '15px', borderRadius: '12px', border: isDragging ? '2px dashed var(--color-primary)' : '2px dashed transparent', backgroundColor: isDragging ? 'rgba(255,107,157,0.05)' : 'transparent', transition: 'all 0.2s' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--color-primary)' }}>
                  <img src={URL.createObjectURL(img)} alt={'anh-' + (idx + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '2px', left: '4px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '10px', fontWeight: 'bold', borderRadius: '4px', padding: '1px 4px' }}>{idx + 1}</div>
                  <button type="button" onClick={() => removeImage(idx)}
                    style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(0,0,0,0.65)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <div onClick={() => user ? imageInputRef.current.click() : alert('Vui lòng đăng nhập để tải ảnh lên')}
                  style={{ aspectRatio: '1', borderRadius: '10px', border: '2px dashed var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: user ? 'pointer' : 'not-allowed', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-light)', gap: '4px', transition: 'all 0.2s' }}
                  onMouseOver={e => { if (user) { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; } }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-light)'; }}>
                  <ImagePlus size={22} />
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>Thêm ảnh</span>
                </div>
              )}
            </div>

            <input type="file" accept="image/*" multiple ref={imageInputRef} style={{ display: 'none' }} onChange={handleImagesChange} />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => user ? imageInputRef.current.click() : alert('Vui lòng đăng nhập')}
                className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UploadCloud size={16} /> Chọn nhiều ảnh
              </button>
              {images.length > 0 && (
                <button type="button" onClick={() => setImages([])}
                  style={{ fontSize: '0.85rem', padding: '8px 14px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                  Xoá tất cả ảnh
                </button>
              )}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '8px', fontStyle: 'italic' }}>
              * Tối đa {MAX_IMAGES} ảnh. Bạn có thể chọn nhiều ảnh một lúc. Nếu không tải ảnh, hệ thống dùng ảnh mẫu mặc định.
            </p>
          </div>

          {/* Music upload */}
          <div className="input-group" style={{ marginBottom: '36px' }}>
            <label>Nhạc nền (tuỳ chọn)</label>
            {musicFile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px 16px' }}>
                <Music size={20} color="var(--color-primary)" />
                <span style={{ flex: 1, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{musicFile.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>({(musicFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                <button type="button" onClick={removeMusicFile} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex' }}><X size={16} /></button>
              </div>
            ) : (
              <div onClick={() => musicInputRef.current.click()}
                style={{ border: '2px dashed var(--color-border)', borderRadius: '10px', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'var(--color-text-light)', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-light)'; }}>
                <Music size={22} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Chọn file nhạc MP3</div>
                  <div style={{ fontSize: '0.8rem' }}>Mặc định: nhạc Giáng Sinh lãng mạn có sẵn • Tối đa 10MB</div>
                </div>
              </div>
            )}
            <input type="file" accept="audio/*" ref={musicInputRef} style={{ display: 'none' }} onChange={handleMusicChange} />
          </div>

          {/* Submit */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1.1rem', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {isSubmitting ? 'Đang xử lý...' : <><CheckCircle2 size={22} /> Tạo Quà Ngay</>}
            </button>
          </div>
        </form>

        <SecurePreview templateId="x-mas-tree" />
      </div>
    </div>
  );
}
