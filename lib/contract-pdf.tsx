import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import path from "path";

Font.register({
  family: "NanumGothic",
  fonts: [
    { src: path.join(process.cwd(), "public/fonts/NanumGothic-Regular.ttf"), fontWeight: "normal" },
    { src: path.join(process.cwd(), "public/fonts/NanumGothic-Bold.ttf"), fontWeight: "bold" },
  ],
});

/** 숫자 → "1,234,000" (로케일 미사용으로 PDF 렌더링 안정화) */
function fmt(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** ISO → KST 날짜+시간 문자열 */
function toKst(iso: string, dateOnly = false): string {
  const d = new Date(new Date(iso).getTime() + 9 * 3600 * 1000);
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  if (dateOnly) return `${y}년 ${mo}월 ${day}일`;
  const h = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  return `${y}년 ${mo}월 ${day}일 ${h}:${mi}`;
}

const S = StyleSheet.create({
  page: {
    fontFamily: "NanumGothic",
    fontSize: 9,
    color: "#1e293b",
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 0,
  },

  /* ── 헤더 ── */
  header: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 40,
    paddingVertical: 24,
    marginBottom: 20,
  },
  headerSub: { fontSize: 7, color: "#94a3b8", letterSpacing: 1.5, marginBottom: 4 },
  headerTitle: { fontSize: 15, fontWeight: "bold", color: "#ffffff" },

  /* ── 섹션 ── */
  section: { paddingHorizontal: 40, marginBottom: 16 },
  sectionTitle: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#94a3b8",
    letterSpacing: 1.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },

  /* ── 그리드 ── */
  row2: { flexDirection: "row", gap: 8 },
  col: { flex: 1 },

  /* ── 카드 ── */
  card: {
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    backgroundColor: "#f8fafc",
    padding: 10,
  },
  cardTitle: { fontSize: 7, color: "#94a3b8", letterSpacing: 1, marginBottom: 5 },
  cardBold: { fontSize: 9, fontWeight: "bold", marginBottom: 2 },
  cardText: { fontSize: 8, color: "#475569", marginBottom: 1 },

  /* ── 정보 행 ── */
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid #e2e8f0",
    paddingVertical: 4,
  },
  infoLabel: { fontSize: 8, color: "#64748b" },
  infoValue: { fontSize: 8, fontWeight: "bold" },
  infoValueBlue: { fontSize: 9, fontWeight: "bold", color: "#1d4ed8" },

  /* ── 표 ── */
  table: { border: "1px solid #e2e8f0", borderRadius: 6, overflow: "hidden" },
  thead: { flexDirection: "row", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", paddingHorizontal: 10, paddingVertical: 5 },
  theadCell: { fontSize: 7, color: "#64748b", fontWeight: "bold" },
  trow: { flexDirection: "row", borderBottom: "1px solid #f1f5f9", paddingHorizontal: 10, paddingVertical: 5 },
  trowAlt: { flexDirection: "row", borderBottom: "1px solid #f1f5f9", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#fafafa" },
  tcell: { fontSize: 8, flex: 1 },
  tcellRight: { fontSize: 8, textAlign: "right" },
  tfootRow: { flexDirection: "row", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#f8fafc" },
  tfootLabel: { flex: 1, fontSize: 8, color: "#64748b" },
  tfootValue: { fontSize: 8, color: "#64748b", textAlign: "right" },
  tfootTotalRow: { flexDirection: "row", paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#eff6ff", borderTop: "2px solid #bfdbfe" },
  tfootTotalLabel: { flex: 1, fontSize: 9, fontWeight: "bold" },
  tfootTotalValue: { fontSize: 10, fontWeight: "bold", color: "#1d4ed8", textAlign: "right" },

  /* ── 계좌 박스 ── */
  bankBox: {
    border: "1px solid #93c5fd",
    borderRadius: 6,
    backgroundColor: "#eff6ff",
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bankDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: "#3b82f6",
    marginTop: 2,
  },
  bankLabel: { fontSize: 7, color: "#3b82f6", fontWeight: "bold", marginBottom: 3 },
  bankMain: { fontSize: 10, fontWeight: "bold", color: "#1e3a8a", marginBottom: 2 },
  bankSub: { fontSize: 8, color: "#1d4ed8" },

  /* ── 계약 조항 ── */
  termsBox: {
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    backgroundColor: "#f8fafc",
    padding: 12,
  },
  termsText: { fontSize: 8, lineHeight: 1.8, color: "#374151" },

  /* ── 서명란 ── */
  signCard: { flex: 1, border: "1px solid #e2e8f0", borderRadius: 6, padding: 10 },
  signCardGap: { width: 8 },
  signTitle: { fontSize: 7, color: "#94a3b8", fontWeight: "bold", letterSpacing: 1, marginBottom: 8 },
  signStamp: { alignItems: "center", marginBottom: 6 },
  signImg: { width: 72, height: 72 },
  signSigImg: { width: "100%", height: 56, marginBottom: 6 },
  signRow: { flexDirection: "row", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingVertical: 3 },
  signLabel: { fontSize: 7, color: "#64748b" },
  signValue: { fontSize: 7, fontWeight: "bold", textAlign: "right", flex: 1, paddingLeft: 4 },

  /* ── 검증 ID ── */
  verifyBox: {
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    backgroundColor: "#f8fafc",
    padding: 8,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verifyLabel: { fontSize: 7, color: "#94a3b8", marginBottom: 2 },
  verifyValue: { fontSize: 8, fontWeight: "bold", color: "#374151" },

  /* ── 푸터 ── */
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 6,
  },
  footerText: { fontSize: 7, color: "#94a3b8" },
});

export type ContractPdfProps = {
  contractId: string;
  title: string;
  terms: string;
  price: number;
  selectedItems: { label: string; price: number }[];
  client: {
    client_type: "individual" | "business";
    company?: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  signerName: string;
  signerEmail: string;
  signatureImage?: string;
  signedAt: string;
  createdAt?: string;
};

function ContractPdfDoc(props: ContractPdfProps) {
  const {
    contractId, title, terms, price, selectedItems,
    client, signerName, signerEmail, signatureImage, signedAt, createdAt,
  } = props;

  const basePrice = price;
  const vat = Math.round(basePrice * 0.1);
  const totalWithVat = basePrice + vat;
  const contractNo = contractId.slice(0, 8).toUpperCase();
  const signedDateKst = toKst(signedAt, true);
  const signedDtKst = toKst(signedAt);
  const createdDtKst = createdAt ? toKst(createdAt) : signedDateKst;
  const verifyId = `CTX-${contractNo}-${new Date(new Date(signedAt).getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10).replace(/-/g, "")}`;

  const ingamPath = path.join(process.cwd(), "public/ingam.png");

  return (
    <Document>
      <Page size="A4" style={S.page}>

        {/* ── 헤더 ── */}
        <View style={S.header}>
          <Text style={S.headerSub}>CONTEX Corp. · 전자계약서</Text>
          <Text style={S.headerTitle}>{title}</Text>
        </View>

        {/* ── 계약 정보 ── */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>계약 정보</Text>
          <View style={S.row2}>
            <View style={S.col}>
              <View style={S.infoRow}>
                <Text style={S.infoLabel}>계약 번호</Text>
                <Text style={S.infoValue}>{contractNo}</Text>
              </View>
              <View style={S.infoRow}>
                <Text style={S.infoLabel}>공급가액 (VAT 별도)</Text>
                <Text style={S.infoValue}>₩{fmt(basePrice)}</Text>
              </View>
              <View style={S.infoRow}>
                <Text style={S.infoLabel}>부가세 (10%)</Text>
                <Text style={S.infoValue}>₩{fmt(vat)}</Text>
              </View>
            </View>
            <View style={S.col}>
              <View style={S.infoRow}>
                <Text style={S.infoLabel}>계약 체결일</Text>
                <Text style={S.infoValue}>{signedDateKst}</Text>
              </View>
              <View style={[S.infoRow, { borderBottom: "none" }]}>
                <Text style={S.infoLabel}>실 입금액 (VAT 포함)</Text>
                <Text style={S.infoValueBlue}>₩{fmt(totalWithVat)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── 계약 당사자 ── */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>계약 당사자</Text>
          <View style={S.row2}>
            {/* 공급자 갑 */}
            <View style={[S.card, S.col]}>
              <Text style={S.cardTitle}>공급자 (갑)</Text>
              <Text style={S.cardBold}>CONTEX Corp. (콘텍스)</Text>
              <Text style={S.cardText}>사업자등록번호: 181-48-00499</Text>
              <Text style={S.cardText}>대표: 홍정민</Text>
              <Text style={S.cardText}>hello@contexcorp.com</Text>
            </View>
            {/* 계약자 을 */}
            <View style={[S.card, S.col]}>
              <Text style={S.cardTitle}>계약자 (을)</Text>
              {client.company
                ? <Text style={S.cardBold}>{client.company}</Text>
                : null}
              <Text style={client.company ? S.cardText : S.cardBold}>{client.name}</Text>
              <Text style={S.cardText}>{client.email}</Text>
              {client.phone ? <Text style={S.cardText}>{client.phone}</Text> : null}
              {client.address ? <Text style={S.cardText}>{client.address}</Text> : null}
            </View>
          </View>
        </View>

        {/* ── 선택 서비스 ── */}
        {selectedItems.length > 0 && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>선택 서비스</Text>
            <View style={S.table}>
              <View style={S.thead}>
                <Text style={[S.theadCell, { flex: 1 }]}>서비스 항목</Text>
                <Text style={[S.theadCell, { textAlign: "right" }]}>금액</Text>
              </View>
              {selectedItems.map((item, i) => (
                <View key={i} style={i % 2 === 0 ? S.trow : S.trowAlt}>
                  <Text style={S.tcell}>{item.label}</Text>
                  <Text style={S.tcellRight}>₩{fmt(item.price)}</Text>
                </View>
              ))}
              <View style={S.tfootRow}>
                <Text style={S.tfootLabel}>공급가액 (VAT 별도)</Text>
                <Text style={S.tfootValue}>₩{fmt(basePrice)}</Text>
              </View>
              <View style={S.tfootRow}>
                <Text style={S.tfootLabel}>부가세 (10%)</Text>
                <Text style={S.tfootValue}>₩{fmt(vat)}</Text>
              </View>
              <View style={S.tfootTotalRow}>
                <Text style={S.tfootTotalLabel}>실 입금액 (VAT 포함)</Text>
                <Text style={S.tfootTotalValue}>₩{fmt(totalWithVat)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── 계약 조항 ── */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>계약 조항</Text>
          <View style={S.termsBox}>
            <Text style={S.termsText}>{terms}</Text>
          </View>
        </View>

        {/* ── 입금 계좌 안내 ── */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>입금 계좌 안내</Text>
          <View style={S.bankBox}>
            <View style={S.bankDot} />
            <View>
              <Text style={S.bankLabel}>계약금 입금 계좌</Text>
              <Text style={S.bankMain}>기업은행  458-060294-04019</Text>
              <Text style={S.bankSub}>예금주: 홍정민  ·  실 입금액: ₩{fmt(totalWithVat)} (VAT 포함)</Text>
            </View>
          </View>
        </View>

        {/* ── 전자서명 ── */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>전자서명</Text>
          <View style={S.row2}>
            {/* 공급자 갑 서명 */}
            <View style={S.signCard}>
              <Text style={S.signTitle}>공급자 (갑) 서명</Text>
              <View style={S.signStamp}>
                <Image src={ingamPath} style={S.signImg} />
              </View>
              <View style={S.signRow}>
                <Text style={S.signLabel}>서명자</Text>
                <Text style={S.signValue}>CONTEX Corp. 홍정민</Text>
              </View>
              <View style={S.signRow}>
                <Text style={S.signLabel}>서명 일시</Text>
                <Text style={S.signValue}>{createdDtKst}</Text>
              </View>
            </View>

            <View style={S.signCardGap} />

            {/* 계약자 을 서명 */}
            <View style={S.signCard}>
              <Text style={S.signTitle}>계약자 (을) 서명</Text>
              {signatureImage
                ? <Image src={signatureImage} style={S.signSigImg} />
                : <View style={[S.signSigImg, { border: "1px dashed #e2e8f0", marginBottom: 6 }]} />}
              <View style={S.signRow}>
                <Text style={S.signLabel}>서명자</Text>
                <Text style={S.signValue}>{signerName}</Text>
              </View>
              <View style={S.signRow}>
                <Text style={S.signLabel}>이메일</Text>
                <Text style={S.signValue}>{signerEmail}</Text>
              </View>
              <View style={[S.signRow, { borderBottom: "none" }]}>
                <Text style={S.signLabel}>서명 일시</Text>
                <Text style={S.signValue}>{signedDtKst}</Text>
              </View>
            </View>
          </View>

          {/* 검증 ID */}
          <View style={S.verifyBox}>
            <View>
              <Text style={S.verifyLabel}>전자서명 검증 ID</Text>
              <Text style={S.verifyValue}>{verifyId}</Text>
            </View>
            <Text style={{ fontSize: 7, color: "#16a34a", fontWeight: "bold" }}>서명 완료</Text>
          </View>
        </View>

        {/* ── 푸터 ── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>본 계약서는 전자서명법에 따라 유효한 전자계약입니다.</Text>
          <Text style={S.footerText}>{contractId}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generateContractPdf(props: ContractPdfProps): Promise<Buffer> {
  return renderToBuffer(<ContractPdfDoc {...props} />);
}
