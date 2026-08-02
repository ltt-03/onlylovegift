import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Customize() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template') || 'love-box-01';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    senderName: searchParams.get('senderName') || '',
    receiverName: searchParams.get('receiverName') || '',
    message: searchParams.get('message') || '',
    musicUrl: searchParams.get('musicUrl') || ''
  });

  const isAutoFill = searchParams.get('autoFill') === 'true';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, templateId })
      });
      
      const data = await response.json();
      if (data.success) {
        navigate(`/checkout?orderCode=${data.order.orderCode}`);
      } else {
        alert('Có lỗi xảy ra khi tạo đơn hàng.');
      }
    } catch (error) {
      console.error(error);
      alert('Không thể kết nối đến máy chủ. (Bạn đã chạy backend chưa?)');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
      <div className="card" style={{ padding: '40px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
                placeholder="VD: Lan"
                value={formData.receiverName}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="message">Thông điệp yêu thương</label>
            <textarea 
              id="message" 
              name="message" 
              className="input-field" 
              placeholder="Viết những lời ngọt ngào nhất bạn muốn gửi gắm..."
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="input-group">
            <label htmlFor="musicUrl">Link nhạc nền (YouTube URL - Tùy chọn)</label>
            <input 
              type="text" 
              id="musicUrl" 
              name="musicUrl" 
              className="input-field" 
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.musicUrl}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Đang xử lý...' : 'Tiếp Tục Thanh Toán'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
