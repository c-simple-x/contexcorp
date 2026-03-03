// ✅ 이 줄이 꼭 필요합니다!
import "./globals.css";

import Script from "next/script";

export const metadata = {
  title: "CONTEX Corp. | AR·콘텐츠·마케팅 솔루션",
  description: "AR 위치형 광고·3D 배너·콘텐츠·마케팅·유통까지 원스톱 솔루션",
  metadataBase: new URL("https://www.contexcorp.com"),
  icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/apple-touch-icon.png" },
  openGraph: {
    title: "CONTEX Corp. | AR·콘텐츠·마케팅",
    description: "AR 위치형 광고·3D 배너·콘텐츠·마케팅·유통까지 원스톱 솔루션",
    url: "https://www.contexcorp.com",
    siteName: "CONTEX Corp.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "CONTEX" }],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CONTEX Corp. | AR·콘텐츠·마케팅",
    description: "AR 위치형 광고·3D 배너·콘텐츠·마케팅·유통까지 원스톱 솔루션",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gradient-to-b from-background via-white to-muted/20 text-foreground">
        {/* Turnstile 쓰는 경우 */}
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        {children}
      </body>
    </html>
  );
}
