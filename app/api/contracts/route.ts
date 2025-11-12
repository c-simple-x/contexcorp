import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// (선택) 이메일 알림
async function sendEmail(subject: string, html: string) {
  try {
    if (!process.env.RESEND_API_KEY || !process.env.ALERT_EMAIL_TO || !process.env.ALERT_EMAIL_FROM) return;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ALERT_EMAIL_FROM,
        to: [process.env.ALERT_EMAIL_TO],
        subject,
        html,
      }),
    }).then(r => r.text()).catch(()=>{});
  } catch {}
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 기존 폼 필드(페이지 그대로 사용)
    const biz_name   = String(body.biz_name || "").trim();
    const owner_name = String(body.owner_name || "").trim();
    const biz_number = String(body.biz_number || "").trim();
    const owner_phone= String(body.owner_phone || "").trim();
    const owner_email= String(body.owner_email || "").trim();

    if (!biz_name || !owner_name || !biz_number || !owner_phone || !owner_email) {
      return NextResponse.json({ ok:false, error:"missing_required" }, { status:400 });
    }
    if (!body.agree_terms || !body.agree_privacy) {
      return NextResponse.json({ ok:false, error:"must_agree" }, { status:400 });
    }

    // 기존 계산 로직 재사용 (원페이지와 동일)
    const priceMap = { ar_basic: 200000, video: 200000, ar3d: 200000 };
    const total =
      (body.item_ar_basic ? priceMap.ar_basic * (Number(body.item_ar_basic_count || 1)) : 0) +
      (body.item_video    ? priceMap.video    * (Number(body.item_video_count || 1)) : 0) +
      (body.item_ar_3d    ? priceMap.ar3d     * (Number(body.item_ar_3d_count || 1)) : 0) +
      (Number(body.order_amount) || 0);

    // 1) clients insert
    const { data: clientIns, error: clientErr } = await supabaseAdmin
      .from("clients")
      .insert([{
        company: biz_name,
        name: owner_name,
        email: owner_email,
        phone: owner_phone,
      }])
      .select("id")
      .single();

    if (clientErr || !clientIns?.id) {
      return NextResponse.json({ ok:false, error:"client_insert_failed", detail: clientErr?.message }, { status:500 });
    }

    const client_id = clientIns.id as string;

    // 2) contracts insert (title/terms는 간단 생성)
    const title = body.order_title
      ? String(body.order_title)
      : `광고·콘텐츠·AR 운영 기본 계약 (${biz_name})`;

    // terms: 내부 표준조항 요약을 기본 텍스트로 저장(원문은 별도 관리 가능)
    const terms = `
제1조(목적) 본 계약은 광고·AR 배너·콘텐츠·홍보물의 기획·제작·세팅·운영 및 관리 등에 관한 사항을 정함을 목적으로 한다.
제2조(범위) 광고기획, 콘텐츠 제작, AR 좌표 설정, 홍보물 제작, 운영/보고를 포함할 수 있다.
제3조(기간) 체결일로부터 검수 승인일까지. 장기 운영 항목은 명시 기간 적용.
제4조(비용) 선입금 후 착수하며, 지연 시 일정/납기 조정된다.
제5조(변경) 서면 요청을 원칙으로 하며, 범위 변경 시 비용이 별도로 산정된다.
제6조(검수) 5영업일 내 승인/보완 요청, 미회신 시 자동 승인된다.
제7조(저작권) 명시 없을 경우 비독점 사용권 부여, 포트폴리오 활용 가능.
제8조(비밀유지) 종료 후 3년 유효.
제9조(법규준수) 표시·광고법, 개인정보보호법 등 관련 법규 준수.
제10조(면책) 천재지변/정책변경/네트워크/호환성 이슈에 대한 면책.
제11조(유지보수) 운영기간 내 합리적 보정, 범위 외 개선은 별도 비용.
제12조(해지) 위반·시정 미이행 시 해지 가능, 기 투입비용 정산.
제13조(재위탁) 품질·책임은 원청이 부담한다.
제14조(관할) 대한민국법 및 서울중앙지방법원을 관할로 한다.
제15조(전자서명) 전자서명/이메일 체결의 효력을 인정한다.
`.trim();

    const { error: contractErr, data: contractIns } = await supabaseAdmin
      .from("contracts")
      .insert([{
        client_id,
        title,
        terms,
        price: total,
        status: "draft",
      }])
      .select("id")
      .single();

    if (contractErr) {
      return NextResponse.json({ ok:false, error:"contract_insert_failed", detail: contractErr.message }, { status:500 });
    }

    // (선택) 알림 메일
    await sendEmail(
      "[CONTEX] 신규 계약(초안) 생성",
      `
        <h3>신규 계약 초안</h3>
        <p><b>상호</b>: ${biz_name}</p>
        <p><b>대표자</b>: ${owner_name}</p>
        <p><b>연락처</b>: ${owner_phone}</p>
        <p><b>이메일</b>: ${owner_email}</p>
        <p><b>계약 제목</b>: ${title}</p>
        <p><b>금액</b>: ${total.toLocaleString()}원</p>
      `
    );

    return NextResponse.json({
      ok: true,
      total,
      client_id,
      contract_id: contractIns?.id,
    });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:"route_exception", detail: e?.message }, { status:500 });
  }
}
