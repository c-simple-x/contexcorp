import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const scriptUrl = process.env.NEXT_PUBLIC_CONTEX_APPSCRIPT_URL!;
    const token = process.env.NEXT_PUBLIC_CONTEX_FORM_TOKEN!;

    if (!scriptUrl || !token) {
      console.error("❌ Missing environment variables");
      return NextResponse.json({ ok: false, error: "missing env" }, { status: 500 });
    }

    // 전송할 데이터 구성
    const formData = new URLSearchParams({
      company: body.company || "",
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
      message: body.message || "",
      source: body.source || "web",
      token,
      origin: process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://www.contexcorp.com",
    });

    // Google Apps Script 호출
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ GAS request failed:", text);
      return NextResponse.json({ ok: false, error: "GAS request failed" }, { status: 500 });
    }

    const text = await res.text();
    return NextResponse.json({ ok: true, gasRaw: text });
  } catch (e) {
    console.error("❌ Route error:", e);
    return NextResponse.json({ ok: false, error: "route exception" }, { status: 500 });
  }
}
