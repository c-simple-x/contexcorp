import { Globe2, MapPin, BadgeCheck, Sparkles, CheckCircle2, Rocket, Building2, FileText, Phone, Mail, Link as LinkIcon } from "lucide-react";
import ContactForm from "./components/ContactForm";

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return <section id={id} className={`container ${className}`}>{children}</section>;
}

export default function Page() {
  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b backdrop-blur bg-white/70">
        <div className="container h-16 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2 font-bold">
            <div className="h-7 w-7 rounded-xl bg-blue-500/10 grid place-items-center">
              <Globe2 className="h-4 w-4 text-blue-600" />
            </div>
            <span>CONTEX <span className="hidden sm:inline">Corp.</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#services" className="hover:text-blue-600">서비스</a>
            <a href="#ar" className="hover:text-blue-600">AR 광고</a>
            <a href="#pricing" className="hover:text-blue-600">요금</a>
            <a href="#process" className="hover:text-blue-600">진행절차</a>
            <a href="#contact" className="hover:text-blue-600">문의</a>
          </nav>
          <a href="#contact" className="btn">상담 요청</a>
        </div>
      </header>

      {/* Hero */}
      <div id="hero" className="pt-16 pb-10">
        <Section>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="pill">주식회사 콘텍스 (개인사업자: 콘텍스)</span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
                현실과 디지털을 잇는 <span className="text-blue-600">AR·콘텐츠·마케팅</span>
              </h1>
              <p className="mt-4 text-gray-600 leading-relaxed">
                CONTEX는 AR 위치형 광고와 3D 이동형 배너를 기반으로, 콘텐츠 제작부터 광고·마케팅, 판매·유통까지 한 번에 해결하는 종합 솔루션을 제공합니다.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="#ar" className="btn">AR 광고 살펴보기</a>
                <a href="#pricing" className="btn">요금표 보기</a>
              </div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {["AR 배너", "3D 배너", "콘텐츠 제작", "광고/유통 대행"].map((t) => (
                  <div key={t} className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-blue-600"/><span>{t}</span></div>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <div className="rounded-2xl h-64 bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent grid place-items-center">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border text-xs mb-3">
                    <MapPin className="h-3.5 w-3.5"/> GPS 정밀 노출
                  </div>
                  <h3 className="text-xl font-semibold">AR 배너 미리보기</h3>
                  <p className="text-sm text-gray-600 mt-1">지정 좌표에 정확히 띄워지는 브랜드 배너</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600"/> 오차 ±2m 내 목표지점</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600"/> 5년간 위치 독점권</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600"/> 최초 1회 무료 세팅</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600"/> 디자인 교체 간편</div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Services */}
      <Section id="services" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">Services</span>
          <h2 className="mt-3 text-3xl font-bold">콘텐츠 · 광고 · 유통까지 한 번에</h2>
          <p className="mt-2 text-gray-600">AR 광고를 중심으로 기획-제작-집행-유통까지 전 과정을 통합 제공합니다.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4"/> AR 광고</div>
            <div className="p-5 text-sm text-gray-600">GPS 기반 AR 위치형 배너 및 3D 이동형 배너. 지정 좌표 독점 운영.</div>
          </div>
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold flex items-center gap-2"><FileText className="h-4 w-4"/> 콘텐츠 제작</div>
            <div className="p-5 text-sm text-gray-600">브랜드 영상/디자인/카피 제작. 제작 의뢰 시 합리적 견적 제공.</div>
          </div>
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold flex items-center gap-2"><Rocket className="h-4 w-4"/> 광고·마케팅 대행</div>
            <div className="p-5 text-sm text-gray-600">온라인 매체 기획/집행/리포팅. 성과 중심의 퍼포먼스 운용.</div>
          </div>
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold flex items-center gap-2"><Building2 className="h-4 w-4"/> 판매·유통 지원</div>
            <div className="p-5 text-sm text-gray-600">커머스 셋업, 상세페이지, 입점/물류 컨설팅까지 연계.</div>
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section id="pricing" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">Pricing</span>
          <h3 className="mt-3 text-3xl font-bold">투명한 요금 정책</h3>
          <p className="mt-2 text-gray-600">장기 독점 운영 + 합리적 교체/제작 비용으로 예산을 예측하세요.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {t:'AR 위치형 배너 (5년)', p:'₩550,000', f:['최초 1회 무료 세팅','좌표 독점 운영권','GPS 오차 ±2m']},
          ].map((c)=> (
            <div className="card" key={c.t}>
              <div className="p-5 border-b text-lg font-semibold">{c.t}</div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">{c.p}</div>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {c.f.map(x=> <li key={x} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-blue-600"/>{x}</li>)}
                </ul>
                <a href="#contact" className="btn mt-6 w-full">이 플랜 상담</a>
              </div>
            </div>
          ))}

          {/* 변경/제작/3D */}
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold">디자인/문구 변경</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩22,000 <span className="text-base font-medium">/ 회</span></div>
              <p className="mt-2 text-sm text-gray-600">고객이 변경 내용을 서면으로 직접 전달</p>
              <a href="#contact" className="btn mt-6 w-full">변경 요청</a>
            </div>
          </div>
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold">디자인 제작 의뢰</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩110,000 <span className="text-base font-medium">/ 회</span></div>
              <p className="mt-2 text-sm text-gray-600">콘텐츠 기획/디자인 포함 맞춤 제작</p>
              <a href="#contact" className="btn mt-6 w-full">제작 의뢰</a>
            </div>
          </div>
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold">3D 이동형 배너 제작</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩330,000 <span className="text-base font-medium">/ 회</span></div>
              <p className="mt-2 text-sm text-gray-600">AR 공간 이동/회전/효과 구현</p>
              <a href="#contact" className="btn mt-6 w-full">3D 제작 문의</a>
            </div>
          </div>
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold">3D 배너 교체</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩55,000 <span className="text-base font-medium">/ 회</span></div>
              <p className="mt-2 text-sm text-gray-600">기존 3D 소재 교체</p>
              <a href="#contact" className="btn mt-6 w-full">교체 요청</a>
            </div>
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section id="process" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">Process</span>
          <h3 className="mt-3 text-3xl font-bold">진행 절차</h3>
          <p className="mt-2 text-gray-600">견적·계약부터 운영까지 5단계로 신속하게 진행합니다.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-5 gap-4">
          {[
            {n:1,t:"상담/요구사항 정리",d:"목표, 위치 좌표, 예산 확인"},
            {n:2,t:"견적/계약",d:"AR 좌표 독점권 포함"},
            {n:3,t:"세팅/제작",d:"초기 세팅(무료) + 필요 시 디자인 제작"},
            {n:4,t:"검수/반영",d:"증빙 가능한 서면 요청 기반 변경"},
            {n:5,t:"운영/리포트",d:"노출 안정성 점검 및 변경 요청 반영"},
          ].map((s)=> (
            <div className="card" key={s.n}>
              <div className="p-5 border-b text-lg font-semibold">{s.n}. {s.t}</div>
              <div className="p-5 text-sm text-gray-600">{s.d}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" className="py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="pill">Contact</span>
            <h3 className="mt-3 text-3xl font-bold">상담 및 계약 문의</h3>
            <p className="mt-2 text-gray-600">아래 양식을 작성해 주시면 빠르게 회신드립니다. 실제 운영 정보로 교체해 주세요.</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4"/> 010-0000-0000</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4"/> hello@contexcorp.com</div>
              <div className="flex items-center gap-2"><LinkIcon className="h-4 w-4"/> contexcorp.com</div>
            </div>
          </div>
          <div className="card">
            <div className="p-5 border-b text-lg font-semibold">프로젝트 문의하기</div>
            <div className="p-5">
              <ContactForm />
              <p className="text-xs text-gray-500 mt-3">* 모든 금액은 부가세 포함. 작업은 비용 선납 확인 후 진행됩니다.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t bg-white/60 mt-10">
        <Section className="py-10">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div>
              <div className="font-bold text-lg">CONTEX Corp.</div>
              <p className="text-sm text-gray-600 mt-2">현실과 디지털을 잇는 AR·콘텐츠·마케팅 솔루션</p>
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
          <div className="container text-xs text-gray-500">© {new Date().getFullYear()} CONTEX. All rights reserved.</div>
        </Section>
      </footer>
    </div>
  );
}
