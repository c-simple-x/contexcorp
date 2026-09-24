// ✅ 이 줄이 꼭 필요합니다!
import "./globals.css";

import Script from "next/script";

export const metadata = {
  title: "CONTEX Corp. | AR·콘텐츠·마케팅 솔루션",
  description: "AR 위치형 광고·3D 배너·콘텐츠·마케팅·유통까지 원스톱 솔루션",
  keywords: [
    "AR 광고", "증강현실 광고", "위치 기반 AR", "3D 모션 배너",
    "공간 마케팅", "AR 배너", "GPS 광고", "CONTEX Corp", "콘텍스",
    "소상공인 마케팅", "오프라인 마케팅", "AR 대행",
  ],
  metadataBase: new URL("https://www.c-simple-x.com"),
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/apple-touch-icon.png" },
  openGraph: {
    title: "CONTEX Corp. | AR·콘텐츠·마케팅",
    description: "AR 위치형 광고·3D 배너·콘텐츠·마케팅·유통까지 원스톱 솔루션",
    url: "https://www.c-simple-x.com",
    siteName: "CONTEX Corp.",
    images: [{ url: "/banner-preview.png", width: 1200, height: 630, alt: "CONTEX Corp AR 광고" }],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CONTEX Corp. | AR·콘텐츠·마케팅",
    description: "AR 위치형 광고·3D 배너·콘텐츠·마케팅·유통까지 원스톱 솔루션",
    images: ["/banner-preview.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "CONTEX Corp.",
  alternateName: "콘텍스",
  description: "AR 위치형 광고·3D 배너·콘텐츠·마케팅·유통까지 원스톱 솔루션",
  url: "https://www.c-simple-x.com",
  telephone: "+82-10-3653-1987",
  email: "contact@c-simple-x.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "KR",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AR 광고 서비스",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "일반 GPS 위치 사용권 (연간)" },
        price: "100000",
        priceCurrency: "KRW",
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "3D 모션 배너 제작 (10초)" },
        price: "1067000",
        priceCurrency: "KRW",
      },
    ],
  },
  knowsAbout: [
    "AR 광고", "증강현실 마케팅", "3D 모션 배너", "위치 기반 광고", "공간 마케팅",
    "GPS 광고", "소상공인 마케팅",
  ],
  priceRange: "₩₩",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gradient-to-b from-background via-white to-muted/20 text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Turnstile 쓰는 경우 */}
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        {children}
      </body>
    </html>
  );
}
