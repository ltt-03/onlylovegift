import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, image, url }) {
  const siteTitle = title ? `${title} | OnlyLoveGift` : 'OnlyLoveGift - Nền Tảng Tạo Website Tỏ Tình & Quà Tặng';
  const siteDescription = description || 'Only Gift Online - Nền tảng tạo website quà tặng tình yêu, mã code trái tim tỏ tình 3D độc quyền và miễn phí. Tự động lên mạng tức thì!';
  const siteKeywords = keywords || 'only gift, gift only, only gift online, onlylovegift, dear gift, love gift, gift love, love gift online, love gift IT, tạo website quà tặng, tỏ tình, mã code trái tim, code trái tim, quà tặng sinh nhật, web tỏ tình, code trái tim đập, code trái tim tiktok, trend tiktok, thiệp online, quà tặng bạn gái, quà valentine';
  const siteUrl = url || 'https://onlygift.online';
  const siteImage = image || '/anhweb.jpg'; // Assume a default logo or OG image

  return (
    <Helmet>
      {/* Cơ bản */}
      <title>{siteTitle}</title>
      <link rel="canonical" href={siteUrl} />
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />

      {/* Open Graph / Facebook / Zalo */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={siteImage} />
    </Helmet>
  );
}
