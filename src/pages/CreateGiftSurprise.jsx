import { useState, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, X, Music, Flower2, ImagePlus, CheckCircle2, Lock } from 'lucide-react';
import SecurePreview from '../components/SecurePreview';

const MAX_IMAGES = 20;

export default function CreateGiftSurprise() {
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
      passcode: searchParams.get('passcode') || '0803',
      musicUrl: searchParams.get('musicUrl') || ''
    };
  });

  const [images, setImages] = useState([]);
  const [passImage, setPassImage] = useState(null);
  const [musicFile, setMusicFile] = useState(null);

  const imageInputRef = useRef(null);
  const passImageInputRef = useRef(null);
  const musicInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handlePassImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPassImage(file);
    if (passImageInputRef.current) passImageInputRef.current.value = '';
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));
  const removePassImage = () => setPassImage(null);

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
      sessionStorage.setItem('pendingOrderTemplate', 'gift-surprise-v2');
      alert('Bạn cần đăng nhập để tiếp tục. Thông tin đã được lưu tạm!');
      navigate('/login?returnUrl=/create/gift-surprise-v2');
      return;
    }
    if (!formData.receiverName.trim()) { alert('Vui lòng nhập tên người nhận quà.'); return; }

    setIsSubmitting(true);
    try {
      sessionStorage.removeItem('pendingOrderData');
      sessionStorage.removeItem('pendingOrderTemplate');
      const submitData = new FormData();
      submitData.append('templateId', 'gift-surprise-v2');
      submitData.append('senderName', formData.senderName);
      submitData.append('receiverName', formData.receiverName);
      submitData.append('message', formData.message);
      submitData.append('passcode', formData.passcode);
      submitData.append('musicUrl', formData.musicUrl);
      
      images.forEach(img => submitData.append('images', img));
      if (passImage) submitData.append('passImage', passImage);
      if (musicFile) submitData.append('musicFile', musicFile);

      const response = await api.post('/orders', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const data = response.data;
      if (data.success) {
        navigate('/checkout?orderCode=' + data.order.orderCode);
      } else {
        alert('Có lỗi xảy ra khi tạo đơn hàng.');
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login?returnUrl=/create/gift-surprise-v2');
      } else {
        alert('Không thể kết nối đến máy chủ.');
      }
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{ background: 'linear-gradient(135deg, #ff758c, #ff7eb3)', borderRadius: '14px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flower2 size={32} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Bông Hoa 8/3 Bất Ngờ</h1>
            <p style={{ color: 'var(--color-text-light)', margin: '4px 0 0', fontSize: '0.95rem' }}>
              Tùy chỉnh món quà 8/3 lãng mạn với màn hình khóa và thư tình riêng
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(255,117,140,0.1)', border: '1px solid rgba(255,126,179,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '32px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '24px' }}>
          <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🌸</span>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '4px' }}>Món quà bao gồm màn hình khóa mật khẩu, bộ sưu tập ảnh và lá thư tình!</strong>
            Bạn có thể tải lên ảnh người ấy làm ảnh nền lúc mở khóa, kèm theo các hình ảnh kỷ niệm. Nhạc mặc định là những bản tình ca ngọt ngào — bạn có thể tự thêm nhạc riêng.
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid-2col-inputs" style={{ marginBottom: '24px' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label>Tên người gửi</label>
              <input type="text" name="senderName" value={formData.senderName} onChange={handleChange}
                placeholder="VD: Anh Yêu 💖" className="input-field" />
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label>Tên người nhận <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" name="receiverName" value={formData.receiverName} onChange={handleChange}
                placeholder="VD: Em Yêu ❤️" className="input-field" required />
            </div>
          </div>
          
          <div className="grid-2col-inputs" style={{ marginBottom: '24px' }}>
            <div className="input-group" style={{ margin: 0 }}>
              <label>Mật khẩu mở khóa (4 số)</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-light)' }} />
                <input type="text" name="passcode" value={formData.passcode} onChange={handleChange}
                  placeholder="VD: 0803" className="input-field" maxLength={4} pattern="[0-9]{4}" title="Vui lòng nhập 4 chữ số" style={{ paddingLeft: '38px' }} />
              </div>
            </div>
            <div className="input-group" style={{ margin: 0 }}>
              <label>Ảnh nền màn hình khóa</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => passImageInputRef.current?.click()} className="btn btn-outline" style={{ flex: 1, padding: '10px', fontSize: '0.9rem' }}>
                  {passImage ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                </button>
                {passImage && (
                  <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={URL.createObjectURL(passImage)} alt="pass-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={removePassImage} style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" ref={passImageInputRef} style={{ display: 'none' }} onChange={handlePassImageChange} />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '32px' }}>
            <label>Nội dung bức thư</label>
            <textarea name="message" value={formData.message} onChange={handleChange}
              placeholder="VD: Cảm ơn em đã đến bên anh..."
              className="input-field" rows="4" style={{ resize: 'vertical' }} />
            <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '6px' }}>
              Mỗi lần xuống dòng sẽ tạo ra một đoạn thư mới. Lời thư sẽ xuất hiện hiệu ứng gõ chữ từng dòng.
            </p>
          </div>

          <div className="input-group" style={{ marginBottom: '32px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Ảnh Kỷ Niệm (Gallery) ({images.length}/{MAX_IMAGES})</span>
              {images.length === MAX_IMAGES && (
                <span style={{ color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> Đủ ảnh!
                </span>
              )}
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
            <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '8px', fontStyle: 'italic' }}>
              * Tối đa {MAX_IMAGES} ảnh. Nếu không tải ảnh, hệ thống dùng ảnh mẫu mặc định.
            </p>
          </div>

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
                  <div style={{ fontSize: '0.8rem' }}>Mặc định: Các bản tình ca chọn lọc • Tối đa 10MB</div>
                </div>
              </div>
            )}
            <input type="file" accept="audio/*" ref={musicInputRef} style={{ display: 'none' }} onChange={handleMusicChange} />
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary"
              style={{ padding: '15px 44px', fontSize: '1.1rem', opacity: isSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isSubmitting ? 'Đang xử lý...' : <><Flower2 size={20} /> Tiếp Tục Thanh Toán</>}
            </button>
          </div>
        </form>
        <SecurePreview templateId="gift-surprise-v2" />
      </div>
    </div>
  );
}
