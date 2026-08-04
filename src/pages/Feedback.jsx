import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Star, MessageCircle, Send } from 'lucide-react';

export default function Feedback() {
  const { user, api } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get('/feedbacks');
      if (res.data.success) {
        setFeedbacks(res.data.feedbacks);
      }
    } catch (err) {
      console.error('Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return alert('Vui lòng nhập nội dung đánh giá');
    
    setIsSubmitting(true);
    try {
      const res = await api.post('/feedbacks', { rating, message });
      if (res.data.success) {
        setMessage('');
        setRating(5);
        fetchFeedbacks(); // Refresh list
        alert('Cảm ơn bạn! Đánh giá của bạn đã được ghi nhận.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', background: 'linear-gradient(45deg, var(--color-primary), #ff8a65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Cảm Nhận Khách Hàng</h1>
        <p className="text-light">Những lời yêu thương từ khách hàng đã trải nghiệm Only Love Gift</p>
      </div>

      {/* Form Đánh Giá */}
      <div className="card" style={{ padding: '30px', marginBottom: '40px', background: 'rgba(255,255,255,0.03)' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageCircle size={24} color="var(--color-primary)" />
          Gửi đánh giá của bạn
        </h3>
        
        {!user ? (
          <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
            <p style={{ marginBottom: '15px' }}>Vui lòng đăng nhập để gửi đánh giá</p>
            <Link to="/login?returnUrl=/feedback" className="btn btn-primary" style={{ display: 'inline-block' }}>Đăng Nhập Ngay</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Mức độ hài lòng</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    size={32} 
                    fill={(hoveredStar || rating) >= star ? '#f1c40f' : 'transparent'}
                    color={(hoveredStar || rating) >= star ? '#f1c40f' : 'var(--color-text-light)'}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Nội dung đánh giá</label>
              <textarea 
                className="form-control"
                rows="4"
                placeholder="Chia sẻ trải nghiệm của bạn với Only Love Gift..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {isSubmitting ? 'Đang gửi...' : <><Send size={18} /> Gửi Đánh Giá</>}
            </button>
          </form>
        )}
      </div>

      {/* Danh Sách Đánh Giá */}
      <div>
        <h3 style={{ marginBottom: '20px' }}>Đánh giá gần đây ({feedbacks.length})</h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải đánh giá...</div>
        ) : feedbacks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            <p className="text-light">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {feedbacks.map((fb) => (
              <div key={fb.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--color-primary), #ff8a65)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                    {fb.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{fb.name}</h4>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} fill={fb.rating >= star ? '#f1c40f' : 'transparent'} color={fb.rating >= star ? '#f1c40f' : 'var(--color-border)'} />
                      ))}
                    </div>
                  </div>
                </div>
                <p style={{ margin: '0', flexGrow: 1, lineHeight: '1.6', fontStyle: 'italic', color: 'var(--color-text-light)' }}>
                  "{fb.message}"
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-border)', marginTop: '15px', textAlign: 'right' }}>
                  {new Date(fb.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
