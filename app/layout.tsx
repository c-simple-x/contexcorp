export const metadata = {
  title: "CONTEX Corp.",
  description: "현실과 디지털을 잇는 AR·콘텐츠·마케팅 솔루션",
  icons: { icon: "/favicon.ico" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gradient-to-b from-background via-white to-muted/20 text-foreground">
        {children}
      </body>
    </html>
  );
}
