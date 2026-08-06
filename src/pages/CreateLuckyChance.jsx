import { useState, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, X, ImagePlus, CheckCircle2 } from 'lucide-react';
import SecurePreview from '../components/SecurePreview';
import SEO from '../components/SEO';

const MAX_IMAGES = 6;

export default function CreateLuckyChance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, api, openAuthModal, startProgress, updateProgress, finishProgress, closeProgress } = useContext(AuthContext);

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('pendingOrderData');
    if (saved) return JSON.parse(saved);
    return {
      senderName: searchParams.get('senderName') || '',
      receiverName: searchParams.get('receiverName') || '',
      musicUrl: searchParams.get('musicUrl') || ''
    };
  });

  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('pendingOrderData');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.message) return [...data.message.split('\n'), '', '', '', '', '', ''].slice(0, 6);
    }
    const initialMsg = searchParams.get('message');
    if (initialMsg) return [...initialMsg.split('\n'), '', '', '', '', '', ''].slice(0, 6);
    return ['', '', '', '', '', ''];
  });

  const [images, setImages] = useState([]);
  const [musicFile, setMusicFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef(null);
  const musicInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMessageChange = (index, value) => {
    const newMessages = [...messages];
    newMessages[index] = value;
    setMessages(newMessages);
  };

  const processFiles = (files) => {
    const allowed = MAX_IMAGES - images.length;
    if (files.length === 0) return;
    if (allowed <= 0) { alert(`Bạn đã tải đủ ${MAX_IMAGES} ảnh rồi.`); return; }
    const toAdd = files.slice(0, allowed);
    if (files.length > allowed) alert(`Chỉ thêm được ${allowed} ảnh nữa. Các ảnh thừa đã bị bỏ qua.`);
    setImages(prev => [...prev, ...toAdd]);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleImagesChange = (e) => {
    processFiles(Array.from(e.target.files || []));
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

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
      sessionStorage.setItem('pendingOrderData', JSON.stringify({
        ...formData,
        message: messages.filter(m => m.trim() !== '').join('\n')
      }));
      sessionStorage.setItem('pendingOrderTemplate', 'lucky-chance');
      alert('Bạn cần đăng nhập để tiếp tục. Thông tin đã được lưu tạm!');
      openAuthModal('login');
      return;
    }
    if (!formData.receiverName.trim()) { alert('Vui lòng nhập tên người nhận quà.'); return; }

    startProgress('Đang tạo vòng quay may mắn...');
    try {
      sessionStorage.removeItem('pendingOrderData');
      sessionStorage.removeItem('pendingOrderTemplate');
      const submitData = new FormData();
      submitData.append('templateId', 'lucky-chance');
      submitData.append('senderName', formData.senderName);
      submitData.append('receiverName', formData.receiverName);
      submitData.append('message', messages.filter(m => m.trim() !== '').join('\n'));
      submitData.append('musicUrl', formData.musicUrl);
      
      images.forEach(img => submitData.append('images', img));
      if (musicFile) submitData.append('musicFile', musicFile);

      const res = await api.post('/orders', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          updateProgress(percentCompleted, percentCompleted === 100 ? 'Đang xử lý dữ liệu...' : `Đang tải lên... ${percentCompleted}%`);
        }
      });
      if (res.data.success) {
        finishProgress('Tuyệt vời! Đang chuyển hướng sang thanh toán...');
        setTimeout(() => {
          closeProgress();
          navigate(`/checkout?orderCode=${res.data.order.orderCode}`);
        }, 1000);
      } else {
        closeProgress();
        alert(res.data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error(err);
      closeProgress();
      alert('Lỗi khi gửi yêu cầu tạo quà.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '860px' }}>
      <SEO
        title="Tạo Vòng Quay May Mắn Tặng Người Yêu Online Miễn Phí"
        description="Tạo vòng quay may mắn tình yêu online với nhạc nền nhẹ nhàng, gửi lời chúc may mắn đến bạn bè và người thân. Quà tặng ý nghĩa, thiệp online độc đáo chỉ 5 phút!"
        keywords="vòng quay may mắn, tạo vòng quay may mắn, thiệp online, quà tặng bạn bè, web tỏ tình, quà tặng ý nghĩa, only gift, onlylovegift, tạo website quà tặng"
        url="https://www.onlygift.online/tao-vong-quay-may-man"
      />
      <div className="card" style={{ padding: '40px' }}>

        <button 
          onClick={() => navigate('/templates')} 
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
        >
          <span style={{ fontSize: '1.2rem' }}>←</span> Quay lại
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '14px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '32px' }}>🍀</span>
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Cỏ 4 Lá May Mắn</h1>
            <p style={{ color: 'var(--color-text-light)', margin: '4px 0 0', fontSize: '0.95rem' }}>
              Mẫu cỏ 4 lá bay lượn với thông điệp động viên dễ thương.
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
            <label>Các lời chúc động viên</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '12px' }}>Các dòng chúc sẽ lần lượt xuất hiện. Hãy để trống các ô bạn không muốn dùng.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((msg, idx) => (
                <input
                  key={idx}
                  type="text"
                  className="input-field"
                  value={msg}
                  onChange={(e) => handleMessageChange(idx, e.target.value)}
                  placeholder={`Lời chúc thứ ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label>
              Ảnh may mắn (Tối đa {MAX_IMAGES})
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-light)', fontWeight: 'normal', marginTop: '4px' }}>
                Tải lên các hình ảnh. Khuyến nghị tỉ lệ vuông hoặc dọc để hiển thị đẹp nhất.
              </span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '10px', marginBottom: '14px', padding: '15px', borderRadius: '12px', border: '2px dashed transparent', transition: 'all 0.2s' }}>
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

        <SecurePreview templateId="lucky-chance" />
      </div>
    </div>
  );
}
