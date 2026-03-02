"use client";

import { useState } from "react";

export type ClientInfo = {
  client_type: "individual" | "business";
  name: string;
  company: string;
  id_number: string;
  email: string;
  phone: string;
  address: string;
  agree: boolean;
};

type Props = {
  onNext: (info: ClientInfo) => void;
};

function formatKrPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

function formatResidentId(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 6) return digits;
  return digits.slice(0, 6) + "-" + digits.slice(6, 13);
}

function formatBizNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 10)}`;
}

export default function StepInfo({ onNext }: Props) {
  const [type, setType] = useState<"individual" | "business">("business");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("이름을 입력해주세요.");
    if (type === "business" && !company.trim()) return setError("상호를 입력해주세요.");
    if (!idNumber.trim()) return setError(type === "individual" ? "주민등록번호를 입력해주세요." : "사업자등록번호를 입력해주세요.");
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) return setError("이메일 형식을 확인해주세요.");
    if (!phone.trim()) return setError("전화번호를 입력해주세요.");
    if (!address.trim()) return setError("주소를 입력해주세요.");
    if (!agree) return setError("개인정보 수집에 동의해주세요.");

    onNext({ client_type: type, name, company, id_number: idNumber, email, phone, address, agree });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* 고객 유형 */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">고객 유형</label>
        <div className="flex gap-4">
          {(["business", "individual"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} />
              <span className="text-sm">{t === "business" ? "사업자" : "개인"}</span>
            </label>
          ))}
        </div>
      </div>

      {type === "business" && (
        <input
          className="input"
          placeholder="상호명 *"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
      )}

      <input
        className="input"
        placeholder={type === "business" ? "대표자명 *" : "성명 *"}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div>
        <input
          className="input"
          placeholder={type === "individual" ? "주민등록번호 * (예: 000000-0000000)" : "사업자등록번호 * (예: 000-00-00000)"}
          value={idNumber}
          inputMode="numeric"
          onChange={(e) => setIdNumber(type === "individual" ? formatResidentId(e.target.value) : formatBizNumber(e.target.value))}
          maxLength={type === "individual" ? 14 : 12}
          required
        />
        <p className="text-xs text-slate-500 mt-1">
          {type === "individual"
            ? "주민등록번호는 AES-256으로 암호화되어 저장됩니다."
            : "사업자등록번호는 암호화되어 저장됩니다."}
        </p>
      </div>

      <input
        className="input"
        type="email"
        placeholder="이메일 * (계약서 수신용)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="input"
        placeholder="전화번호 *"
        inputMode="numeric"
        value={phone}
        onChange={(e) => setPhone(formatKrPhone(e.target.value))}
        maxLength={13}
        required
      />

      <input
        className="input"
        placeholder="주소 *"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />

      <label className="flex items-start gap-2 cursor-pointer text-sm text-slate-700">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        <span>
          계약 체결 목적의 개인정보(성명, 연락처, 식별번호, 주소) 수집·이용에 동의합니다. (필수)
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button className="btn">다음 단계 →</button>
    </form>
  );
}
