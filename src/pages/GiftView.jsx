import React from 'react';
import { useParams } from 'react-router-dom';

export default function GiftView() {
  const { orderCode } = useParams();
  
  // URL của Backend (Render) sẽ trả về HTML trực tiếp
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const iframeSrc = `${backendUrl}/gift/render/${orderCode}`;

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', background: '#000' }}>
      <iframe 
        src={iframeSrc} 
        style={{ width: '100%', height: '100%', border: 'none', margin: 0, padding: 0, display: 'block' }}
        title="Quà Tặng Của Bạn"
        allow="autoplay; fullscreen; camera; microphone"
      />
    </div>
  );
}
