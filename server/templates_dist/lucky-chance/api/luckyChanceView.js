/**
 * Lucky Chance API module
 * Được import bởi luckyChanceBoot.js để lấy dữ liệu đơn hàng từ server
 */

/**
 * Lấy orderCode từ URL hiện tại.
 * URL dạng: /gift/view/:orderCode  hoặc  /gift/render/:orderCode
 * @returns {string|null}
 */
export function getLuckyChanceIdFromUrl() {
  try {
    const parts = window.location.pathname.split('/').filter(Boolean);
    // URL: /gift/view/GL-1234 → parts = ['gift', 'view', 'GL-1234']
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart.length > 0) {
      return lastPart;
    }
    // Thử lấy từ query string: ?code=GL-1234
    const params = new URLSearchParams(window.location.search);
    return params.get('code') || params.get('orderCode') || null;
  } catch (_err) {
    return null;
  }
}

/**
 * Fetch dữ liệu đơn hàng từ server theo orderCode.
 * Trả về object { success, data, message }
 * @param {string} id - orderCode (ví dụ: GL-1234)
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
export async function fetchLuckyChanceById(id) {
  if (!id) {
    return { success: false, message: 'Thiếu mã đơn hàng' };
  }

  try {
    const apiBase = (typeof window !== 'undefined' && window.__API_BASE__)
      ? window.__API_BASE__
      : window.location.origin;

    const res = await fetch(`${apiBase}/api/orders/${encodeURIComponent(id)}`);
    if (!res.ok) {
      return { success: false, message: `HTTP ${res.status}` };
    }

    const json = await res.json();
    if (!json.success || !json.order) {
      return { success: false, message: json.message || 'Không tìm thấy đơn hàng' };
    }

    const order = json.order;

    // Parse images (có thể là JSON string hoặc array)
    let images = [];
    try {
      if (order.images) {
        images = typeof order.images === 'string'
          ? JSON.parse(order.images)
          : order.images;
      }
    } catch (_e) {
      images = [];
    }

    // Parse messages từ order.message (mỗi dòng là một tin nhắn)
    let messages = [];
    try {
      let rawMessage = order.message || '';
      // Nếu message là JSON (có passcode), lấy phần text
      if (rawMessage.trim().startsWith('{')) {
        const parsed = JSON.parse(rawMessage);
        rawMessage = parsed.text || '';
      }
      messages = rawMessage.split('\n').filter(m => m.trim() !== '');
    } catch (_e) {
      messages = [];
    }

    return {
      success: true,
      data: {
        recipientName: order.receiverName || '',
        senderName: order.senderName || '',
        messages,
        images,
        music: order.musicUrl || ''
      }
    };
  } catch (err) {
    return { success: false, message: err.message || 'Lỗi kết nối' };
  }
}
