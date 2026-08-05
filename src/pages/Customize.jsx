import { useState, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import ImageCropper from '../components/ImageCropper';

export default function Customize() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template') || 'love-box-01';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('pendingOrderData');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      senderName: searchParams.get('senderName') || '',
      receiverName: searchParams.get('receiverName') || '',
      birthday: searchParams.get('birthday') || '',
      message: searchParams.get('message') || '',
      musicUrl: searchParams.get('musicUrl') || ''
    };
  });

  const [images, setImages] = useState([]);
  const [currentImageToCrop, setCurrentImageToCrop] = useState(null);
  const fileInputRef = useRef(null);

  const { user, api } = useContext(AuthContext);
  const isAutoFill = searchParams.get('autoFill') === 'true';

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'birthday') {
      // Chỉ cho phép nhập số và ký tự / hoặc -
      value = value.replace(/[^0-9/-]/g, '');
    }
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    processFiles(files);
  };

  const processFiles = (files) => {
    const allowed = 4 - images.length;
    if (allowed <= 0) {
      alert('Bạn chỉ được tải lên tối đa 4 ảnh.');
      return;
    }
    const toAdd = files.slice(0, allowed);
    if (files.length > allowed) alert('Chỉ thêm được ' + allowed + ' ảnh nữa. Các ảnh thừa đã bị bỏ qua.');

    if (toAdd.length === 1) {
      const imageUrl = URL.createObjectURL(toAdd[0]);
      setCurrentImageToCrop(imageUrl);
    } else {
      setImages(prev => [...prev, ...toAdd]);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const handleCropComplete = (croppedFile) => {
    setImages(prev => [...prev, croppedFile]);
    setCurrentImageToCrop(null);
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      sessionStorage.setItem('pendingOrderData', JSON.stringify(formData));
      sessionStorage.setItem('pendingOrderTemplate', templateId);
      alert('Bạn cần đăng nhập để tiếp tục tạo và thanh toán đơn hàng. Chúng tôi đã lưu tạm thông tin văn bản của bạn!');
      navigate('/login?returnUrl=/create');
      return;
    }

    if (images.length > 0 && images.length !== 4) {
      alert('Vui lòng tải lên đủ 4 ảnh để hiệu ứng xoay 3D được đẹp nhất, hoặc xoá hết ảnh để dùng ảnh mặc định.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      sessionStorage.removeItem('pendingOrderData');
      sessionStorage.removeItem('pendingOrderTemplate');

      // Create FormData to handle file uploads
      const submitData = new FormData();
      Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
      submitData.append('templateId', templateId);
      images.forEach(image => submitData.append('images', image));

      const response = await api.post('/orders', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const data = response.data;
      if (data.success) {
        navigate(`/checkout?orderCode=${data.order.orderCode}`);
      } else {
        alert('Có lỗi xảy ra khi tạo đơn hàng.');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login?returnUrl=/create');
      } else {
        alert('Không thể kết nối đến máy chủ. (Bạn đã chạy backend chưa?)');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
      <div className="card" style={{ padding: '40px' }}>
        {/* Back button */}
        <button 
          onClick={() => navigate('/templates')} 
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
        >
          <span style={{ fontSize: '1.2rem' }}>←</span> Quay lại
        </button>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Tùy Chỉnh Quà Tặng</h1>
        
        {isAutoFill ? (
          <div style={{ padding: '16px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '8px', marginBottom: '20px', border: '1px solid #c8e6c9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <p style={{ margin: 0 }}>AI đã điền sẵn thông tin theo yêu cầu của bạn. Hãy kiểm tra lại và nhấn Tiếp Tục nhé!</p>
          </div>
        ) : (
          <p className="text-light" style={{ marginBottom: '30px' }}>Bạn đang tùy chỉnh mẫu: <strong className="text-primary">{templateId}</strong></p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2col-inputs">
            <div className="input-group">
              <label htmlFor="senderName">Tên người gửi (Bạn)</label>
              <input 
                type="text" 
                id="senderName" 
                name="senderName" 
                className="input-field" 
                placeholder="VD: Tuấn"
                value={formData.senderName}
                onChange={handleChange}
                maxLength={30}
                required 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="receiverName">Tên người nhận (Người ấy)</label>
              <input 
                type="text" 
                id="receiverName" 
                name="receiverName" 
                className="input-field" 
                placeholder="VD: Mai"
                value={formData.receiverName}
                onChange={handleChange}
                maxLength={30}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="birthday">Ngày sinh (Tùy chọn - Sẽ hiện hiệu ứng 3D)</label>
            <input 
              type="text" 
              id="birthday" 
              name="birthday" 
              className="input-field" 
              placeholder="VD: 20/10/2005"
              value={formData.birthday}
              onChange={handleChange}
              maxLength={15}
            />
          </div>

          <div className="input-group">
            <label htmlFor="message">Thông điệp yêu thương (Lời chúc sinh nhật)</label>
            <textarea 
              id="message" 
              name="message" 
              className="input-field" 
              placeholder="VD: Chúc mừng sinh nhật bé yêu, tuổi mới thêm nhiều niềm vui và luôn xinh đẹp nhé! 🎂❤"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              maxLength={250}
              required
            ></textarea>
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label htmlFor="musicUrl" style={{ margin: 0 }}>Link nhạc nền (Tùy chọn)</label>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, musicUrl: ''})}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '13px', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontWeight: 'bold' }}
              >
                Dùng nhạc mặc định
              </button>
            </div>
            <input 
              type="text" 
              id="musicUrl" 
              name="musicUrl" 
              className="input-field" 
              placeholder="VD: https://example.com/music.mp3"
              value={formData.musicUrl}
              onChange={handleChange}
            />
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-light)', marginTop: '8px', lineHeight: '1.5' }}>
              💡 <strong>Lưu ý:</strong> Hệ thống chỉ hỗ trợ link nhạc có đuôi <code>.mp3</code> (ví dụ link tải từ Dropbox, Zing MP3...). Các link YouTube/TikTok sẽ <strong>không</strong> hoạt động.<br/>
              <em>* Nếu bạn để trống hoặc dán sai định dạng, thiệp sẽ tự động dùng <strong>nhạc mặc định</strong> siêu dễ thương!</em>
            </p>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-surface)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text)', fontWeight: '500' }}>Nghe thử nhạc thiệp:</span>
              <audio 
                controls 
                src={formData.musicUrl || 'https://cdn.shopify.com/s/files/1/0757/9700/4572/files/tiktok-music-1774689772225-eucjr.mp3?v=1774689775'} 
                style={{ height: '30px', flex: 1, outline: 'none' }} 
              />
            </div>
          </div>

          {/* UPLOAD IMAGES SECTION */}
          <div className="input-group" style={{ marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Tải lên ảnh 3D (Tối đa 4 ảnh)
              {!user && <span style={{ fontSize: '12px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--color-surface)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}><AlertCircle size={14}/> Bạn cần đăng nhập để tải ảnh</span>}
            </label>
            
            <div 
              className="image-upload-grid"
              style={{ marginTop: '10px', padding: '15px', borderRadius: '12px', border: isDragging ? '2px dashed var(--color-primary)' : '2px dashed transparent', backgroundColor: isDragging ? 'rgba(255,107,157,0.05)' : 'transparent', transition: 'all 0.2s' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {images.map((image, index) => (
                <div key={index} style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--color-primary)' }}>
                  <img src={URL.createObjectURL(image)} alt={`preview-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)}
                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {images.length < 4 && (
                <div 
                  onClick={() => user ? fileInputRef.current.click() : alert('Vui lòng đăng nhập để tải ảnh lên')}
                  style={{ width: '100%', aspectRatio: '1', borderRadius: '12px', border: '2px dashed var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: user ? 'pointer' : 'not-allowed', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-light)', transition: 'all 0.2s ease' }}
                  onMouseOver={(e) => { if(user) { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'} }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-light)' }}
                >
                  <UploadCloud size={28} style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>Tải ảnh {images.length + 1}<br/>(hoặc Kéo thả)</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              multiple
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageChange}
            />
            <p style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '8px', fontStyle: 'italic' }}>* Tải đủ 4 ảnh để có khối lập phương 3D hoàn hảo nhất.</p>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Đang xử lý...' : 'Tiếp Tục Thanh Toán'}
            </button>
          </div>
        </form>
      </div>

      {currentImageToCrop && (
        <ImageCropper 
          imageSrc={currentImageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => setCurrentImageToCrop(null)}
        />
      )}
    </div>
  );
}
