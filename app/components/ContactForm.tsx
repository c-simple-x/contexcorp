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

    const payload = {
      company: String(fd.get('company') || ''),
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      message: String(fd.get('message') || ''),
      source: 'web',
      token: process.env.NEXT_PUBLIC_CONTEX_FORM_TOKEN,
      origin: window.location.origin,
    };

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_CONTEX_APPSCRIPT_URL as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
      });
      const data = await res.json();
      setOk(data.ok);
      if (data.ok) form.reset();
    } catch (e) {
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
      {/* 허니팟(봇 방지) */}
      <input type="text" name="homepage" className="hidden" tabIndex={-1} autoComplete="off" />
      <button disabled={loading} className="btn">{loading ? '전송 중…' : '문의 보내기'}</button>
      {ok === true && <p className="text-sm text-green-600">접수되었습니다. 빠르게 연락드릴게요!</p>}
      {ok === false && <p className="text-sm text-red-600">전송 실패. 이메일로 연락 부탁드립니다.</p>}
    </form>
  );
}
