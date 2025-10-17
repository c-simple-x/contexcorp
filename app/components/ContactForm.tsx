'use client';

import { useState } from 'react';

type ApiResponse = {
  ok: boolean;
  error?: string;
  status?: number;
  gasRaw?: string;
};

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [errorInfo, setErrorInfo] = useState<ApiResponse | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setErrorInfo(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // 클라이언트에서 수집할 값
    const payload = {
      company: String(fd.get('company') || ''),
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      message: String(fd.get('message') || ''),
      source: 'web',
    };

    try {
      // 내부 API로 전송 (서버가 GAS로 중계)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse = await res.json().catch(() => ({ ok: res.ok }));
      setOk(!!data.ok);

      if (data.ok) {
        form.reset();
      } else {
        // 실패 디버그 정보를 화면/콘솔에 표시
        setErrorInfo({
          ok: false,
          error: data.error || 'unknown',
          status: data.status ?? (!res.ok ? res.status : undefined),
          gasRaw: data.gasRaw,
        });
        console.log('Contact API error:', { resStatus: res.status, data });
        alert(
          `전송 실패: ${data.error || 'unknown'}${
            data.status ? ` (status: ${data.status})` : ''
          }\n\n상세 응답(gasRaw):\n${(data.gasRaw || '').slice(0, 500)}`
        );
      }
    } catch (err: any) {
      setOk(false);
      setErrorInfo({ ok: false, error: err?.message || 'network_error' });
      console.error('Contact API exception:', err);
      alert(`전송 실패: ${err?.message || 'network_error'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <input name="company" placeholder="회사/이름" required className="input" />
      <input name="name" placeholder="담당자명" required className="input" />
      <input name="email" type="email" placeholder="이메일" required className="input" />
      <input name="phone" placeholder="연락처" className="input" />
      <textarea
        name="message"
        placeholder="요청 내용 (위치 좌표, 기간, 예산 등)"
        rows={5}
        className="textarea"
      />

      {/* 허니팟(봇 방지) */}
      <input type="text" name="homepage" className="hidden" tabIndex={-1} autoComplete="off" />

      <button disabled={loading} className="btn">
        {loading ? '전송 중…' : '문의 보내기'}
      </button>

      {/* 성공/실패 메시지 */}
      {ok === true && (
        <p className="text-sm text-green-600">접수되었습니다. 빠르게 연락드릴게요!</p>
      )}
      {ok === false && (
        <p className="text-sm text-red-600">전송 실패. 이메일로 연락 부탁드립니다.</p>
      )}

      {/* 디버그 패널 (실패 시 상세 사유 표시) */}
      {errorInfo && (
        <div className="text-xs mt-2 rounded-md border p-3 bg-red-50 border-red-200 text-red-700 whitespace-pre-wrap">
          <div className="font-semibold mb-1">디버그 정보</div>
          {errorInfo.error && <div>error: {errorInfo.error}</div>}
          {typeof errorInfo.status !== 'undefined' && <div>status: {errorInfo.status}</div>}
          {errorInfo.gasRaw && (
            <details className="mt-1">
              <summary>GAS 원문 응답 보기</summary>
              <pre className="mt-1 overflow-x-auto">{errorInfo.gasRaw}</pre>
            </details>
          )}
        </div>
      )}
    </form>
  );
}
