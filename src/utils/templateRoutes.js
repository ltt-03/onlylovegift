/**
 * NGUỒN SỰ THẬT DUY NHẤT cho routing template.
 *
 * Mỗi khi thêm template mới:
 *   1. Thêm entry vào TEMPLATE_ROUTES bên dưới
 *   2. Thêm Route tương ứng trong App.jsx
 *   3. KHÔNG cần sửa bất kỳ file nào khác (Home.jsx, Templates.jsx, AIChat.jsx, v.v.)
 */

/** Map templateId -> đường dẫn trang tạo riêng của nó */
export const TEMPLATE_ROUTES = {
  'heart-code':       '/create/heart-code',
  'love-gift-3d':     '/create/love-gift-3d',
  'lucky-chance':     '/create/lucky-chance',
  'x-mas-tree':       '/create/x-mas-tree',
  'gift-surprise-v2': '/create/gift-surprise-v2',
  'merry-christmas':  '/create/merry-christmas',
  'christmas':        '/create/christmas',
  // ↑ Thêm template mới vào đây — KHÔNG sửa file nào khác
};

/**
 * Trả về đường dẫn đúng của form tạo cho templateId.
 * Nếu template chưa có form riêng → fallback về /create?template=...
 * @param {string} templateId
 * @param {URLSearchParams|null} extraParams  — params bổ sung (autoFill, v.v.)
 * @returns {string}
 */
export function getCreateRoute(templateId, extraParams = null) {
  const base = TEMPLATE_ROUTES[templateId];
  if (base) {
    return extraParams ? `${base}?${extraParams.toString()}` : base;
  }
  // Fallback: form chung
  const params = extraParams ? new URLSearchParams(extraParams) : new URLSearchParams();
  params.set('template', templateId);
  return `/create?${params.toString()}`;
}
