import Header from "../components/Header";

export const metadata = {
  title: "개인정보 처리방침 | CONTEX Corp.",
  description: "CONTEX Corp. 개인정보 처리방침",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
    <main className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-extrabold mb-1">개인정보 처리방침</h1>
      <p className="text-sm text-slate-500 mb-10">시행일자: 2025-10-18 · 최종 수정: 2026-03-01</p>

      <p className="text-sm text-slate-700 mb-8">
        CONTEX Corp.(이하 "회사")은 개인정보 보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등
        관련 법령을 준수하며, 이용자의 개인정보를 소중히 보호합니다.
        본 방침은 회사 웹사이트 및 전자계약 서비스에 적용됩니다.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b">1. 수집하는 개인정보 항목 및 수집 방법</h2>
        <h3 className="font-semibold text-slate-700 mt-4 mb-2">① 문의 접수 시</h3>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>필수: 회사/이름, 담당자명, 이메일 주소</li>
          <li>선택: 연락처, 문의 내용</li>
          <li>자동수집: 접속 IP, 브라우저 정보, Cloudflare Turnstile 검증값</li>
        </ul>
        <p className="text-sm text-slate-600 mt-2">
          수집 방법: 이용자가 문의 양식을 제출할 때 Google Apps Script를 통해 Google 스프레드시트에 저장됩니다.
        </p>

        <h3 className="font-semibold text-slate-700 mt-4 mb-2">② 전자계약 체결 시</h3>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>개인: 성명, 주민등록번호, 이메일 주소, 전화번호, 주소</li>
          <li>사업자: 상호(법인명), 대표자명, 사업자등록번호, 이메일 주소, 전화번호, 주소</li>
          <li>서명 이미지(손글씨 전자서명 데이터)</li>
          <li>자동수집: 서명 시 IP 주소, 브라우저 정보(User-Agent), 서명 일시</li>
        </ul>
        <p className="text-sm text-slate-600 mt-2">
          수집 방법: 전자계약 폼 제출 시 암호화 후 Supabase(PostgreSQL) 데이터베이스에 저장됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b">2. 개인정보 수집·이용 목적</h2>
        <h3 className="font-semibold text-slate-700 mt-4 mb-2">① 문의 접수</h3>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>문의 응대 및 상담 진행</li>
          <li>서비스 제공을 위한 고객 관리</li>
        </ul>
        <h3 className="font-semibold text-slate-700 mt-4 mb-2">② 전자계약</h3>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>계약 당사자 본인 확인 및 계약 체결</li>
          <li>PDF 계약서 생성 및 이메일 발송</li>
          <li>입금 안내 및 대금 정산</li>
          <li>계약 이행 및 사후 고객 관리</li>
          <li>법령에 따른 계약 기록 보관</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b">3. 개인정보 보유 및 이용 기간</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-3 py-2 border font-semibold">수집 목적</th>
                <th className="text-left px-3 py-2 border font-semibold">보유 기간</th>
                <th className="text-left px-3 py-2 border font-semibold">근거</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr>
                <td className="px-3 py-2 border">문의 응대</td>
                <td className="px-3 py-2 border">3년</td>
                <td className="px-3 py-2 border">회사 내부 정책</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border">전자계약 기록</td>
                <td className="px-3 py-2 border">계약 종료 후 5년</td>
                <td className="px-3 py-2 border">전자상거래 등에서의 소비자 보호에 관한 법률</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border">세금계산서 발행 관련</td>
                <td className="px-3 py-2 border">5년</td>
                <td className="px-3 py-2 border">국세기본법</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-slate-600 mt-3">
          보유 기간 경과 또는 처리 목적 달성 시 지체 없이 파기합니다. 이용자의 삭제 요청 시에도 동일하게 처리합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b">4. 개인정보의 암호화 처리</h2>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>주민등록번호 및 사업자등록번호: <strong>AES-256-CBC</strong> 대칭키 암호화 후 저장</li>
          <li>전송 구간: HTTPS(TLS 1.2 이상) 암호화 적용</li>
          <li>서명 이미지: 데이터베이스 접근 통제 환경에 저장</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b">5. 개인정보의 제3자 제공 및 처리위탁</h2>
        <p className="text-sm text-slate-700 mb-3">
          회사는 원칙적으로 개인정보를 외부에 제공하지 않습니다. 다만 법령에 의한 경우에 한해 제공될 수 있습니다.
        </p>
        <h3 className="font-semibold text-slate-700 mb-2">처리위탁 현황</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-3 py-2 border font-semibold">수탁사</th>
                <th className="text-left px-3 py-2 border font-semibold">위탁 업무</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr>
                <td className="px-3 py-2 border">Vercel Inc.</td>
                <td className="px-3 py-2 border">웹 서비스 호스팅 및 서버 운영</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border">Supabase Inc.</td>
                <td className="px-3 py-2 border">계약 정보 데이터베이스 저장·관리</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border">Resend Inc.</td>
                <td className="px-3 py-2 border">이메일 발송(계약서 PDF 첨부 포함)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border">Google LLC</td>
                <td className="px-3 py-2 border">문의 접수 데이터 저장(Google 스프레드시트)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border">Cloudflare Inc.</td>
                <td className="px-3 py-2 border">스팸·봇 방지(Turnstile)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-slate-600 mt-3">
          각 수탁사는 해당 법령에 따른 개인정보 보호 의무를 준수하며, 위탁받은 업무 범위를 초과하여 개인정보를 이용할 수 없습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b">6. 정보주체의 권리</h2>
        <p className="text-sm text-slate-700 mb-2">이용자는 회사에 대해 언제든지 다음 권리를 행사할 수 있습니다.</p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>개인정보 열람 요청</li>
          <li>개인정보 오류 정정 요청</li>
          <li>개인정보 삭제 요청</li>
          <li>개인정보 처리정지 요청</li>
        </ul>
        <p className="text-sm text-slate-600 mt-3">
          권리 행사는 이메일(<a href="mailto:contact@contexcorp.com" className="text-blue-600 hover:underline">contact@contexcorp.com</a>)로 요청하시면 지체 없이 조치합니다.
          단, 법령에 따라 보존이 필요한 정보는 해당 기간 동안 삭제가 제한될 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b">7. 파기 절차 및 방법</h2>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
          <li>데이터베이스 레코드: 안전한 삭제 명령(DELETE) 처리</li>
          <li>암호화 키: 별도 보안 환경에서 관리·폐기</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b">8. 안전성 확보 조치</h2>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>민감 정보(주민등록번호 등) AES-256 암호화 저장</li>
          <li>전송 구간 HTTPS 암호화</li>
          <li>관리자 접근 시 비밀번호 인증 및 접근 통제</li>
          <li>스팸·봇 차단(Cloudflare Turnstile)</li>
          <li>서비스 역할 키(Service Role Key) 서버 측 전용 사용</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b">9. 개인정보 보호책임자</h2>
        <div className="text-sm text-slate-700 space-y-1">
          <p><span className="font-semibold">책임자:</span> 홍정민 (대표)</p>
          <p><span className="font-semibold">이메일:</span> <a href="mailto:contact@contexcorp.com" className="text-blue-600 hover:underline">contact@contexcorp.com</a></p>
          <p><span className="font-semibold">전화:</span> +82-10-3653-1987</p>
        </div>
        <p className="text-sm text-slate-600 mt-3">
          개인정보 처리에 관한 불만 또는 피해구제를 원하시면 위 연락처로 문의하시거나,
          개인정보 분쟁조정위원회(www.kopico.go.kr) 또는 개인정보 침해신고센터(privacy.kisa.or.kr)에 신청하실 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b">10. 고지의 의무</h2>
        <p className="text-sm text-slate-700">
          법령·정책 또는 보안기술 변경에 따라 본 방침이 수정될 수 있으며, 변경 시 웹사이트를 통해 사전에 고지합니다.
          중요한 변경의 경우 계약 고객에게 이메일로 별도 안내드립니다.
        </p>
      </section>

      <div className="mt-10 pt-6 border-t text-xs text-slate-400">
        <p>CONTEX Corp. · 대표: 홍정민 · 이메일: contact@contexcorp.com</p>
        <p className="mt-1">본 방침은 2026년 3월 1일부터 시행됩니다.</p>
      </div>
    </main>
    </>
  );
}
