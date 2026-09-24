import HomeClient from "./HomeClient";
import { getCatalog } from "@/lib/products-server";

// 금액은 관리자 페이지에서 저장 시 즉시 갱신, 그 외에는 60초마다 갱신
export const revalidate = 60;

export default async function Page() {
  const catalog = await getCatalog();

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
      itemListElement: catalog.products
        .filter((p) => p.active)
        .map((p) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: p.label },
          price: String(p.price),
          priceCurrency: "KRW",
        })),
    },
    knowsAbout: [
      "AR 광고", "증강현실 마케팅", "3D 모션 배너", "위치 기반 광고", "공간 마케팅",
      "GPS 광고", "소상공인 마케팅",
    ],
    priceRange: "₩₩",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeClient catalog={catalog} />
    </>
  );
}
