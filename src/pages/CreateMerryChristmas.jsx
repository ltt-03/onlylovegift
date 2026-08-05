import { useState, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, X, CheckCircle2 } from 'lucide-react';
import SecurePreview from '../components/SecurePreview';

export default function CreateMerryChristmas() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, api } = useContext(AuthContext);

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

  const [musicFile, setMusicFile] = useState(null);
  const musicInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMusicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('audio/')) { alert('Vui lòng chọn file nhạc định dạng âm thanh.'); return; }
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
      sessionStorage.setItem('pendingOrderTemplate', 'merry-christmas');
      alert('Bạn cần đăng nhập để tiếp tục. Thông tin đã được lưu tạm!');
      navigate('/login?returnUrl=/create/merry-christmas');
      return;
    }
    if (!formData.receiverName.trim()) { alert('Vui lòng nhập tên người nhận quà.'); return; }

    setIsSubmitting(true);
    try {
      sessionStorage.removeItem('pendingOrderData');
      sessionStorage.removeItem('pendingOrderTemplate');
      const submitData = new FormData();
      submitData.append('templateId', 'merry-christmas');
      submitData.append('senderName', formData.senderName);
      submitData.append('receiverName', formData.receiverName);
      submitData.append('message', formData.message);
      submitData.append('musicUrl', formData.musicUrl);
      
      if (musicFile) submitData.append('musicFile', musicFile);

      const res = await api.post('/api/orders', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        if (res.data.order.amount === 0) {
            navigate(`/success?orderCode=${res.data.order.orderCode}`);
        } else {
            navigate(`/checkout?orderCode=${res.data.order.orderCode}`);
        }
      } else {
        alert(res.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi gửi yêu cầu tạo quà.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '860px' }}>
      <div className="card" style={{ padding: '40px' }}>

        <button 
          onClick={() => navigate('/templates')} 
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
        >
          <span style={{ fontSize: '1.2rem' }}>←</span> Quay lại
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)', borderRadius: '14px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '32px' }}>🎅</span>
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Thư Giáng Sinh</h1>
            <p style={{ color: 'var(--color-text-light)', margin: '4px 0 0', fontSize: '0.95rem' }}>
              Mẫu thư mừng Giáng Sinh lãng mạn.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label>Tên người nhận (Bắt buộc) <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" className="input-field" name="receiverName" value={formData.receiverName} onChange={handleChange} placeholder="VD: Gửi emm" required />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label>Tên người gửi (Tùy chọn)</label>
              <input type="text" className="input-field" name="senderName" value={formData.senderName} onChange={handleChange} placeholder="VD: Người Giấu Tên" />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label>Nội dung thư</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '12px' }}>Nhập lời chúc Giáng Sinh của bạn. Xuống dòng tự nhiên.</p>
            <textarea
              className="input-field"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Chúc em một mùa giáng sinh an lành..."
              style={{ minHeight: '150px' }}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label>
              Nhạc nền (Tùy chọn)
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-light)', fontWeight: 'normal', marginTop: '4px' }}>
                Tải lên file mp3 hoặc điền link nhạc MP3 trực tiếp. Nếu để trống sẽ dùng nhạc mặc định.
              </span>
            </label>
            
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <input type="file" ref={musicInputRef} accept="audio/*" onChange={handleMusicChange} style={{ display: 'none' }} id="upload-music" />
              {!musicFile && (
                <>
                  <input type="text" className="input-field" name="musicUrl" value={formData.musicUrl} onChange={handleChange} placeholder="Link nhạc MP3 (https://...)" />
                  <button type="button" onClick={() => musicInputRef.current.click()} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px', justifyContent: 'center', alignSelf: 'flex-start' }}>
                    <UploadCloud size={18} /> Hoặc tải lên file MP3
                  </button>
                </>
              )}
              {musicFile && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-surface)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🎵 {musicFile.name}</span>
                  <button type="button" onClick={removeMusicFile} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={18} /></button>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : <><CheckCircle2 size={22} /> Tạo Quà Ngay</>}
          </button>
        </form>
        <SecurePreview templateId="merry-christmas" />
      </div>
    </div>
  );
}
