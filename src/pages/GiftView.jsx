import React from 'react';
import { useParams } from 'react-router-dom';

export default function GiftView() {
  const { orderCode, slug } = useParams();
  
  // Trích xuất mã đơn hàng từ slug (nếu dùng URL mới)
  let actualOrderCode = orderCode;
  if (slug) {
    const match = slug.match(/(GL-\d{4,6})$/i);
    actualOrderCode = match ? match[1] : slug;
  }
  
  // URL của Backend (Render) sẽ trả về HTML trực tiếp
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const iframeSrc = `${backendUrl}/gift/render/${actualOrderCode}`;

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', background: '#000' }}>
      <iframe 
        src={iframeSrc} 
        style={{ width: '100%', height: '100%', border: 'none', margin: 0, padding: 0, display: 'block' }}
        title="Quà Tặng Của Bạn"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
