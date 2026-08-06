export default async function handler(req, res) {
  const { page } = req.query;

  // Map các trang đến thông tin SEO cụ thể
  const pagesMeta = {
    'templates': {
      title: 'Mẫu Website Tỏ Tình & Quà Tặng 3D | OnlyLoveGift',
      description: 'Kho mẫu website tỏ tình độc đáo: trái tim mã nguồn IT, hộp quà sinh nhật 3D, cỏ 4 lá may mắn... Tạo quà tặng ý nghĩa cho người yêu chỉ 5 phút!',
      image: 'https://onlygift.online/images/heart-code.jpg',
      url: 'https://onlygift.online/templates',
    },
    'heart-code': {
      title: 'Tạo Trái Tim Mã Nguồn Tỏ Tình IT | OnlyLoveGift',
      description: 'Tạo website trái tim mã nguồn rơi cực trend TikTok - Quà tặng độc đáo cho người yêu làm trong ngành IT. Cá nhân hóa tên & lời chúc miễn phí!',
      image: 'https://onlygift.online/images/heart-code.jpg',
      url: 'https://onlygift.online/tao-ma-code-trai-tim-to-tinh',
    },
    'love-box': {
      title: 'Tạo Hộp Quà Sinh Nhật 3D Bất Ngờ | OnlyLoveGift',
      description: 'Hộp quà sinh nhật 3D với hiệu ứng mở hộp bất ngờ, bóng bay và thiệp chúc mừng. Tùy chỉnh ảnh, tên và lời chúc theo ý bạn!',
      image: 'https://onlygift.online/images/thumb_1.jpg',
      url: 'https://onlygift.online/tao-hop-qua-bat-ngo',
    },
    'lucky-chance': {
      title: 'Tạo Cỏ 4 Lá May Mắn Online | OnlyLoveGift',
      description: 'Gửi lời chúc may mắn qua trang cỏ 4 lá động với nhạc nền nhẹ nhàng. Quà tặng ý nghĩa cho bạn bè và người thân!',
      image: 'https://onlygift.online/images/thumb_2.jpg',
      url: 'https://onlygift.online/tao-vong-quay-may-man',
    },
    'christmas': {
      title: 'Tạo Thiệp Giáng Sinh 3D Miễn Phí | OnlyLoveGift',
      description: 'Thiệp Giáng Sinh 3D lung linh với cây thông và hiệu ứng tuyết rơi. Gửi lời chúc Noel đặc biệt đến người thân miễn phí!',
      image: 'https://onlygift.online/images/thumb_3.jpg',
      url: 'https://onlygift.online/tao-qua-giang-sinh-3d',
    },
  };

  const meta = pagesMeta[page] || {
    title: 'OnlyLoveGift - Nền Tảng Tạo Website Tỏ Tình & Quà Tặng',
    description: 'Tạo website quà tặng tình yêu độc đáo, mã code trái tim tỏ tình 3D, thiệp online bắt mắt. Miễn phí & tự động lên mạng ngay!',
    image: 'https://onlygift.online/anhweb.jpg',
    url: 'https://onlygift.online',
  };

  const html = `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}">
    
    <!-- Open Graph / Facebook / Zalo -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${meta.url}">
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.description}">
    <meta property="og:image" content="${meta.image}">
    <meta property="og:image:alt" content="${meta.title}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="OnlyLoveGift">
    <meta property="og:locale" content="vi_VN">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${meta.title}">
    <meta name="twitter:description" content="${meta.description}">
    <meta name="twitter:image" content="${meta.image}">
  </head>
  <body>
    <p>Đang tải trang...</p>
    <script>
      window.location.replace('${meta.url}');
    </script>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
}
