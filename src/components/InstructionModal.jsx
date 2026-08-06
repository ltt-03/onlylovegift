import React from 'react';
import { X, PlayCircle, Edit3, CreditCard, Send } from 'lucide-react';

export default function InstructionModal({ isOpen, onClose, templateName }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-bg)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          animation: 'modalSlideUp 0.3s ease forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: 'var(--color-bg)',
          zIndex: 10,
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
        }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-text)' }}>
            Hướng Dẫn: {templateName}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-light)',
              display: 'flex',
              padding: '4px',
              borderRadius: '50%'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '24px', lineHeight: '1.6' }}>
            Để tạo món quà <strong>{templateName}</strong> mang đậm dấu ấn cá nhân, bạn chỉ cần làm theo 4 bước vô cùng đơn giản sau:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlayCircle size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--color-text)' }}>Bước 1: Trải nghiệm thử</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.5' }}>
                  Bạn có thể nhấn vào nút xem thử (nếu có) hoặc xem video/ảnh mẫu để hình dung hiệu ứng tuyệt đẹp của sản phẩm.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Edit3 size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--color-text)' }}>Bước 2: Điền thông tin cá nhân</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.5' }}>
                  Nhấn nút <strong>"Tạo Quà Ngay"</strong> trên thẻ sản phẩm. Tại trang tạo mẫu, bạn hãy cung cấp Tên, Ảnh, Lời chúc, và bài Nhạc yêu thích.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--color-text)' }}>Bước 3: Tạo & Thanh toán</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.5' }}>
                  Sau khi điền đủ thông tin, nhấn tạo để hệ thống xử lý dữ liệu. Hệ thống sẽ chuyển bạn sang trang thanh toán siêu nhanh chóng với mã QR (hỗ trợ MOMO, VNPAY, MBBank...).
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--color-text)' }}>Bước 4: Nhận link & Trao gửi yêu thương</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: '1.5' }}>
                  Thanh toán thành công, hệ thống sẽ cấp cho bạn một đường link và mật khẩu bảo mật (nếu có). Hãy copy link đó gửi ngay cho nửa kia của bạn nhé!
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button 
              onClick={onClose}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
            >
              Đã hiểu, Bắt đầu tạo!
            </button>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes modalSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}
