"use client";

import {
  MapPin, ShieldCheck, Sparkles, Rocket, Building2, FileText,
  Phone, Mail, Link as LinkIcon, CheckCircle2, ArrowRight
} from "lucide-react";
import ContactForm from "./components/ContactForm";

function Section({ id, className = "", children }:{
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
            <a className="navlink" href="#solutions">솔루션</a>
            <a className="navlink" href="#showcase">AR 프리뷰</a>
            <a className="navlink" href="#pricing">요금</a>
            <a className="navlink" href="#process">프로세스</a>
            <a className="navlink" href="#contact">문의</a>
          </nav>
          <a href="#contact" className="btn hidden sm:inline-flex">
            상담 요청 <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </header>

      {/* HERO */}
      <div id="hero" className="hero-bg">
        <Section className="py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="pill">AR·콘텐츠·마케팅 에이전시</div>
              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                좌표에 <span className="text-blue-600">정확히</span> 고정되는<br/> 위치형 <span className="text-blue-600">AR 배너</span>
              </h1>
              <p className="mt-4 text-slate-600 leading-relaxed">
                지정 좌표 독점 운영, 3D 이동형 배너, 기획·제작·집행·유통까지 한 번에.
                <br/>가격은 투명하게, 반영은 빠르게.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#showcase" className="btn">AR 미리보기</a>
                <a href="#pricing" className="btn">요금 확인</a>
              </div>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {[
                  { icon: MapPin, label: "좌표 독점권" },
                  { icon: ShieldCheck, label: "정확도 ±2m" },
                  { icon: Sparkles, label: "3D 이동 배너" },
                  { icon: CheckCircle2, label: "간편 변경" },
                ].map((f) => (
                  <div key={f.label} className="feature-chip">
                    <f.icon className="h-4 w-4 text-blue-600" /> {f.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="rounded-xl h-64 grid place-items-center border bg-white">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border text-xs mb-3">
                    <MapPin className="h-3.5 w-3.5" /> GPS 정밀 노출
                  </div>
                  <h3 className="text-xl font-semibold">AR 배너 미리보기</h3>
                  <p className="text-sm text-slate-600 mt-1">지정 좌표에 정확히 고정되는 브랜드 배너</p>
                </div>
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <li className="bullet"><CheckCircle2 className="icon" /> 최초 1회 무료 세팅</li>
                <li className="bullet"><CheckCircle2 className="icon" /> 5년간 위치 독점</li>
                <li className="bullet"><CheckCircle2 className="icon" /> 서면 변경 반영</li>
                <li className="bullet"><CheckCircle2 className="icon" /> 운영 모니터링</li>
              </ul>
            </div>
          </div>
        </Section>
      </div>

      {/* SOLUTIONS */}
      <Section id="solutions" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">Solutions</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold">AR 중심 풀스택 에이전시</h2>
          <p className="mt-2 text-slate-600">좌표 기반 AR 노출, 3D 모션 배너, 콘텐츠 제작, 매체 집행, 유통 컨설팅.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: MapPin,   title: "AR 위치형 배너", desc: "정확한 GPS 좌표에 고정 노출. 오차 ±2m, 위치 독점." },
            { icon: Sparkles, title: "3D 이동형 배너", desc: "공간 이동/회전/효과를 갖춘 3D 배너. 몰입형 경험." },
            { icon: FileText, title: "콘텐츠 제작",    desc: "브랜드 영상/디자인/카피 제작. 합리적 고정가 제공." },
            { icon: Rocket,   title: "광고·마케팅 대행", desc: "매체 전략/운영/리포팅. 성과 중심 퍼포먼스." },
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
              <div className="rounded-xl h-72 md:h-80 border bg-slate-50 grid place-items-center">
                <div className="text-center">
                  <div className="pill mb-3">Live AR Preview (샘플)</div>
                  <p className="text-sm text-slate-600">실제 캠/지도 연동 전시 데모. 브랜드 맞춤 프리뷰 제공.</p>
                </div>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="bullet"><CheckCircle2 className="icon" /> 좌표 고정: 상권·랜드마크 지정</li>
              <li className="bullet"><CheckCircle2 className="icon" /> 브랜딩 가이드 반영</li>
              <li className="bullet"><CheckCircle2 className="icon" /> 3D 이동/회전/파티클 효과</li>
              <li className="bullet"><CheckCircle2 className="icon" /> 가벼운 리소스로 빠른 로딩</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* PRICING */}
      <Section id="pricing" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">Pricing</span>
          <h3 className="mt-3 text-3xl font-extrabold">투명한 요금 정책</h3>
          <p className="mt-2 text-slate-600">장기 독점 운영 + 합리적 교체/제작 비용으로 예산 예측.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover-card">
            <div className="p-5 border-b text-lg font-semibold">AR 위치형 배너 (5년)</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩550,000</div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {["최초 1회 무료 세팅","좌표 독점 운영권","GPS 오차 ±2m"].map(x=>(
                  <li key={x} className="bullet"><CheckCircle2 className="icon" /> {x}</li>
                ))}
              </ul>
              <a href="#contact" className="btn mt-6 w-full">이 플랜 상담</a>
            </div>
          </div>

          <div className="card hover-card">
            <div className="p-5 border-b text-lg font-semibold">디자인/문구 변경</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩22,000 <span className="text-base font-medium">/ 회</span></div>
              <p className="mt-2 text-sm text-slate-600">고객이 변경 내용을 서면으로 직접 전달</p>
              <a href="#contact" className="btn mt-6 w-full">변경 요청</a>
            </div>
          </div>

          <div className="card hover-card">
            <div className="p-5 border-b text-lg font-semibold">디자인 제작 의뢰</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩110,000 <span className="text-base font-medium">/ 회</span></div>
              <p className="mt-2 text-sm text-slate-600">콘텐츠 기획/디자인 포함 맞춤 제작</p>
              <a href="#contact" className="btn mt-6 w-full">제작 의뢰</a>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold">3D 이동형 배너 제작</div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩330,000 <span className="text-base font-medium">/ 회</span></div>
                <p className="mt-2 text-sm text-slate-600">AR 공간 이동/회전/효과 구현</p>
                <a href="#contact" className="btn mt-6 w-full">3D 제작 문의</a>
              </div>
            </div>
            <div className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold">3D 배너 교체</div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩55,000 <span className="text-base font-medium">/ 회</span></div>
                <p className="mt-2 text-sm text-slate-600">기존 3D 소재 교체</p>
                <a href="#contact" className="btn mt-6 w-full">교체 요청</a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* PROCESS */}
      <Section id="process" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">Process</span>
          <h3 className="mt-3 text-3xl font-extrabold">5단계 진행 절차</h3>
          <p className="mt-2 text-slate-600">견적·계약부터 운영까지 신속하고 투명하게.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-5 gap-4">
          {[
            { n:1,t:"상담/요구사항 정리",d:"목표, 위치 좌표, 예산 확인"},
            { n:2,t:"견적/계약",d:"AR 좌표 독점권 포함"},
            { n:3,t:"세팅/제작",d:"초기 세팅(무료) + 필요 시 디자인 제작"},
            { n:4,t:"검수/반영",d:"서면 요청 기반 변경"},
            { n:5,t:"운영/리포트",d:"노출 안정성 점검 및 반영"},
          ].map(s=>(
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
            <h3 className="mt-3 text-3xl font-extrabold">상담 및 계약 문의</h3>
            <p className="mt-2 text-slate-600">아래 양식을 작성해 주세요. 접수 즉시 확인 후 회신 드립니다.</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> 010-0000-0000</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@contexcorp.com</div>
              <div className="flex items-center gap-2"><LinkIcon className="h-4 w-4" /> contexcorp.com</div>
            </div>
          </div>
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold">프로젝트 문의하기</div>
            <div className="p-5">
              <ContactForm />
              <p className="text-xs text-slate-500 mt-3">* 모든 금액은 부가세 포함. 작업은 비용 선납 확인 후 진행됩니다.</p>
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
              <p className="text-sm text-slate-600 mt-2">AR·콘텐츠·마케팅 종합 솔루션</p>
            </div>
            <div className="text-sm">
              <div className="font-semibold mb-2">사업자 정보</div>
              <p>상호: 콘텍스 (개인사업자)</p>
              <p>향후 법인 전환 표기: 주식회사 콘텍스 (CONTEX Corp.)</p>
              <p>대표: 홍정민</p>
            </div>
            <div className="text-sm">
              <div className="font-semibold mb-2">정책</div>
              <a href="#" className="block hover:underline">서비스 이용 계약서(요청 시 제공)</a>
              <a href="#" className="block hover:underline">개인정보 처리방침(작성 예정)</a>
            </div>
          </div>
          <div className="container text-xs text-slate-500">© {new Date().getFullYear()} CONTEX. All rights reserved.</div>
        </Section>
      </footer>
    </div>
  );
}
