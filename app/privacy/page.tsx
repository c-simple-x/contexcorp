export const metadata = {
  title: "개인정보 처리방침 | CONTEX",
  description: "CONTEX 개인정보 처리방침",
};

export default function PrivacyPage() {
  return (
    <main className="container py-12 prose max-w-3xl">
      <h1 className="text-3xl font-bold">개인정보 처리방침</h1>
      <p className="text-sm text-gray-500">시행일자: 2025-10-18</p>

      <h2>1. 수집하는 개인정보 항목 및 방법</h2>
      <p>당사는 웹사이트 내 문의 접수 시 다음 항목을 수집합니다.</p>
      <ul>
        <li>필수: 회사/이름, 담당자명, 이메일</li>
        <li>선택: 연락처, 문의 내용</li>
        <li>자동수집: 접속 도메인, Turnstile 검증값 등</li>
      </ul>
      <p>수집 방법: 이용자가 문의 양식을 제출할 때 Google Apps Script를 통해 Google 스프레드시트로 저장됩니다.</p>

      <h2>2. 이용 목적</h2>
      <ul>
        <li>문의 응대 및 상담 진행</li>
        <li>서비스 제공을 위한 고객 관리</li>
        <li>서비스 개선을 위한 통계분석(개인 식별 불가 형태)</li>
      </ul>

      <h2>3. 보유 및 이용 기간</h2>
      <p>관계 법령이 정하는 기간 또는 이용자의 삭제 요청 시까지 보관하며, 목적 달성 후에는 지체 없이 파기합니다.</p>

      <h2>4. 제3자 제공 및 처리위탁</h2>
      <p>당사는 원칙적으로 개인정보를 외부에 제공하지 않습니다. 다만 법령에 의한 경우에 한해 제공될 수 있습니다.</p>
      <p>처리위탁: 서비스 운영을 위해 다음 업무를 위탁할 수 있으며, 수탁사는 개인정보 보호 관련 법령을 준수합니다.</p>
      <ul>
        <li>인프라/호스팅: Vercel</li>
        <li>데이터 저장: Google 스프레드시트 / Google Apps Script</li>
        <li>스팸 방지: Cloudflare Turnstile</li>
      </ul>

      <h2>5. 정보주체의 권리</h2>
      <p>이용자는 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지를 요청할 수 있으며, 당사는 지체 없이 조치합니다.</p>

      <h2>6. 파기 절차 및 방법</h2>
      <p>보유기간 경과 또는 처리 목적 달성 시, 전자적 파일은 복구 불가능한 방법으로 안전하게 삭제합니다.</p>

      <h2>7. 안전성 확보 조치</h2>
      <ul>
        <li>접근 통제 및 권한 관리</li>
        <li>전송 구간 암호화(HTTPS)</li>
        <li>스팸/봇 차단(Cloudflare Turnstile)</li>
      </ul>

      <h2>8. 개인정보 보호책임자</h2>
      <p>
        책임자: 홍정민<br />
        이메일: hello@contexcorp.com
      </p>

      <h2>9. 고지의 의무</h2>
      <p>법령·정책 또는 보안기술 변경에 따라 내용이 추가·삭제 및 수정될 수 있으며, 변경 시 웹사이트 공지사항을 통해 고지합니다.</p>
    </main>
  );
}
