import React, { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImg } from '../utils/cropImage';
import { X, Check } from 'lucide-react';

const CROP_STYLES = `
  /* Hiện lại các thanh kéo ở 4 cạnh kể cả khi lock tỉ lệ vuông */
  .ReactCrop--fixed-aspect .ReactCrop__drag-bar,
  .ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-n,
  .ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-e,
  .ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-s,
  .ReactCrop--fixed-aspect .ReactCrop__drag-handle.ord-w {
      display: block !important;
  }
  @media (pointer:coarse){
    .ReactCrop .ord-n,.ReactCrop .ord-e,.ReactCrop .ord-s,.ReactCrop .ord-w{display:block !important;}
  }

  /* Tạo viền mỏng xung quanh */
  .ReactCrop__crop-selection {
    border: 1px solid rgba(255, 255, 255, 0.7);
  }

  /* Tạo 4 góc L (giống ảnh mẫu) */
  .ReactCrop__crop-selection::before {
    content: '';
    position: absolute;
    top: -2px; left: -2px; width: 20px; height: 20px;
    border-top: 3px solid #fff;
    border-left: 3px solid #fff;
  }
  .ReactCrop__crop-selection::after {
    content: '';
    position: absolute;
    top: -2px; right: -2px; width: 20px; height: 20px;
    border-top: 3px solid #fff;
    border-right: 3px solid #fff;
  }

  /* Pseudo elements cho 2 góc dưới */
  .ReactCrop__drag-handle.ord-sw::before {
    content: '';
    position: absolute;
    bottom: 2px; left: 2px; width: 20px; height: 20px;
    border-bottom: 3px solid #fff;
    border-left: 3px solid #fff;
    pointer-events: none;
  }
  .ReactCrop__drag-handle.ord-se::before {
    content: '';
    position: absolute;
    bottom: 2px; right: 2px; width: 20px; height: 20px;
    border-bottom: 3px solid #fff;
    border-right: 3px solid #fff;
    pointer-events: none;
  }

  /* Ẩn các cục tròn mặc định của react-image-crop */
  .ReactCrop__drag-handle {
    background-color: transparent !important;
    border: none !important;
  }
`;

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    // Default to a square crop in the center
    const size = Math.min(width, height) * 0.8;
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    
    setCrop({
      unit: 'px',
      x,
      y,
      width: size,
      height: size
    });
    setCompletedCrop({
      unit: 'px',
      x,
      y,
      width: size,
      height: size
    });
  }, []);

  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current) return;
    setIsProcessing(true);
    
    try {
      // Calculate real pixel crop based on natural image size
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      const pixelCrop = {
        x: completedCrop.x * scaleX,
        y: completedCrop.y * scaleY,
        width: completedCrop.width * scaleX,
        height: completedCrop.height * scaleY
      };

      const croppedFile = await getCroppedImg(imageSrc, pixelCrop);
      onCropComplete(croppedFile);
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra khi cắt ảnh!');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.95)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: '#111',
        color: '#fff',
        alignItems: 'center',
        zIndex: 10000
      }}>
        <button 
          onClick={onCancel}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <X size={20} /> Hủy
        </button>
        <span style={{ fontWeight: 'bold' }}>Kéo chọn khung ảnh (1:1)</span>
        <button 
          onClick={handleCrop}
          disabled={isProcessing}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: isProcessing ? 0.5 : 1 }}
        >
          <Check size={20} /> Xong
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'hidden' }}>
        <style>{CROP_STYLES}</style>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1}
          circularCrop={false}
          ruleOfThirds={true}
          style={{ maxHeight: '100%', maxWidth: '100%' }}
        >
          <img 
            src={imageSrc} 
            onLoad={onImageLoad} 
            alt="Crop me" 
            style={{ maxHeight: '80vh', maxWidth: '100vw', objectFit: 'contain' }}
          />
        </ReactCrop>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#111', textAlign: 'center', color: '#888', fontSize: '14px' }}>
        Kéo các góc viền sáng để phóng to/thu nhỏ khung cắt.<br/>
        Kéo vào giữa khung để di chuyển vùng ảnh cần lấy.
      </div>
    </div>
  );
}
