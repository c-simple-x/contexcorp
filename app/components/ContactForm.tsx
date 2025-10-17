'use client';
import { useState } from 'react';
import SuccessModal from './SuccessModal';

// ✅ 한국 전화번호 포맷 함수 (숫자만 → 010-0000-0000)
function formatKrPhone(raw: string) {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setOk(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const email = String(fd.get('email') || '');
    const emailRe = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRe.test(email)) {
      setLoading(false);
      setOk(false);
      alert('이메일은 영문으로만 입력해주세요.');
      return;
    }

    // 허니팟 방지
    if (String(fd.get('homepage') || '').trim() !== '') {
      setLoading(false);
      setOk(true);
      form.reset();
      return;
    }

    const payload = {
      company: String(fd.get('company') || ''),
      name: String(fd.get('name') || ''),
      email,
      phone,
      message: String(fd.get('message') || ''),
      source: 'web',
      captcha: (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement)?.value || '',
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({ ok: res.ok }));
      const success = !!data?.ok;
      setOk(success);
      if (success) {
        form.reset();
        setPhone('');
        setOpen(true);
      }
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

        {/* ✅ 이메일: 영문만 입력 가능 */}
        <input
          name="email"
          type="email"
          placeholder="이메일 (영문만 가능)"
          required
          className="input"
          pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
          title="이메일은 영문과 숫자로만 입력해주세요 (예: example@domain.com)"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
          }}
        />

        {/* ✅ 연락처: 숫자만 입력, 자동 하이픈 */}
        <input
          name="phone"
          placeholder="연락처 (예: 010-1234-5678)"
          className="input"
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(formatKrPhone(e.target.value))}
          maxLength={13}
          pattern="[\d\-]{9,13}"
        />

        <textarea name="message" placeholder="요청 내용 (위치 좌표, 기간, 예산 등)" rows={5} className="textarea" />

        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <div className="cf-turnstile mt-1" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-theme="light" />
        )}

        <input type="text" name="homepage" className="hidden" tabIndex={-1} autoComplete="off" />

        <button disabled={loading} className="btn">
          {loading ? '전송 중…' : '문의 보내기'}
        </button>

        {ok === true && <p className="text-sm text-green-600">접수되었습니다. 빠르게 연락드릴게요!</p>}
        {ok === false && <p className="text-sm text-red-600">전송 실패. 이메일로 연락 부탁드립니다.</p>}
      </form>

      <SuccessModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
