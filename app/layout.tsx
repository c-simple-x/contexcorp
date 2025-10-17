import Script from "next/script"; // ← 추가
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "CONTEX Corp.",
  description: "AR·콘텐츠·마케팅 원페이지 에이전시",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="min-h-screen bg-gradient-to-b from-background via-white to-muted/20 text-foreground">
        {/* Turnstile */}
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
       {children}
      </body>

    </html>
  );
}
