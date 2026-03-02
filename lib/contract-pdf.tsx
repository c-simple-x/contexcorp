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

const styles = StyleSheet.create({
  page: { fontFamily: "NanumGothic", fontSize: 10, padding: 48, color: "#1e293b" },
  title: { fontSize: 16, fontFamily: "NanumGothic", fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  section: { marginBottom: 10 },
  heading: { fontSize: 11, fontFamily: "NanumGothic", fontWeight: "bold", marginBottom: 4 },
  row: { flexDirection: "row", marginBottom: 3 },
  label: { width: 110, color: "#64748b" },
  value: { flex: 1 },
  divider: { borderBottom: "1px solid #e2e8f0", marginVertical: 10 },
  clause: { marginBottom: 5, lineHeight: 1.5 },
  clauseTitle: { fontFamily: "NanumGothic", fontWeight: "bold" },
  totalBox: { border: "1px solid #3b82f6", borderRadius: 4, padding: 10, marginBottom: 12, backgroundColor: "#eff6ff" },
  totalText: { fontSize: 13, fontFamily: "NanumGothic", fontWeight: "bold", color: "#1d4ed8" },
  signBox: { marginTop: 16, border: "1px solid #e2e8f0", padding: 10, borderRadius: 4 },
  sigImg: { width: 160, height: 60, marginTop: 6 },
  small: { fontSize: 8, color: "#94a3b8" },
  footer: { position: "absolute", bottom: 30, left: 48, right: 48, textAlign: "center", fontSize: 8, color: "#94a3b8" },
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
  signatureImage?: string; // base64 PNG
  signedAt: string; // ISO string
};

function formatPrice(n: number) {
  return "₩" + n.toLocaleString("ko-KR");
}

function ContractPdfDoc(props: ContractPdfProps) {
  const { contractId, title, terms, price, selectedItems, client, signerName, signerEmail, signatureImage, signedAt } = props;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 제목 */}
        <Text style={styles.title}>광고·콘텐츠·AR 운영 기본 계약서</Text>

        {/* 당사자 정보 */}
        <View style={styles.section}>
          <Text style={styles.heading}>계약 당사자</Text>
          <View style={styles.row}><Text style={styles.label}>공급자</Text><Text style={styles.value}>CONTEX Corp. (대표 홍정민)</Text></View>
          {client.client_type === "business" ? (
            <>
              <View style={styles.row}><Text style={styles.label}>고객 상호</Text><Text style={styles.value}>{client.company || "-"}</Text></View>
              <View style={styles.row}><Text style={styles.label}>대표자</Text><Text style={styles.value}>{client.name}</Text></View>
            </>
          ) : (
            <View style={styles.row}><Text style={styles.label}>고객 성명</Text><Text style={styles.value}>{client.name}</Text></View>
          )}
          <View style={styles.row}><Text style={styles.label}>이메일</Text><Text style={styles.value}>{client.email}</Text></View>
          {client.phone && <View style={styles.row}><Text style={styles.label}>전화</Text><Text style={styles.value}>{client.phone}</Text></View>}
          {client.address && <View style={styles.row}><Text style={styles.label}>주소</Text><Text style={styles.value}>{client.address}</Text></View>}
        </View>

        <View style={styles.divider} />

        {/* 선택 서비스 및 금액 */}
        <View style={styles.section}>
          <Text style={styles.heading}>계약 항목</Text>
          {selectedItems.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{formatPrice(item.price)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalText}>합계 {formatPrice(price)} (부가세 별도)</Text>
        </View>

        <View style={styles.divider} />

        {/* 계약 조항 */}
        <View style={styles.section}>
          <Text style={styles.heading}>계약 조항</Text>
          {terms.split("\n").map((line, i) => (
            <Text key={i} style={styles.clause}>{line}</Text>
          ))}
        </View>

        <View style={styles.divider} />

        {/* 서명 */}
        <View style={styles.signBox}>
          <Text style={styles.heading}>전자 서명</Text>
          <View style={styles.row}><Text style={styles.label}>서명자</Text><Text style={styles.value}>{signerName} ({signerEmail})</Text></View>
          <View style={styles.row}><Text style={styles.label}>서명 일시</Text><Text style={styles.value}>{new Date(signedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</Text></View>
          <View style={styles.row}><Text style={styles.label}>계약 ID</Text><Text style={styles.value}>{contractId}</Text></View>
          {signatureImage && (
            <Image src={signatureImage} style={styles.sigImg} />
          )}
          <Text style={[styles.small, { marginTop: 6 }]}>
            본 계약서는 전자서명법 제3조에 따른 전자서명으로 체결되었으며 서명일시·IP 등이 기록됩니다.
          </Text>
        </View>

        {/* 페이지 하단 */}
        <Text style={styles.footer}>
          CONTEX Corp. | hello@contexcorp.com | +82-10-3653-1987 | {new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  );
}

export async function generateContractPdf(props: ContractPdfProps): Promise<Buffer> {
  return renderToBuffer(<ContractPdfDoc {...props} />);
}
