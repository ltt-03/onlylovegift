import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { X, Check } from 'lucide-react';

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
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
      backgroundColor: '#000',
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
        <span style={{ fontWeight: 'bold' }}>Cắt ảnh (1:1)</span>
        <button 
          onClick={handleCrop}
          disabled={isProcessing}
          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: isProcessing ? 0.5 : 1 }}
        >
          <Check size={20} /> Xong
        </button>
      </div>

      <div style={{ position: 'relative', flex: 1, backgroundColor: '#000' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1} // Force square crop
          onCropChange={setCrop}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
          style={{ containerStyle: { background: '#000' } }}
        />
      </div>

      <div style={{ padding: '20px', backgroundColor: '#111' }}>
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(e.target.value)}
          style={{ width: '100%', accentColor: 'var(--color-primary)' }}
        />
        <div style={{ textAlign: 'center', color: '#888', fontSize: '13px', marginTop: '10px' }}>
          Dùng hai ngón tay hoặc thanh trượt để phóng to
        </div>
      </div>
    </div>
  );
}
