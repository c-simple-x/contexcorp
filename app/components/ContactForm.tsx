'use client';
import { useState } from 'react';
import SuccessModal from './SuccessModal';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false); // ← 추가

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setOk(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      company: String(fd.get('company') || ''),
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      message: String(fd.get('message') || ''),
      source: 'web',
      // Turnstile 쓰는 중이면 captcha도 포함 (없으면 자동 무시됨)
      captcha: (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement)?.value || '',
    };

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(payload.email)) { setLoading(false); setOk(false); return; }
    if (String(fd.get('homepage') || '').trim() !== '') { setLoading(false); setOk(true); form.reset(); return; }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({ ok: res.ok }));
      const success = !!data?.ok;
      setOk(success);
      if (success) { console.log('[ContactForm] success → open modal'); form.reset(); setOpen(true); } // ← 성공 시 모달 ON
    } catch {
      setOk(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input name="company" placeholder="회사/이름" required className="input" />
        <input name="name" placeholder="담당자명" required className="input" />
        <input name="email" type="email" placeholder="이메일" required className="input" />
        <input name="phone" placeholder="연락처" className="input" />
        <textarea name="message" placeholder="요청 내용 (위치 좌표, 기간, 예산 등)" rows={5} className="textarea" />

        {/* Turnstile 위젯을 쓰는 경우 (site key 환경변수 있어야 표시됨) */}
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <div className="cf-turnstile mt-1" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-theme="light" />
        )}

        {/* 허니팟 */}
        <input type="text" name="homepage" className="hidden" tabIndex={-1} autoComplete="off" />

        <button disabled={loading} className="btn">{loading ? '전송 중…' : '문의 보내기'}</button>
        {ok === true && <p className="text-sm text-green-600">접수되었습니다. 빠르게 연락드릴게요!</p>}
        {ok === false && <p className="text-sm text-red-600">전송 실패. 이메일로 연락 부탁드립니다.</p>}
      </form>

      <SuccessModal open={open} onClose={()=>setOpen(false)} />
    </>
  );
}
