export default async function handler(req, res) {
  try {
    const { code, slug } = req.query;
    
    let actualCode = code;
    if (slug) {
      const match = slug.match(/(GL-\d{4,6})$/i);
      actualCode = match ? match[1] : slug;
    }

    if (!actualCode) {
      return res.status(400).send('Missing code');
    }

    // Lấy URL backend từ biến môi trường
    const backendUrl = process.env.VITE_API_URL || 'https://only-love-gift.onrender.com';
    
    let title = 'Món Quà Bí Mật - OnlyLoveGift';
    let description = 'Bạn nhận được một món quà bí mật từ ai đó. Hãy mở ra để xem nhé! 🎁';
    let imageUrl = 'https://www.onlygift.online/og-banner.jpg'; // Ảnh mặc định

    try {
      // Gọi API của backend để lấy thông tin đơn hàng
      const apiUrl = `${backendUrl}/api/orders/${actualCode}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // timeout 5s
      
      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await response.json();

      if (data && data.success && data.order) {
        const order = data.order;
        const sender = order.senderName || 'Người Giấu Tên';
        const receiver = order.receiverName || 'Bạn';
        
        title = `🎁 Món Quà Từ ${sender} Gửi Tới ${receiver}`;
        description = `${receiver} ơi, bạn có một món quà đặc biệt từ ${sender}! Nhấn vào để xem điều bất ngờ nhé 💝`;
        
        // Nếu có ảnh trong đơn hàng, lấy ảnh đầu tiên làm thumbnail
        if (order.images) {
          try {
            const imagesArr = JSON.parse(order.images);
            if (Array.isArray(imagesArr) && imagesArr.length > 0) {
              let img = imagesArr[0];
              if (img.startsWith('http://') || img.startsWith('https://')) {
                imageUrl = img;
              } else if (img.startsWith('/uploads/')) {
                imageUrl = `${backendUrl}${img}`;
              }
            }
          } catch(e) {}
        }
      }
    } catch(fetchError) {
      // Nếu backend timeout/lỗi → vẫn trả về meta tags mặc định (không crash)
      console.warn('Backend fetch failed, using default OG tags:', fetchError.message);
    }

    const pageUrl = `https://onlygift.online/${slug ? 'qua-tang/' + slug : 'gift/view/' + actualCode}`;

    // Render HTML chứa Meta Tags
    const html = `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    
    <!-- Open Graph / Facebook / Zalo -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:alt" content="Hình ảnh món quà từ OnlyLoveGift">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="OnlyLoveGift">
    <meta property="og:locale" content="vi_VN">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
  </head>
  <body>
    <p>Đang tải món quà của bạn...</p>
    <script>
      // Chuyển hướng người dùng thực về trang quà tặng
      window.location.replace('${pageUrl}');
    </script>
  </body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Cache 5 phút, cho phép stale-while-revalidate 1 tiếng để giảm tải backend
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in og proxy:', error);
    res.status(500).send('Internal Server Error');
  }
}
