"use client";

import { useState, useRef, useEffect } from "react";
import {
  MapPin, Phone, Mail, CheckCircle2,
  Store, Building2, Calendar, Smartphone, Zap, Users,
  ChevronDown,
} from "lucide-react";
import ContactForm from "./components/ContactForm";
import Header from "./components/Header";
import PriceCalculator from "./components/PriceCalculator";

function Section({ id, className = "", children }: {
  id?: string; className?: string; children: React.ReactNode;
}) {
  return <section id={id} className={`container ${className}`}>{children}</section>;
}

const FAQ_DATA = [
  {
    q: "AR 광고는 어떻게 보나요?",
    a: "nin.earth 사이트에 접속하면 등록된 위치 근처에서 카메라를 통해 AR 배너를 바로 확인할 수 있습니다. 별도 앱 설치 없이 GPS 좌표 기반으로 작동합니다.",
  },
  {
    q: "위치 독점이란 무엇인가요?",
    a: "계약 기간 동안 해당 GPS 좌표에는 다른 광고주의 AR 배너가 노출되지 않습니다. 하나의 좌표에 하나의 브랜드만 운영되어 독점적인 광고 효과를 보장합니다.",
  },
  {
    q: "배너 디자인을 직접 만들어 올릴 수 있나요?",
    a: "네, 배너 파일 교체 서비스(₩20,000)를 이용하면 직접 만든 이미지를 등록할 수 있습니다. 파일 규격은 1:1.5 비율, 50KB 미만이어야 합니다.",
  },
  {
    q: "계약 후 배너 내용을 바꿀 수 있나요?",
    a: "네, 운영 기간 내에 배너 파일 교체 또는 디자인 재제작을 요청할 수 있습니다. 변경 시 해당 서비스 비용이 별도 발생합니다.",
  },
  {
    q: "3D 모션 배너와 기본 배너의 차이는?",
    a: "기본 배너는 정적 이미지 기반이고, 3D 모션 배너는 이동·회전·파티클 등 애니메이션 효과가 포함된 입체 배너입니다. 더 높은 몰입감과 주목도를 제공합니다.",
  },
  {
    q: "결제는 어떻게 하나요?",
    a: "전자계약 체결 후 안내된 계좌로 선입금하시면 됩니다. 입금 확인 후 제작 및 세팅이 시작됩니다. 모든 금액은 부가세(10%) 별도입니다.",
  },
  {
    q: "계약 기간은 어떻게 되나요?",
    a: "일반 GPS 위치 사용권은 1년 단위이며, 대중집합공간 위치 사용권은 원하는 일수만큼 자유롭게 설정 가능합니다. 만료 전 갱신하면 동일 좌표를 계속 유지할 수 있습니다.",
  },
  {
    q: "여러 위치에 동시에 광고할 수 있나요?",
    a: "네, 각 위치별로 사용권을 별도로 구매하면 됩니다. 다수 위치 운영 시 별도 상담을 통해 할인을 제공해 드립니다.",
  },
];

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y rounded-xl border overflow-hidden">
      {FAQ_DATA.map((item, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-sm font-semibold text-slate-800">{item.q}</span>
            <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-5 pb-5 -mt-1 text-sm text-slate-600 leading-relaxed">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LazyVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? el.play() : el.pause(); },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className={className} src={src} muted loop playsInline preload="metadata" />;
}

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      {/* HERO */}
      <div id="hero" className="hero-bg">
        <Section className="py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="pill">위치 기반 AR 광고 대행</div>
              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                거리에서 만나는<br/><span className="text-blue-600">브랜드 경험</span>
              </h1>
              <p className="mt-4 text-slate-600 leading-relaxed">
                GPS로 정확히 고정되는 AR 배너. 지나가는 사람들이 스마트폰을 들면 내 광고가 살아납니다.<br/>
                자영업자부터 프랜차이즈 브랜드까지, 가장 직관적인 공간 마케팅.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#contact" className="btn">문의하기</a>
                <a href="#showcase" className="btn-outline">AR 미리보기</a>
              </div>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {[
                  { icon: MapPin,     label: "위치 독점" },
                  { icon: Smartphone, label: "AR 체험" },
                  { icon: Zap,        label: "즉각 노출" },
                  { icon: Users,      label: "체험 바이럴" },
                ].map((f) => (
                  <div key={f.label} className="feature-chip">
                    <f.icon className="h-4 w-4 text-blue-600" /> {f.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="rounded-xl h-64 grid place-items-center border bg-white overflow-hidden">
                <img
                  src="/banner-preview.png"
                  alt="AR 배너 미리보기"
                  className="w-full h-full object-cover"
                />
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <li className="bullet"><CheckCircle2 className="icon" /> GPS 오차 ±2m</li>
                <li className="bullet"><CheckCircle2 className="icon" /> 1년간 위치 독점</li>
                <li className="bullet"><CheckCircle2 className="icon" /> 3D 모션 배너</li>
                <li className="bullet"><CheckCircle2 className="icon" /> 간편 업데이트</li>
              </ul>
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border text-xs">
                  <MapPin className="h-3.5 w-3.5" /> 실제 거리에서 체험 가능
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* SOCIAL PROOF */}
      <div className="border-y bg-slate-50">
        <Section className="py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "10+", label: "파트너 고객사" },
              { value: "50+", label: "AR 배너 운영" },
              { value: "±2m", label: "GPS 정밀도" },
              { value: "24h", label: "평균 세팅 시간" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-extrabold text-blue-600">{s.value}</p>
                <p className="mt-1 text-sm text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* SOLUTIONS */}
      <Section id="solutions" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">활용 대상</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold">누구에게 필요할까요?</h2>
          <p className="mt-2 text-slate-600">온라인에서 오프라인으로, 공간 마케팅의 새로운 기준을 제시합니다.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Store,     title: "소상공인 · 자영업자", desc: "내 가게 앞 거리에 AR 배너를 세우세요. 지나가는 고객이 스마트폰으로 메뉴, 이벤트, 할인을 바로 확인합니다." },
            { icon: Building2, title: "브랜드 · 프랜차이즈",  desc: "전국 가맹점을 동시에. 본사 캠페인을 모든 지점에 일괄 배포하고, 지점별 맞춤 운영도 가능합니다." },
            { icon: Calendar,  title: "이벤트 · 팝업",        desc: "팝업스토어, 전시, 공연, 개인 행사. 특별한 장소에 AR 경험을 더해 자연스러운 바이럴을 만드세요." },
            { icon: MapPin,    title: "관광 · 부동산",         desc: "관광지, 분양 현장, 상업지구. 위치 기반 AR로 현장을 방문한 사람에게 바로 정보와 경험을 제공합니다." },
          ].map((c) => (
            <div key={c.title} className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold flex items-center gap-2">
                <c.icon className="h-4 w-4" /> {c.title}
              </div>
              <div className="p-5 text-sm text-slate-600">{c.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* SHOWCASE */}
      <Section id="showcase" className="py-16">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="pill">AR 체험</span>
          <h3 className="mt-3 text-3xl font-extrabold">이런 모습으로 보입니다</h3>
          <p className="mt-2 text-slate-600">실제 거리에서 스마트폰으로 체험하는 AR 배너입니다.</p>
        </div>
        <div className="card p-6">
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <div className="rounded-xl h-72 md:h-80 border bg-black overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  src="/ar-preview.mp4"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="bullet"><CheckCircle2 className="icon" /> 실제 거리에서 스마트폰으로 체험</li>
              <li className="bullet"><CheckCircle2 className="icon" /> GPS ±2m 정밀도로 위치 고정</li>
              <li className="bullet"><CheckCircle2 className="icon" /> 3D 이동·회전·파티클 효과</li>
              <li className="bullet"><CheckCircle2 className="icon" /> 가벼운 리소스, 빠른 로딩</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* CASES */}
      <Section id="cases" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">실제 활용 사례</span>
          <h3 className="mt-3 text-3xl font-extrabold">현장에서 만나는 AR</h3>
          <p className="mt-2 text-slate-600">실제 거리와 공간에서 촬영한 AR 광고 운영 영상입니다.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: "ex1", label: "라스트라벨 일산덕이점" },
            { name: "ex2", label: "101수산" },
            { name: "ex3", label: "상추네 장작불 닭볶음탕" },
            { name: "ex4", label: "내셔널지오그래픽 일산덕이점" },
            { name: "ex5", label: "라스트라벨 일산덕이점" },
          ].map((item) => (
            <div key={item.name} className="card overflow-hidden">
              <div className="aspect-[9/16] bg-black">
                <LazyVideo
                  className="w-full h-full object-cover"
                  src={`https://pub-4d204982c58e47eeb7eef39ac8c94010.r2.dev/${item.name}.MP4`}
                />
              </div>
              <p className="text-xs text-center text-slate-600 py-2 px-1 truncate">{item.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PROCESS */}
      <Section id="process" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">진행 절차</span>
          <h3 className="mt-3 text-3xl font-extrabold">이렇게 진행됩니다</h3>
          <p className="mt-2 text-slate-600">위치 선정부터 AR 노출까지, 복잡한 과정은 저희가 처리합니다.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-5 gap-4">
          {[
            { n: 1, t: "위치 · 목적 상담",   d: "원하는 위치, 활용 목적, 예산을 편하게 공유해주세요." },
            { n: 2, t: "위치 확정 및 계약",   d: "GPS 좌표를 확정하고 1년 위치 독점 운영 계약을 체결합니다." },
            { n: 3, t: "콘텐츠 제작",         d: "브랜드에 맞는 AR 배너 또는 3D 모션 배너를 제작합니다." },
            { n: 4, t: "AR 배포 · 세팅",      d: "지정 좌표에 AR 콘텐츠를 등록하고 노출을 시작합니다." },
            { n: 5, t: "운영 · 업데이트",     d: "서면 요청 한 번으로 내용 변경, 지속적인 운영 관리를 제공합니다." },
          ].map(s => (
            <div key={s.n} className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold">{s.n}. {s.t}</div>
              <div className="p-5 text-sm text-slate-600">{s.d}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">Pricing</span>
          <h3 className="mt-3 text-3xl font-extrabold">상품별 금액</h3>
          <p className="mt-2 text-slate-600">위치 독점권을 확보하고, 필요할 때만 추가 비용을 쓰는 합리적인 구조.</p>
        </div>

        {/* 위치 사용권 */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="card hover-card">
            <div className="p-5 border-b text-lg font-semibold flex items-center gap-2">
              일반 GPS 위치 사용권
              <span className="text-xs font-normal text-slate-500 border border-slate-300 rounded-full px-2 py-0.5">연간</span>
            </div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩100,000 <span className="text-base font-medium">/ 년</span></div>
              <p className="text-xs text-slate-400 mt-1">VAT 별도</p>
              <p className="mt-2 text-sm text-slate-600">원하는 GPS 좌표에 연간 독점 AR 노출권을 확보합니다.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="bullet"><CheckCircle2 className="icon" /> 좌표 독점 운영권</li>
                <li className="bullet"><CheckCircle2 className="icon" /> GPS 오차 ±2m</li>
              </ul>
            </div>
          </div>
          <div className="card hover-card">
            <div className="p-5 border-b text-lg font-semibold flex items-center gap-2">
              대중집합공간 위치 사용권
              <span className="text-xs font-normal text-orange-700 border border-orange-200 rounded-full px-2 py-0.5 bg-orange-50">일 단위</span>
            </div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩100,000 <span className="text-base font-medium">/ 일</span></div>
              <p className="text-xs text-slate-400 mt-1">VAT 별도</p>
              <p className="mt-2 text-sm text-slate-600">CONTEX가 보유한 대중집합공간에 AR 광고를 집행합니다. 원하는 일수만큼 유연하게 운영하세요.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="bullet"><CheckCircle2 className="icon" /> 유동 인구 밀집 공간</li>
                <li className="bullet"><CheckCircle2 className="icon" /> 일 단위 자유로운 기간 설정</li>
                <li className="bullet"><CheckCircle2 className="icon" /> 콘텐츠 별도 선택 가능</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 기본 배너 관련 요금 */}
        <div className="mt-10">
          <h4 className="text-xl font-extrabold mb-4">기본 배너 관련 요금</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold">배너 디자인 제작</div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩150,000 <span className="text-base font-medium">/ 회</span></div>
                <p className="text-xs text-slate-400 mt-1">VAT 별도</p>
                <p className="mt-2 text-sm text-slate-600">브랜드 가이드에 맞는 AR 배너를 기획·디자인·최적화까지 맞춤 제작합니다. 파일 교체 비용 포함.</p>
              </div>
            </div>
            <div className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold flex items-center gap-2">
                배너 파일 교체
                <span className="group/tip relative">
                  <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 text-slate-400 text-[10px] font-bold inline-flex items-center justify-center cursor-help hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition">?</span>
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/tip:block w-52 rounded-xl bg-slate-800 text-white text-xs px-3.5 py-3 shadow-2xl z-20">
                    <span className="block font-semibold text-slate-200 mb-2">배너 파일 규격</span>
                    <span className="flex justify-between items-center"><span className="text-slate-400">비율</span><span className="font-medium">1 : 1.5</span></span>
                    <span className="flex justify-between items-center mt-1"><span className="text-slate-400">용량</span><span className="font-medium">50 KB 미만</span></span>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800" />
                  </span>
                </span>
              </div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩20,000 <span className="text-base font-medium">/ 회</span></div>
                <p className="text-xs text-slate-400 mt-1">VAT 별도</p>
                <p className="mt-2 text-sm text-slate-600">완성된 배너 파일을 직접 전달 시 서버 등록 및 교체. 별도 디자인 작업 없이 빠르게 업데이트.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3D 모션 배너 관련 요금 */}
        <div className="mt-10">
          <h4 className="text-xl font-extrabold mb-2">3D 모션 배너 관련 요금</h4>
          <p className="text-sm text-slate-500 mb-4">제작 기준: 초당 ₩110,000 (부가세 별도)</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold">파일 교체</div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩60,000 <span className="text-base font-medium">/ 회</span></div>
                <p className="text-xs text-slate-400 mt-1">VAT 별도</p>
                <p className="mt-2 text-sm text-slate-600">완성된 3D 소재 파일을 전달하면 서버에 등록 후 기존 배너와 교체합니다.</p>
              </div>
            </div>
            <div className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold flex items-center gap-2">
                제작 5초 <span className="text-xs font-normal text-slate-500 border border-slate-300 rounded-full px-2 py-0.5">기본</span>
              </div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩550,000</div>
                <p className="text-xs text-slate-400 mt-1">VAT 별도</p>
                <p className="mt-2 text-sm text-slate-600">자연스러운 모션과 루프가 가능한 기본 길이입니다.</p>
              </div>
            </div>
            <div className="card hover-card border-blue-200">
              <div className="p-5 border-b text-lg font-semibold flex items-center gap-2">
                제작 10초 <span className="text-xs font-normal text-blue-600 border border-blue-200 rounded-full px-2 py-0.5">Best</span>
              </div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩1,067,000</div>
                <p className="text-xs text-slate-400 mt-1">VAT 별도</p>
                <p className="mt-1 text-xs text-blue-600 font-medium">3% 할인 적용</p>
                <p className="mt-2 text-sm text-slate-600">풍부한 연출과 스토리텔링이 가능한 가장 많이 선택하는 길이입니다.</p>
              </div>
            </div>
            <div className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold">제작 15초</div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩1,567,500</div>
                <p className="text-xs text-slate-400 mt-1">VAT 별도</p>
                <p className="mt-1 text-xs text-slate-500 font-medium">5% 할인 적용</p>
                <p className="mt-2 text-sm text-slate-600">긴 스토리와 다양한 씬 전환이 가능한 프리미엄 모션 배너입니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 갱신/재구매 안내 */}
        <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
          <h4 className="text-lg font-extrabold mb-2">변경 / 재구매 안내</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            이미 위치 사용권을 보유하고 계신가요? 배너 디자인 변경이나 3D 모션 배너 추가 제작만 별도로 신청할 수 있습니다.
            위치 사용권 비용 없이 <span className="font-semibold text-slate-800">콘텐츠 제작비만</span> 결제하면 됩니다.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-full border border-blue-200 bg-white text-blue-700 text-center">배너 파일 교체 ₩20,000</span>
            <span className="px-3 py-1.5 rounded-full border border-blue-200 bg-white text-blue-700 text-center">배너 디자인 제작 ₩150,000</span>
            <span className="px-3 py-1.5 rounded-full border border-blue-200 bg-white text-blue-700 text-center">3D 모션 배너 파일 교체 ₩60,000</span>
            <span className="px-3 py-1.5 rounded-full border border-blue-200 bg-white text-blue-700 text-center">3D 모션 배너 제작 ₩550,000~</span>
          </div>
        </div>

        {/* 견적 계산기 */}
        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="pill">견적 계산기</span>
            <h3 className="mt-3 text-2xl font-extrabold">원하는 항목을 선택하면 견적을 바로 확인하세요</h3>
          </div>
          <PriceCalculator />
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">FAQ</span>
          <h3 className="mt-3 text-3xl font-extrabold">자주 묻는 질문</h3>
          <p className="mt-2 text-slate-600">궁금한 점을 빠르게 확인하세요.</p>
        </div>
        <div className="mt-10 max-w-3xl mx-auto">
          <FaqAccordion />
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" className="py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="pill">Contact</span>
            <h3 className="mt-3 text-3xl font-extrabold">문의하기</h3>
            <p className="mt-2 text-slate-600">어떤 위치에, 어떤 목적으로 활용하고 싶은지 편하게 알려주세요. 빠르게 연락드립니다.</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +82-10-3653-1987</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@contexcorp.com</div>
            </div>
          </div>
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold">빠른 상담 신청</div>
            <div className="p-5">
              <ContactForm />
              <p className="text-xs text-slate-500 mt-3">* 모든 금액은 부가세 별도. 작업은 비용 선납 확인 후 진행됩니다.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t bg-white/80">
        <Section className="py-10">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div>
              <div className="font-bold text-lg">CONTEX Corp.</div>
              <p className="text-sm text-slate-600 mt-2">Contents Tech Experience<br/>위치 기반 AR 광고 대행</p>
            </div>
            <div className="text-sm">
              <div className="font-semibold mb-2">사업자 정보</div>
              <p>상호 : 콘텍스</p>
              <p>사업자등록번호 : 181-48-00499</p>
              <p>통신판매업 신고번호 : 제2021-고양일산서-0031호</p>
              <p>개인정보처리 담당자 : 홍정민</p>
              <p>대표 : 홍정민</p>
              <p>주소 : 경기도 고양시 일산서구 킨텍스로 240, 909호</p>
            </div>
            <div className="text-sm">
              <div className="font-semibold mb-2">정책</div>
              <a href="/privacy" className="block hover:underline">개인정보 처리방침</a>
            </div>
          </div>
          <div className="container text-xs text-slate-500 mt-6">© {new Date().getFullYear()} CONTEX. All rights reserved.</div>
        </Section>
      </footer>
    </div>
  );
}
