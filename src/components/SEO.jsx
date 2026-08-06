import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_DOMAIN = 'https://www.onlygift.online';

// Đảm bảo image URL luôn là URL tuyệt đối (bot crawlers cần URL đầy đủ)
function toAbsoluteUrl(imagePath) {
  if (!imagePath) return `${SITE_DOMAIN}/og-banner.jpg`;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  return `${SITE_DOMAIN}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

export default function SEO({ title, description, keywords, image, url, faqSchema, softwareSchema }) {
  const siteTitle = title ? `${title} | OnlyLoveGift` : 'OnlyLoveGift - Nền Tảng Tạo Website Tỏ Tình & Quà Tặng';
  const siteDescription = description || 'Only Gift Online - Nền tảng tạo website quà tặng tình yêu, mã code trái tim tỏ tình 3D độc quyền và miễn phí. Tự động lên mạng tức thì!';
  const siteKeywords = keywords || 'only gift, gift only, only gift online, onlylovegift, dear gift, love gift, gift love, love gift online, love gift IT, tạo website quà tặng, tỏ tình, mã code trái tim, code trái tim, quà tặng sinh nhật, web tỏ tình, code trái tim đập, code trái tim tiktok, trend tiktok, thiệp online, quà tặng bạn gái, quà valentine';
  const siteUrl = url || SITE_DOMAIN;
  const siteImage = toAbsoluteUrl(image);

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
      <meta property="og:image:alt" content={siteTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="OnlyLoveGift" />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={siteImage} />

      {/* FAQ Schema - giúp xuất hiện trong Google Featured Snippets & AI Overview */}
      {faqSchema && faqSchema.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqSchema.map(({ q, a }) => ({
              "@type": "Question",
              "name": q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": a
              }
            }))
          })}
        </script>
      )}

      {/* SoftwareApplication Schema - giúp Google hiểu đây là công cụ web */}
      {softwareSchema && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": softwareSchema.name || "OnlyLoveGift",
            "description": softwareSchema.description || siteDescription,
            "url": siteUrl,
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": softwareSchema.price || "0",
              "priceCurrency": "VND"
            },
            ...(softwareSchema.rating ? {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": softwareSchema.rating,
                "ratingCount": softwareSchema.ratingCount || "100"
              }
            } : {})
          })}
        </script>
      )}
    </Helmet>
  );
}

