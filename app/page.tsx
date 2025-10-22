"use client";

import {
  MapPin, ShieldCheck, Sparkles, Rocket, Building2, FileText,
  Phone, Mail, Link as LinkIcon, CheckCircle2, ArrowRight
} from "lucide-react";
import ContactForm from "./components/ContactForm";
import { useState } from "react";

function Section({ id, className = "", children }:{
  id?: string; className?: string; children: React.ReactNode;
}) {
  return <section id={id} className={`container ${className}`}>{children}</section>;
}

/** ─────────────────────────────────────────────────────────
 * 온라인 계약 시작 폼 (프론트 섹션용)
 * /api/contracts (서버 라우트)로 POST 전송
 *  - 필수: 회사명, 담당자명, 이메일(영문만), 연락처(자동 010-0000-0000 포맷), 프로젝트명
 *  - 선택: 범위(체크박스), 예산, 시작일, 비고
 *  - 약관 동의 체크
 * 서버 응답이 { ok:true, sign_url, id } 형태라면 링크 버튼 노출
 * ───────────────────────────────────────────────────────── */
function ContractStartForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signUrl, setSignUrl] = useState<string | null>(null);

  function formatPhone(raw: string) {
    // 숫자만
    const d = raw.replace(/\D/g, "");
    if (d.startsWith("02")) {
      // 02-xxxx-xxxx
      if (d.length <= 2) return d;
      if (d.length <= 5) return d.replace(/(\d{2})(\d{0,3})/, "$1-$2");
      if (d.length <= 9) return d.replace(/(\d{2})(\d{0,4})(\d{0,4})/, "$1-$2-$3");
      return d.slice(0,10).replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    // 휴대폰 010-xxxx-xxxx
    if (d.length <= 3) return d;
    if (d.length <= 7) return d.replace(/(\d{3})(\d{0,4})/, "$1-$2");
    return d.slice(0,11).replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setError(null);
    setSignUrl(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      company: String(fd.get("company") || "").trim(),
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      project_title: String(fd.get("project_title") || "").trim(),
      scope: (fd.getAll("scope") as string[]), // 체크박스 배열
      budget: String(fd.get("budget") || "").trim(),
      start_date: String(fd.get("start_date") || "").trim(),
      notes: String(fd.get("notes") || "").trim(),
      accept: fd.get("accept") === "on",
      source: "contract_form"
    };

    // 클라이언트 유효성 검사
    if (!payload.company || !payload.name || !payload.project_title) {
      setLoading(false); setOk(false); setError("필수 항목을 입력해 주세요."); return;
    }
    // 이메일: 영문/숫자/기호만 허용 (국문/특수유니코드 불가)
    const emailAscii = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(payload.email);
    if (!emailAscii) {
      setLoading(false); setOk(false); setError("이메일은 영문 기반 주소만 입력해 주세요."); return;
    }
    // 연락처 포맷: 숫자와 하이픈만 허용
    if (!/^[0-9-]+$/.test(payload.phone) || payload.phone.length < 9) {
      setLoading(false); setOk(false); setError("연락처를 올바른 형식(예: 010-1234-5678)으로 입력해 주세요."); return;
    }
    if (!payload.accept) {
      setLoading(false); setOk(false); setError("계약 진행을 위해 약관 동의가 필요합니다."); return;
    }

    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setOk(false);
        setError(data?.error || "서버 처리에 실패했습니다.");
      } else {
        setOk(true);
        if (data.sign_url) setSignUrl(String(data.sign_url));
        form.reset();
      }
    } catch (err) {
      setOk(false);
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid md:grid-cols-2 gap-3">
        <input name="company" className="input" placeholder="회사명 *" required />
        <input name="name" className="input" placeholder="담당자명 *" required />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {/* 이메일: 영문만 */}
        <input
          name="email"
          type="email"
          className="input"
          placeholder="이메일 (영문만) *"
          required
          pattern="[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}"
          title="영문 기반 이메일만 입력해 주세요 (예: user@example.com)"
        />
        {/* 연락처: 자동 하이픈 */}
        <input
          name="phone"
          className="input"
          placeholder="연락처 (예: 010-1234-5678) *"
          required
          onChange={(e)=>{ e.currentTarget.value = formatPhone(e.currentTarget.value); }}
          inputMode="numeric"
        />
      </div>

      <input name="project_title" className="input" placeholder="프로젝트명/계약명 *" required />

      {/* 범위(체크박스) */}
      <div className="card p-4">
        <div className="text-sm font-semibold mb-2">진행 범위(복수 선택 가능)</div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="scope" value="AR 위치형 배너" /> AR 위치형 배너
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="scope" value="3D 이동형 배너" /> 3D 이동형 배너
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="scope" value="콘텐츠 제작" /> 콘텐츠 제작
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="scope" value="광고·마케팅 집행" /> 광고·마케팅 집행
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="scope" value="판매·유통 지원" /> 판매·유통 지원
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <input name="budget" className="input" placeholder="예산(선택, 숫자/문자 자유 입력)" />
        <input name="start_date" type="date" className="input" placeholder="희망 시작일(선택)" />
        <input name="notes" className="input" placeholder="비고(선택)" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="accept" /> 상기 내용으로 온라인 계약 생성을 진행하는 데 동의합니다.
      </label>

      <button className="btn" disabled={loading}>
        {loading ? "계약 생성 중…" : "온라인 계약 생성"}
      </button>

      {ok === true && (
        <div className="text-sm text-green-600">
          계약 생성 완료! {signUrl ? (
            <a href={signUrl} className="underline ml-1" target="_blank" rel="noopener noreferrer">계약서 작성/서명 열기</a>
          ) : "서버에서 계약 링크를 반환하지 않았습니다."}
        </div>
      )}
      {ok === false && <div className="text-sm text-red-600">{error || "계약 생성에 실패했습니다."}</div>}
    </form>
  );
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
            <a className="navlink" href="#contract-start">계약</a>
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

            {/* 미리보기 카드 - 이미지 삽입 */}
            <div className="card p-6">
              <div className="rounded-xl h-64 grid place-items-center border bg-white overflow-hidden">
                <img
                  src="/banner-preview.png"
                  alt="AR 배너 미리보기"
                  className="w-full h-full object-cover"
                />
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <li className="bullet"><CheckCircle2 className="icon" /> 최초 1회 무료 세팅</li>
                <li className="bullet"><CheckCircle2 className="icon" /> 5년간 위치 독점</li>
                <li className="bullet"><CheckCircle2 className="icon" /> 서면 변경 반영</li>
                <li className="bullet"><CheckCircle2 className="icon" /> 운영 모니터링</li>
              </ul>
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border text-xs">
                  <MapPin className="h-3.5 w-3.5" /> GPS 정밀 노출
                </div>
                <h3 className="text-lg font-semibold mt-2">AR 배너 미리보기</h3>
                <p className="text-sm text-slate-600 mt-1">지정 좌표에 정확히 고정되는 브랜드 배너</p>
              </div>
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
              <div className="text-3xl font-extrabold">₩500,000</div>
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
              <div className="text-3xl font-extrabold">₩20,000 <span className="text-base font-medium">/ 회</span></div>
              <p className="mt-2 text-sm text-slate-600">고객이 변경 내용을 서면으로 직접 전달</p>
              <a href="#contact" className="btn mt-6 w-full">변경 요청</a>
            </div>
          </div>

          <div className="card hover-card">
            <div className="p-5 border-b text-lg font-semibold">디자인 제작 의뢰</div>
            <div className="p-5">
              <div className="text-3xl font-extrabold">₩100,000 <span className="text-base font-medium">/ 회</span></div>
              <p className="mt-2 text-sm text-slate-600">콘텐츠 기획/디자인 포함 맞춤 제작</p>
              <a href="#contact" className="btn mt-6 w-full">제작 의뢰</a>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold">3D 이동형 배너 제작</div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩300,000 <span className="text-base font-medium">/ 회</span></div>
                <p className="mt-2 text-sm text-slate-600">AR 공간 이동/회전/효과 구현</p>
                <a href="#contact" className="btn mt-6 w-full">3D 제작 문의</a>
              </div>
            </div>
            <div className="card hover-card">
              <div className="p-5 border-b text-lg font-semibold">3D 배너 교체</div>
              <div className="p-5">
                <div className="text-3xl font-extrabold">₩60,000 <span className="text-base font-medium">/ 회</span></div>
                <p className="mt-2 text-sm text-slate-600">기존 3D 소재 교체</p>
                <a href="#contact" className="btn mt-6 w-full">교체 요청</a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CONTRACT START (신규 섹션) */}
      <Section id="contract-start" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="pill">Contract</span>
          <h3 className="mt-3 text-3xl font-extrabold">온라인 계약 시작</h3>
          <p className="mt-2 text-slate-600">아래 정보를 작성하면 전자계약 링크를 생성해 드립니다.</p>
        </div>
        <div className="mt-8 card p-6">
          <ContractStartForm />
          <p className="text-xs text-slate-500 mt-3">* 제출 후 생성된 링크에서 계약서 내용을 검토·서명하실 수 있습니다.</p>
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
            <div className="p-5 border-b text-lg font-semibold">프로젝트 문의하기</div>
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
              <p className="text-sm text-slate-600 mt-2">AR·콘텐츠·마케팅 종합 솔루션</p>
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
          <div className="container text-xs text-slate-500">© {new Date().getFullYear()} CONTEX. All rights reserved.</div>
        </Section>
      </footer>
    </div>
  );
}
