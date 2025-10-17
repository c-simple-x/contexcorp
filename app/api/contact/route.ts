// app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      company = "",
      name = "",
      email = "",
      phone = "",
      message = "",
      source = "web",
    } = await req.json();

    const url = process.env.NEXT_PUBLIC_CONTEX_APPSCRIPT_URL;
    const token = process.env.NEXT_PUBLIC_CONTEX_FORM_TOKEN;

    if (!url || !token) {
      return NextResponse.json({ ok: false, error: "env_missing" }, { status: 500 });
    }

    const body = new URLSearchParams({
      company, name, email, phone, message, source,
      token,
      origin: "http://localhost:3000", // 로컬 테스트 중이므로
    });

    const res = await fetch(url, { method: "POST", body });
    const text = await res.text();

    // GAS가 ok:false를 주거나 text/plain일 수 있음 → 안전 파싱
    let data: any = {};
    try { data = JSON.parse(text); } catch { data = {}; }

    if (!res.ok || data.ok === false) {
      return NextResponse.json({
        ok: false,
        error: data.error || "gas_error",
        status: res.status,
        gasRaw: text, // 디버그용: 무슨 응답이 왔는지 보이게
      }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "server_error" }, { status: 500 });
  }
}
