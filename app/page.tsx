"use client";

import {
  MapPin, Phone, Mail, Link as LinkIcon, CheckCircle2, ArrowRight,
  Store, Building2, Calendar, Smartphone, Zap, Users
} from "lucide-react";
import ContactForm from "./components/ContactForm";

function Section({ id, className = "", children }: {
  id?: string; className?: string; children: React.ReactNode;
}) {
  return <section id={id} className={`container ${className}`}>{children}</section>;
}

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="container h-16 flex items-center justify-between">
          <a href="#hero" className="font-extrabold tracking-tight">CONTEX <span className="font-semibold opacity-70">Corp.</span></a>
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <a className="navlink" href="#solutions">활용 사례</a>
            <a className="navlink" href="#showcase">AR 미리보기</a>
            <a className="navlink" href="#pricing">요금</a>
            <a className="navlink" href="#process">진행 절차</a>
            <a className="navlink" href="#contact">문의</a>
          </nav>
          <a href="#contact" className="btn hidden sm:inline-flex">
            무료 상담 <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </header>

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
                <a href="#showcase" className="btn">AR 미리보기</a>
                <a href="#contact" className="btn">무료 상담</a>
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
                <li className="bullet"><CheckCircle2 className="icon" /> 5년 위치 독점</li>
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

      {/* SOLUTIONS */}
      <Section id="solutions" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">활용 사례</span>
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
      <Section id="showcase" className="py-8">
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

      {/* PRICING */}
      <Section id="pricing" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">Pricing</span>
          <h3 className="mt-3 text-3xl font-extrabold">투명한 요금 정책</h3>
          <p className="mt-2 text-slate-600">위치 독점권을 확보하고, 필요할 때만 추가 비용을 쓰는 합리적인 구조.</p>
        </div>

        {/* 기본 서비스 */}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover-card">
            <div className="p-5 border-b text-lg font-semibold">위치 독점권 (연간)</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩200,000 <span className="text-base font-medium">/ 년</span></div>
              <p className="mt-2 text-sm text-slate-600">원하는 GPS 좌표에 연간 독점 AR 노출권을 확보합니다.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {["최초 1회 무료 세팅", "좌표 독점 운영권", "GPS 오차 ±2m"].map(x => (
                  <li key={x} className="bullet"><CheckCircle2 className="icon" /> {x}</li>
                ))}
              </ul>
              <a href="#contact" className="btn mt-6 w-full">상담 신청</a>
            </div>
          </div>

          <div className="card hover-card">
            <div className="p-5 border-b text-lg font-semibold">디자인 · 문구 변경</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩20,000 <span className="text-base font-medium">/ 회</span></div>
              <p className="mt-2 text-sm text-slate-600">완성된 파일을 직접 전달 시 단순 교체. 별도 디자인 작업 없이 빠르게 업데이트.</p>
              <a href="#contact" className="btn mt-6 w-full">변경 요청</a>
            </div>
          </div>

          <div className="card hover-card">
            <div className="p-5 border-b text-lg font-semibold">디자인 제작 의뢰</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩150,000 <span className="text-base font-medium">/ 회</span></div>
              <p className="mt-2 text-sm text-slate-600">브랜드 가이드에 맞는 AR 배너를 기획·디자인·최적화까지 맞춤 제작합니다.</p>
              <a href="#contact" className="btn mt-6 w-full">제작 의뢰</a>
            </div>
          </div>

          <div className="card hover-card">
            <div className="p-5 border-b text-lg font-semibold">3D 배너 소재 교체</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩60,000 <span className="text-base font-medium">/ 회</span></div>
              <p className="mt-2 text-sm text-slate-600">완성된 3D 소재 파일을 전달하면 서버에 등록 후 기존 배너와 교체합니다.</p>
              <a href="#contact" className="btn mt-6 w-full">교체 요청</a>
            </div>
          </div>
        </div>

        {/* 3D 모션 배너 */}
        <div className="mt-8">
          <div className="text-center mb-6">
            <h4 className="text-xl font-extrabold">3D 모션 배너 제작</h4>
            <p className="text-sm text-slate-600 mt-1">공간을 이동·회전하는 몰입형 AR 배너. 초 단위로 제작되며 길이에 따라 금액이 결정됩니다.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold">3초</div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩300,000</div>
                <p className="mt-2 text-sm text-slate-600">단순 모션에 적합. 짧은 루프로 반복 재생 시 다소 부자연스러울 수 있습니다.</p>
                <a href="#contact" className="btn mt-6 w-full">문의하기</a>
              </div>
            </div>
            <div className="card hover-card border-blue-200">
              <div className="p-5 border-b text-lg font-semibold flex items-center gap-2">
                5초 <span className="text-xs font-normal text-blue-600 border border-blue-200 rounded-full px-2 py-0.5">많이 선택</span>
              </div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩500,000</div>
                <p className="mt-2 text-sm text-slate-600">자연스러운 모션과 루프가 가능한 가장 많이 선택하는 길이입니다.</p>
                <a href="#contact" className="btn mt-6 w-full">문의하기</a>
              </div>
            </div>
            <div className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold">10초</div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩1,000,000</div>
                <p className="mt-2 text-sm text-slate-600">풍부한 연출과 스토리텔링이 가능한 프리미엄 모션 배너입니다.</p>
                <a href="#contact" className="btn mt-6 w-full">문의하기</a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* PROCESS */}
      <Section id="process" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">Process</span>
          <h3 className="mt-3 text-3xl font-extrabold">진행 절차</h3>
          <p className="mt-2 text-slate-600">위치 선정부터 AR 노출까지, 복잡한 과정은 저희가 처리합니다.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-5 gap-4">
          {[
            { n: 1, t: "위치 · 목적 상담",   d: "원하는 위치, 활용 목적, 예산을 편하게 공유해주세요." },
            { n: 2, t: "위치 확정 및 계약",   d: "GPS 좌표를 확정하고 5년 독점 운영 계약을 체결합니다." },
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

      {/* CONTACT */}
      <Section id="contact" className="py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="pill">Contact</span>
            <h3 className="mt-3 text-3xl font-extrabold">무료 상담 문의</h3>
            <p className="mt-2 text-slate-600">어떤 위치에, 어떤 목적으로 활용하고 싶은지 편하게 알려주세요. 빠르게 연락드립니다.</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> 010-3653-1987</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> contexcorp@gmail.com</div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <a href="https://contexcorp.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  https://contexcorp.com
                </a>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold">문의하기</div>
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
              <p className="text-sm text-slate-600 mt-2">콘텐츠 테크 익스피리언스<br/>위치 기반 AR 광고 대행</p>
            </div>
            <div className="text-sm">
              <div className="font-semibold mb-2">사업자 정보</div>
              <p>상호 : 콘텍스</p>
              <p>사업자등록번호 : 181-48-00499</p>
              <p>통신판매업 신고번호 : 제2021-고양일산서-0031호</p>
              <p>개인정보처리 담당자 : 홍정민</p>
              <p>대표 : 홍정민</p>
            </div>
            <div className="text-sm">
              <div className="font-semibold mb-2">정책</div>
              <a href="#" className="block hover:underline">서비스 이용 계약서(요청 시 제공)</a>
              <a href="/privacy" className="block hover:underline">개인정보 처리방침</a>
            </div>
          </div>
          <div className="container text-xs text-slate-500 mt-6">© {new Date().getFullYear()} CONTEX. All rights reserved.</div>
        </Section>
      </footer>
    </div>
  );
}
