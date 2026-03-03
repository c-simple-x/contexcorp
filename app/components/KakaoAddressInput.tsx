"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    daum: any;
  }
}

type Props = {
  onChange: (address: string) => void;
};

export default function KakaoAddressInput({ onChange }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [roadAddress, setRoadAddress] = useState("");
  const [detail, setDetail] = useState("");
  const detailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.getElementById("kakao-postcode-script")) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "kakao-postcode-script";
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  function openSearch() {
    if (!loaded || !window.daum) return;
    new window.daum.Postcode({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      oncomplete: (data: any) => {
        const addr = data.roadAddress || data.jibunAddress;
        setRoadAddress(addr);
        setDetail("");
        onChange(addr);
        setTimeout(() => detailRef.current?.focus(), 100);
      },
    }).open();
  }

  function handleDetailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const d = e.target.value;
    setDetail(d);
    onChange(d ? `${roadAddress} ${d}` : roadAddress);
  }

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <input
          className="input flex-1 bg-slate-50 cursor-default"
          placeholder="주소 찾기 버튼을 눌러주세요 *"
          value={roadAddress}
          readOnly
          tabIndex={-1}
        />
        <button
          type="button"
          className="btn shrink-0"
          onClick={openSearch}
          disabled={!loaded}
        >
          {loaded ? "주소 찾기" : "로딩 중…"}
        </button>
      </div>
      {roadAddress && (
        <input
          ref={detailRef}
          className="input"
          placeholder="상세주소 (동·호수 등, 선택)"
          value={detail}
          onChange={handleDetailChange}
        />
      )}
    </div>
  );
}
