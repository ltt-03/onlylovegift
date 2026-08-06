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
    
    // Gọi API của backend để lấy thông tin đơn hàng
    const apiUrl = `${backendUrl}/api/orders/${actualCode}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    let title = 'Món Quà Bí Mật - OnlyLoveGift';
    let description = 'Bạn nhận được một món quà bí mật từ ai đó. Hãy mở ra để xem nhé!';
    let imageUrl = 'https://onlygift.online/anhweb.jpg'; // Ảnh mặc định

    if (data && data.success && data.order) {
      const order = data.order;
      const sender = order.senderName || 'Người Giấu Tên';
      const receiver = order.receiverName || 'Bạn';
      
      title = `🎁 Món Quà Từ ${sender} Gửi Tới ${receiver}`;
      description = `Bạn có một món quà đặc biệt từ ${sender}. Nhấn vào đây để xem điều bất ngờ!`;
      
      // Nếu có ảnh trong đơn hàng, lấy ảnh đầu tiên làm thumbnail
      if (order.images) {
        try {
          const imagesArr = JSON.parse(order.images);
          if (Array.isArray(imagesArr) && imagesArr.length > 0) {
            let img = imagesArr[0];
            // Nếu là đường dẫn tương đối, thêm backendUrl (thường là uploads của backend)
            if (img.startsWith('/uploads/')) {
              imageUrl = `${backendUrl}${img}`;
            } else {
              imageUrl = img;
            }
          }
        } catch(e) {}
      }
    }

    // Render HTML chứa Meta Tags
    const html = `
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <meta name="description" content="${description}">
          
          <!-- Open Graph / Facebook / Zalo -->
          <meta property="og:type" content="website">
          <meta property="og:url" content="https://onlygift.online/${slug ? 'qua-tang/' + slug : 'gift/view/' + actualCode}">
          <meta property="og:title" content="${title}">
          <meta property="og:description" content="${description}">
          <meta property="og:image" content="${imageUrl}">
          <meta property="og:image:alt" content="Hình ảnh món quà">
          <meta property="og:site_name" content="OnlyLoveGift">
          
          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${description}">
          <meta name="twitter:image" content="${imageUrl}">
        </head>
        <body>
          <p>Đang tải món quà của bạn...</p>
          <script>
            // Nếu người dùng thực bằng cách nào đó vào đây (không phải Bot), thì chuyển hướng về frontend
            window.location.replace('/${slug ? 'qua-tang/' + slug : 'gift/view/' + actualCode}?bot=false');
          </script>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); 
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in og proxy:', error);
    res.status(500).send('Internal Server Error');
  }
}
