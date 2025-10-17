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
      <body className={`${inter.className} text-slate-900 bg-white`}>
        {children}
      </body>
    </html>
  );
}
