'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setOk(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Turnstile 토큰 읽기 (자동 생성되는 hidden input)
    const captcha = (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement)?.value || '';

    const payload = {
      company: String(fd.get('company') || ''),
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      message: String(fd.get('message') || ''),
      source: 'web',
      captcha, // ← 추가
    };

    // 간단 유효성
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(payload.email)) {
      setLoading(false);
      setOk(false);
      return;
    }

    // 허니팟(봇 방지)
    if (String(fd.get('homepage') || '').trim() !== '') {
      setLoading(false);
      setOk(true);
      form.reset();
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({ ok: res.ok }));
      const success = !!(data && (data as any).ok);
      setOk(success);
      if (success) form.reset();
    } catch {
      setOk(false);
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
      <textarea name="message" placeholder="요청 내용 (위치 좌표, 기간, 예산 등)" rows={5} className="textarea" />

      {/* Turnstile 위젯 */}
      <div
        className="cf-turnstile mt-1"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-theme="light"
      ></div>

      {/* 허니팟(봇 방지) */}
      <input type="text" name="homepage" className="hidden" tabIndex={-1} autoComplete="off" />

      <button disabled={loading} className="btn">
        {loading ? '전송 중…' : '문의 보내기'}
      </button>

      {ok === true && <p className="text-sm text-green-600">접수되었습니다. 빠르게 연락드릴게요!</p>}
      {ok === false && <p className="text-sm text-red-600">전송 실패. 이메일로 연락 부탁드립니다.</p>}
    </form>
  );
}
