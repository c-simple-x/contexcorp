"use client";

import { CheckCircle2, Mail } from "lucide-react";

type Props = {
  email: string;
  name: string;
  price: number;
};

export default function StepComplete({ email, name, price }: Props) {
  return (
    <div className="text-center py-8 grid gap-6">
      <div className="flex justify-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">계약이 완료되었습니다!</h2>
        <p className="mt-2 text-slate-600">{name} 님, CONTEX Corp.와의 계약 체결을 환영합니다.</p>
      </div>

      <div className="card p-5 text-left grid gap-3">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">계약서 이메일 발송</p>
            <p className="text-sm text-slate-600 mt-0.5">
              <b>{email}</b> 으로 PDF 계약서와 입금 안내가 발송되었습니다.
            </p>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-sm font-semibold mb-1">입금 안내</p>
          <p className="text-sm text-slate-600">
            계약 금액 <b>₩{price.toLocaleString("ko-KR")}</b> (부가세 별도)에 대한 입금 정보는
            이메일을 확인해주세요. 입금 확인 후 작업을 시작합니다.
          </p>
        </div>

        <div className="border-t pt-3 text-sm text-slate-600">
          <p>문의: <a href="mailto:contexcorp@gmail.com" className="text-blue-600 hover:underline">contexcorp@gmail.com</a></p>
          <p>전화: +82-10-3653-1987</p>
        </div>
      </div>

      <a href="/" className="btn mx-auto">홈으로 돌아가기</a>
    </div>
  );
}
