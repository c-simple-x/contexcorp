import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AR 광고 확인 가이드 | CONTEX Corp.",
  description:
    "계약자를 위한 AR 콘텐츠 접속, 확인 및 화면 녹화 안내 가이드입니다. Chrome 접속부터 AR 3D 광고 확인, 녹화 방법까지 단계별로 안내합니다.",
  openGraph: {
    title: "AR 광고 확인 가이드 | CONTEX Corp.",
    description:
      "AR 콘텐츠 접속 → 3D 광고 확인 → 화면 녹화까지, 단계별 안내 가이드",
    url: "https://www.contexcorp.com/guide",
    siteName: "CONTEX Corp.",
    images: [
      {
        url: "/banner-preview.png",
        width: 1200,
        height: 630,
        alt: "CONTEX Corp. AR 광고 확인 가이드",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "AR 광고 확인 가이드 | CONTEX Corp.",
    description:
      "AR 콘텐츠 접속 → 3D 광고 확인 → 화면 녹화까지, 단계별 안내 가이드",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
