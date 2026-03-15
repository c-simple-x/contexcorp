"use client";

/* ── Phone mockup wrapper ── */
function Phone({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[260px] bg-slate-900 rounded-[2.2rem] p-[6px] shadow-2xl border-[3px] border-slate-700">
        {/* Notch / camera */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-16 h-[6px] bg-slate-800 rounded-full z-10" />
        {/* Screen */}
        <div className="rounded-[1.8rem] overflow-hidden bg-black">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-[6px] bg-slate-900 text-white text-[9px]">
            <span className="font-medium">3:55</span>
            <div className="flex items-center gap-1">
              <span className="text-[8px]">&#9679;&#9679;&#9679;&#9679;</span>
              <span className="text-[9px]">45</span>
            </div>
          </div>
          {/* Content */}
          <div className="min-h-[420px] max-h-[480px] overflow-hidden">
            {children}
          </div>
          {/* Nav bar */}
          <div className="flex items-center justify-around py-[6px] bg-slate-900 text-white/60">
            <div className="w-5 h-[2px] bg-white/40 rounded" />
            <div className="w-4 h-4 rounded-full border border-white/40" />
            <div className="w-4 h-[2px] bg-white/40 rounded rotate-[-30deg]" />
          </div>
        </div>
      </div>
      {caption && <p className="text-xs text-slate-500 mt-2 text-center">{caption}</p>}
    </div>
  );
}

/* ── Chrome address bar ── */
function ChromeBar({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-[6px] bg-white border-b border-slate-200">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M3 12h1m7-9v1m9 8h-1m-7 9v-1m-6.36-2.64.7-.7m12.02 0 .7.7M5.64 5.64l.7.7m12.02 0-.7.7"/></svg>
      <div className="flex-1 bg-slate-100 rounded-full px-3 py-[3px] text-[9px] text-slate-600 truncate">{url}</div>
      <span className="text-[9px] text-slate-400 border border-slate-300 rounded px-[3px]">2</span>
      <span className="text-slate-400 text-[10px]">&#8942;</span>
    </div>
  );
}

export default function GuidePage() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .guide-container { max-width: 100% !important; padding: 0 !important; }
          .step-card { break-inside: avoid; box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
          video { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-lg font-bold text-slate-800">
              CONTEX<span className="text-blue-600">Corp.</span>
            </a>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              PDF 다운로드
            </button>
          </div>
        </header>

        <main className="guide-container max-w-4xl mx-auto px-6 py-12">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-4">
              CONTEX Corp. AR 서비스 가이드
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              AR 광고 확인 가이드
            </h1>
            <p className="text-slate-500 text-lg">
              계약자를 위한 AR 콘텐츠 접속, 확인 및 녹화 안내
            </p>
          </div>

          {/* Prerequisites */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
            <h2 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              시작 전 확인사항
            </h2>
            <ul className="space-y-2 text-amber-900">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-800 shrink-0">!</span>
                <span><b>안드로이드 스마트폰</b>만 지원됩니다 (iPhone은 현재 미지원)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-800 shrink-0">!</span>
                <span><b>Chrome 브라우저</b>를 사용해야 합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-800 shrink-0">!</span>
                <span><b>GPS(위치)</b>와 <b>카메라</b> 권한을 허용해야 합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-800 shrink-0">!</span>
                <span>광고가 설치된 <b>현장 위치</b>에서 접속해야 AR 콘텐츠가 보입니다</span>
              </li>
            </ul>
          </div>

          {/* ═══════════ PART 1: 사이트 접속 ═══════════ */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">1</div>
              <h2 className="text-2xl font-bold text-slate-900">사이트 접속하기</h2>
            </div>

            {/* Step 1-1: Chrome 열기 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">1-1</span>
                <h3 className="font-bold text-slate-800">Chrome 브라우저 열기</h3>
              </div>
              <p className="text-slate-600 mb-6">
                안드로이드 홈 화면에서 <b>Google 폴더</b>를 열고, <b>Chrome</b> 앱을 실행합니다.
              </p>

              {/* Phone mockups */}
              <div className="flex flex-wrap justify-center gap-6">
                <Phone caption="홈 화면 → Google 폴더">
                  <div className="bg-gradient-to-b from-slate-700 to-slate-800 px-4 pt-8 pb-4 min-h-[420px]">
                    <p className="text-white text-center font-bold text-lg mb-6">Google</p>
                    <div className="bg-white/15 rounded-2xl p-4">
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { bg: "bg-white", icon: "G", color: "text-blue-500", label: "Google" },
                          { bg: "bg-white", icon: "●", color: "text-green-500", label: "Chrome" },
                          { bg: "bg-white", icon: "M", color: "text-red-500", label: "Gmail" },
                          { bg: "bg-white", icon: "▼", color: "text-green-600", label: "지도" },
                          { bg: "bg-red-600", icon: "▶", color: "text-white", label: "YouTube" },
                          { bg: "bg-white", icon: "✦", color: "text-blue-500", label: "Gemini" },
                        ].map((app, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div className={`w-11 h-11 rounded-xl ${app.bg} flex items-center justify-center text-base font-bold ${app.color} ${i === 1 ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-700" : ""}`}>
                              {app.icon}
                            </div>
                            <span className={`text-[9px] text-white/80 ${i === 1 ? "font-bold text-blue-300" : ""}`}>{app.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <p className="text-blue-300 text-[9px] font-bold">&#8593; Chrome을 탭하세요</p>
                    </div>
                  </div>
                </Phone>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-500 mt-6">
                <b>Tip:</b> Chrome이 없다면 Play 스토어에서 &quot;Chrome&quot;을 검색하여 설치하세요.
              </div>
            </div>

            {/* Step 1-2: nin.earth 주소 입력 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">1-2</span>
                <h3 className="font-bold text-slate-800">NIN.Earth 접속</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Chrome 주소창에 <code className="bg-slate-100 px-2 py-1 rounded text-blue-700 font-mono font-bold">nin.earth</code>를 입력하고 이동합니다.
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                {/* Phone: address bar */}
                <Phone caption="주소창에 nin.earth 입력">
                  <div className="bg-white min-h-[420px]">
                    {/* Chrome search bar */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-slate-100">
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px]">&#127760;</div>
                      <div className="flex-1 bg-slate-100 rounded-full px-3 py-[5px] text-[10px] font-bold text-slate-800 flex items-center">
                        <span className="text-blue-600">nin.earth</span>
                        <span className="ml-auto text-slate-300 text-lg leading-none">&times;</span>
                      </div>
                    </div>
                    {/* Autocomplete */}
                    <div className="divide-y divide-slate-100">
                      <div className="flex items-center gap-3 px-4 py-3 bg-blue-50">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[8px]">&#127760;</div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-800">NIN, Next InterNet</p>
                          <p className="text-[9px] text-blue-600">nin.earth</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px]">&#128269;</div>
                        <p className="text-[10px] text-slate-600">nin</p>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px]">&#128269;</div>
                        <p className="text-[10px] text-slate-600">nintendo eshop</p>
                      </div>
                    </div>
                    {/* Keyboard hint */}
                    <div className="mt-auto bg-slate-100 p-2 grid grid-cols-10 gap-[2px]">
                      {["q","w","e","r","t","y","u","i","o","p"].map(k => (
                        <div key={k} className="bg-white rounded text-center text-[8px] py-1 text-slate-600">{k}</div>
                      ))}
                    </div>
                  </div>
                </Phone>

                {/* Phone: NIN.Earth homepage */}
                <Phone caption="NIN.Earth 홈페이지">
                  <ChromeBar url="nin.earth" />
                  <div className="bg-black min-h-[400px] flex flex-col items-center pt-6 px-4">
                    <p className="text-orange-400 font-extrabold text-lg tracking-wide">NIN.Earth</p>
                    <div className="w-32 h-[1px] bg-slate-600 my-2" />
                    <p className="text-cyan-400 text-[9px] font-bold">Next InterNet on Earth</p>

                    {/* Globe */}
                    <div className="relative w-36 h-36 my-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-900 via-blue-700 to-emerald-600 opacity-90" />
                      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-blue-800 via-teal-600 to-emerald-500 opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <p className="text-orange-400 text-[9px] font-bold">True</p>
                        <p className="text-cyan-300 text-[9px] font-bold">Web3</p>
                        <p className="text-orange-400 text-[9px] font-bold">Geolocational</p>
                        <p className="text-orange-300 text-[9px] font-bold">Metaverse</p>
                      </div>
                    </div>

                    <p className="text-slate-400 text-[9px]">@inside <span className="text-orange-400 font-bold">NIN</span>.<span className="text-cyan-400 font-bold">Earth</span></p>

                    {/* Social icons */}
                    <div className="flex gap-3 mt-3">
                      {["▊▊","✕","▶","B","😺"].map((ic, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[8px] text-white/70">{ic}</div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 mt-4">
                      <span className="text-cyan-400 text-[8px]">Seamless</span>
                      <div className="flex gap-1">{[1,2,3].map(i=><div key={i} className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-purple-400"/>)}</div>
                      <span className="text-cyan-400 text-[8px]">Experience</span>
                    </div>
                  </div>
                </Phone>
              </div>
            </div>

            {/* Step 1-3: 스크롤 → AR 버튼 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">1-3</span>
                <h3 className="font-bold text-slate-800">AR 접속 버튼 찾기</h3>
              </div>
              <p className="text-slate-600 mb-6">
                NIN.Earth 홈페이지에서 <b>아래로 스크롤</b>하면 중간에 AR 접속 버튼이 있습니다.
              </p>
              <div className="flex justify-center">
                <Phone caption="스크롤 후 AR 버튼 탭">
                  <ChromeBar url="nin.earth" />
                  <div className="bg-black min-h-[400px] px-4 pt-4">
                    <p className="text-orange-400 font-bold text-sm mb-3">Brief Introduction</p>
                    <p className="text-white text-[9px] font-bold mb-1">For Web service:</p>
                    <p className="text-slate-400 text-[8px] mb-3">You need an address - a Domain Name.</p>
                    <p className="text-white text-[9px] font-bold mb-1">For Metaverse:</p>
                    <p className="text-slate-400 text-[8px] mb-4">You need a location - a Domain Space.</p>

                    <div className="border border-slate-600 rounded-xl p-3 mb-4">
                      <p className="text-orange-400 text-[9px] font-bold mb-2">Experience AR Now</p>
                      <p className="text-slate-400 text-[8px] mb-3">아래 버튼을 눌러 AR 콘텐츠를 확인하세요</p>
                      <div className="bg-blue-500 text-white text-center py-2 rounded-lg text-[10px] font-bold animate-pulse">
                        AR 체험하기 →
                      </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="flex flex-col items-center mt-2">
                      <div className="w-[2px] h-12 bg-gradient-to-b from-blue-400 to-transparent" />
                      <p className="text-blue-400 text-[8px] mt-1">스크롤</p>
                    </div>
                  </div>
                </Phone>
              </div>
            </div>
          </section>

          {/* ═══════════ PART 2: AR 콘텐츠 확인 ═══════════ */}
          <section className="mb-16 print-break">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">2</div>
              <h2 className="text-2xl font-bold text-slate-900">AR 콘텐츠 확인하기</h2>
            </div>

            {/* Step 2-1: GPS 수신 대기 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">2-1</span>
                <h3 className="font-bold text-slate-800">GPS 데이터 수신 대기</h3>
              </div>
              <p className="text-slate-600 mb-6">
                AR 페이지에 접속하면 <b>&quot;Receiving GPS, Compass data... Please wait.&quot;</b> 메시지가 표시됩니다.
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <Phone caption="GPS 수신 중... 잠시 대기">
                  <ChromeBar url="dns1.nin.earth/a?..." />
                  <div className="bg-slate-950 min-h-[400px] px-4 pt-3">
                    <p className="text-orange-400 font-bold text-[10px] mb-3">
                      <span className="text-red-400">&#169;</span> Domain Space Monuments within ~200m
                    </p>
                    {/* Radar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-28 h-28">
                        <div className="absolute inset-0 rounded-full border border-slate-600" />
                        <div className="absolute inset-4 rounded-full border border-slate-700" />
                        <div className="absolute inset-8 rounded-full border border-slate-700" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white/60" />
                        </div>
                        <p className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] text-slate-500">N</p>
                      </div>
                      <div className="bg-blue-500/30 text-blue-300 font-bold text-[10px] px-3 py-3 rounded-lg text-center leading-tight opacity-50">
                        START<br/>AR
                      </div>
                    </div>
                    <p className="text-slate-500 text-[7px] mb-3">- Displayed location/direction may vary slightly due to GPS/compass offset</p>
                    {/* Loading message */}
                    <div className="bg-yellow-900/30 rounded-lg p-3 mb-3">
                      <p className="text-yellow-300 text-[10px] font-bold text-center">⏳ Receiving GPS, Compass data... Please wait.</p>
                    </div>
                    <div className="text-[8px] space-y-[2px]">
                      <p className="text-red-400 font-bold">&#128205; Your Location</p>
                      <p className="text-slate-500">- Latitude: -</p>
                      <p className="text-slate-500">- Longitude: -</p>
                      <p className="text-slate-500">- Altitude: -</p>
                    </div>
                  </div>
                </Phone>

                <Phone caption="GPS 수신 완료!">
                  <ChromeBar url="dns1.nin.earth/a?..." />
                  <div className="bg-slate-950 min-h-[400px] px-4 pt-3">
                    <p className="text-orange-400 font-bold text-[10px] mb-3">
                      <span className="text-red-400">&#169;</span> Domain Space Monuments within ~200m
                    </p>
                    {/* Radar with signal */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-28 h-28">
                        <div className="absolute inset-0 rounded-full border border-slate-600" />
                        <div className="absolute inset-4 rounded-full border border-slate-700" />
                        <div className="absolute inset-8 rounded-full border border-slate-700" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                        </div>
                        {/* Direction cone */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[24px] border-l-transparent border-r-transparent border-b-green-500/30" />
                        <div className="absolute top-3 right-8 w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <p className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] text-slate-400">N</p>
                      </div>
                      <div className="bg-blue-500 text-white font-bold text-[10px] px-3 py-3 rounded-lg text-center leading-tight shadow-lg shadow-blue-500/30">
                        START<br/>AR
                      </div>
                    </div>
                    <p className="text-slate-500 text-[7px] mb-3">- Displayed location/direction may vary slightly due to GPS/compass offset</p>

                    <div className="text-[8px] space-y-[2px]">
                      <p className="text-red-400 font-bold">&#128205; Your Location</p>
                      <p className="text-slate-300">- Latitude: 37.692383</p>
                      <p className="text-slate-300">- Longitude: 126.756342</p>
                      <p className="text-slate-300">- Altitude: 38.60</p>
                      <p className="text-red-400 font-bold mt-1">&#10148; Distance to Monuments</p>
                      <p className="text-slate-300">- Domain Space #349 : 7.2 m, 24&deg; NE</p>
                    </div>
                  </div>
                </Phone>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 mt-6">
                <b>Note:</b> GPS 수신까지 10~30초 정도 소요될 수 있습니다. 실외에서 하늘이 보이는 곳에서 시도하세요.
              </div>
            </div>

            {/* Step 2-2: 옵션 설정 + START AR */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">2-2</span>
                <h3 className="font-bold text-slate-800">옵션 설정 &amp; START AR</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Grid, Gaze Ring, Sample Monument <b>체크박스를 모두 활성화</b>한 후 <b className="text-blue-600">START AR</b> 버튼을 탭합니다.
              </p>

              <div className="flex justify-center">
                <Phone caption="체크박스 활성화 → START AR 탭">
                  <ChromeBar url="dns1.nin.earth/a?..." />
                  <div className="bg-slate-950 min-h-[400px] px-4 pt-3">
                    <p className="text-orange-400 font-bold text-[10px] mb-3">
                      <span className="text-red-400">&#169;</span> Domain Space Monuments within ~200m
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-28 h-28">
                        <div className="absolute inset-0 rounded-full border border-slate-600" />
                        <div className="absolute inset-4 rounded-full border border-slate-700" />
                        <div className="absolute inset-8 rounded-full border border-slate-700" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        </div>
                        {/* Wide cone */}
                        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-green-500/20 rounded-t-full" style={{clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)"}} />
                        <p className="absolute bottom-1 right-3 text-[7px] text-slate-400">N</p>
                      </div>
                      <div className="bg-blue-500 text-white font-bold text-[11px] px-4 py-4 rounded-lg text-center leading-tight shadow-xl shadow-blue-500/40 ring-2 ring-blue-300">
                        START<br/>AR
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400 text-[10px]">&#x25CF;</span>
                        <span className="text-orange-400 text-[9px] font-bold">Grid :</span>
                        <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center text-white text-[8px]">&#10003;</div>
                        <div className="w-3 h-3 rounded border border-red-400 bg-red-500/30" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400 text-[10px]">&#x25CF;</span>
                        <span className="text-orange-400 text-[9px] font-bold">Gaze Ring :</span>
                        <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center text-white text-[8px]">&#10003;</div>
                        <div className="w-3 h-3 rounded-full border border-slate-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]">&#x25A0;</span>
                        <span className="text-orange-400 text-[9px] font-bold">Sample Monument :</span>
                        <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center text-white text-[8px]">&#10003;</div>
                        <div className="w-3 h-3 rounded bg-amber-600" />
                      </div>
                    </div>

                    <div className="text-[8px] space-y-[2px]">
                      <p className="text-red-400 font-bold">&#128205; Your Location</p>
                      <p className="text-slate-300">- Latitude: 37.692408</p>
                      <p className="text-slate-300">- Longitude: 126.756377</p>
                      <p className="text-slate-300">- Altitude: 38.70</p>
                      <p className="text-red-400 font-bold mt-1">&#10148; Distance to Monuments</p>
                    </div>
                  </div>
                </Phone>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700 mt-6">
                <b>Note:</b> 카메라 접근 권한을 요청하면 반드시 <b>&quot;허용&quot;</b>을 눌러주세요.
              </div>
            </div>

            {/* Step 2-3: AR 광고 확인 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">2-3</span>
                <h3 className="font-bold text-slate-800">AR 광고 콘텐츠 확인</h3>
              </div>
              <p className="text-slate-600 mb-6">
                카메라를 통해 실제 거리 위에 <b>3D 광고물</b>이 떠 있는 것을 확인할 수 있습니다. 스마트폰을 좌우로 움직이며 광고가 올바르게 표시되는지 확인하세요.
              </p>

              <div className="flex justify-center">
                <Phone caption="실제 거리 위에 3D 광고물 표시">
                  <div className="relative min-h-[460px] bg-gradient-to-b from-sky-300 via-sky-200 to-slate-400">
                    {/* Sky + wires */}
                    <div className="absolute top-8 left-0 right-0 h-[1px] bg-slate-500/30" />
                    <div className="absolute top-12 left-0 right-0 h-[1px] bg-slate-500/20" />
                    {/* Electric pole */}
                    <div className="absolute left-6 top-16 w-[3px] h-[200px] bg-slate-600/70" />

                    {/* ★ 3D Ad - National Geographic */}
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 transform rotate-[-3deg]">
                      <div className="bg-slate-900 border border-yellow-500 rounded-md px-3 py-2 shadow-2xl" style={{transform: "perspective(400px) rotateY(-10deg) rotateX(5deg)"}}>
                        <div className="flex items-center gap-1 mb-[2px]">
                          <div className="w-2 h-2 border border-yellow-400" />
                          <p className="text-[6px] text-white tracking-wider">NATIONAL GEOGRAPHIC</p>
                        </div>
                        <p className="text-white text-[8px] font-bold">일산덕이점</p>
                        <p className="text-yellow-400 text-[12px] font-black">기획전</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-red-500 text-[6px] font-bold">최대</span>
                          <span className="text-yellow-400 text-[16px] font-black">50%</span>
                          <span className="text-white text-[8px] font-bold">할인</span>
                        </div>
                      </div>
                    </div>

                    {/* ★ 3D Ad - NIN.Earth */}
                    <div className="absolute top-48 left-1/2 -translate-x-1/2 transform rotate-[2deg]">
                      <div className="bg-white rounded-md px-3 py-2 shadow-2xl" style={{transform: "perspective(400px) rotateY(5deg) rotateX(-3deg)"}}>
                        <p className="text-orange-500 text-[10px] font-extrabold">NIN.Earth</p>
                        <p className="text-[6px] text-slate-600"><b className="text-blue-600">N</b>ext <b className="text-blue-600">I</b>nter<b className="text-blue-600">N</b>et <b className="text-green-600">o</b>n <b className="text-blue-600">E</b>arth</p>
                      </div>
                    </div>

                    {/* Street level */}
                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-500 to-slate-400/80" />
                    <div className="absolute bottom-8 left-2 right-2 h-[1px] bg-slate-600/30" />

                    {/* X close button */}
                    <div className="absolute top-3 right-4 w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-white text-[10px]">&times;</div>
                  </div>
                </Phone>
              </div>
            </div>
          </section>

          {/* ═══════════ PART 3: 화면 녹화 ═══════════ */}
          <section className="mb-16 print-break">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">3</div>
              <h2 className="text-2xl font-bold text-slate-900">화면 녹화하기</h2>
            </div>

            {/* Step 3-1: 빠른 설정 패널 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">3-1</span>
                <h3 className="font-bold text-slate-800">빠른 설정 패널에서 &quot;화면 녹화&quot; 탭</h3>
              </div>
              <p className="text-slate-600 mb-6">
                화면 <b>상단을 아래로 두 번 스와이프</b>하여 빠른 설정 패널을 열고, <b className="text-purple-700">&quot;화면 녹화&quot;</b> 아이콘을 탭합니다.
              </p>

              <div className="flex justify-center">
                <Phone caption="빠른 설정 → 화면 녹화">
                  <div className="bg-slate-800/95 min-h-[460px] px-3 pt-2">
                    <p className="text-white/60 text-[8px] mb-3">SIM 카드 없음 &middot; 제한구역서비스</p>

                    {/* Top row */}
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1 bg-blue-500/30 rounded-2xl px-3 py-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]">&#9679;</div>
                        <div><p className="text-[8px] text-white font-bold">Wi-Fi</p><p className="text-[7px] text-white/60">Jungmin</p></div>
                      </div>
                      <div className="flex-1 bg-slate-700 rounded-2xl px-3 py-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]">&#9733;</div>
                        <p className="text-[8px] text-white">블루투스</p>
                      </div>
                    </div>

                    {/* Quick toggles grid */}
                    <div className="bg-slate-700/50 rounded-2xl p-3 mb-3">
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: "자동 회전", active: false },
                          { label: "비행기\n탑승 모드", active: false },
                          { label: "손전등", active: false },
                          { label: "NFC\n결제만", active: false },
                          { label: "모바일\n데이터", active: false },
                          { label: "모바일\n핫스팟", active: true },
                          { label: "절전 모드", active: false },
                          { label: "Windows와\n연결", active: false },
                          { label: "화면 녹화", active: false, highlight: true },
                          { label: "Quick Share", active: false },
                          { label: "위치", active: true },
                          { label: "편안하게\n화면 보기", active: false },
                        ].map((item, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[7px] ${
                              item.highlight
                                ? "bg-white ring-2 ring-purple-400 ring-offset-1 ring-offset-slate-700 shadow-lg shadow-purple-500/30"
                                : item.active
                                  ? "bg-blue-500 text-white"
                                  : "bg-slate-600 text-white/70"
                            }`}>
                              {item.highlight ? <div className="w-3 h-3 rounded-full border-2 border-slate-800"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mx-auto mt-[1px]"/></div> : "●"}
                            </div>
                            <span className={`text-[6px] text-center leading-tight whitespace-pre-line ${item.highlight ? "text-purple-300 font-bold" : "text-white/70"}`}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow pointing to 화면 녹화 */}
                    <div className="flex items-center gap-2 bg-purple-500/20 rounded-lg p-2">
                      <span className="text-purple-400 text-lg">←</span>
                      <span className="text-purple-300 text-[9px] font-bold">&quot;화면 녹화&quot; 버튼을 탭하세요</span>
                    </div>
                  </div>
                </Phone>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 mt-6">
                <b>Tip:</b> 화면 녹화 버튼이 보이지 않으면, 빠른 설정 패널을 좌우로 스와이프하거나 편집(연필 아이콘)을 눌러 추가하세요.
              </div>
            </div>

            {/* Step 3-2: 녹화 시작/중지 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">3-2</span>
                <h3 className="font-bold text-slate-800">녹화 시작 &amp; 중지</h3>
              </div>
              <div className="space-y-4 text-slate-600">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <p>녹화 옵션 팝업에서 <b>&quot;녹화 시작&quot;</b>을 탭합니다. 카운트다운(3, 2, 1...) 후 녹화가 시작됩니다.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <p>녹화가 시작된 상태에서 <b>Chrome으로 돌아가</b> AR 화면을 촬영하세요.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <p>촬영이 끝나면, 화면 상단의 <b>빨간 녹화 표시줄</b>을 탭하거나 알림 패널에서 <b>&quot;중지&quot;</b>를 눌러 녹화를 종료합니다.</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mt-4">
                <b>중요:</b> 녹화 중에는 화면 상단에 빨간 점이 표시됩니다. 이 표시가 있으면 녹화가 진행 중인 것입니다.
              </div>
            </div>
          </section>

          {/* ═══════════ PART 4: 저장 및 확인 ═══════════ */}
          <section className="mb-16 print-break">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">4</div>
              <h2 className="text-2xl font-bold text-slate-900">저장된 녹화 확인하기</h2>
            </div>

            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">4-1</span>
                <h3 className="font-bold text-slate-800">자동 저장 &amp; 확인 위치</h3>
              </div>
              <p className="text-slate-600 mb-6">
                녹화가 종료되면 동영상이 <b>자동으로 저장</b>됩니다. 아래 앱에서 확인할 수 있습니다:
              </p>

              <div className="flex justify-center mb-6">
                <Phone caption="갤러리 앱에서 녹화 영상 확인">
                  <div className="bg-white min-h-[420px]">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                      <p className="text-[11px] font-bold text-slate-800">갤러리</p>
                      <p className="text-[8px] text-slate-400">화면 녹화 폴더</p>
                    </div>
                    {/* Video thumbnails */}
                    <div className="grid grid-cols-3 gap-[2px] p-[2px]">
                      {[
                        { bg: "from-blue-900 to-blue-700", label: "AR 확인 영상", time: "2:42" },
                        { bg: "from-slate-800 to-slate-600", label: "녹화 테스트", time: "0:36" },
                        { bg: "from-emerald-900 to-teal-700", label: "현장 촬영", time: "1:15" },
                      ].map((vid, i) => (
                        <div key={i} className={`relative aspect-square bg-gradient-to-br ${vid.bg} flex items-center justify-center`}>
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-white/80 ml-[2px]" />
                          </div>
                          <span className="absolute bottom-1 right-1 text-[7px] text-white bg-black/50 px-1 rounded">{vid.time}</span>
                          {i === 0 && <span className="absolute top-1 left-1 text-[6px] text-white bg-blue-500 px-1 rounded">NEW</span>}
                        </div>
                      ))}
                    </div>

                    {/* Path info */}
                    <div className="px-4 py-3 space-y-3 mt-2">
                      <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-sm">&#127909;</div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-800">갤러리 앱</p>
                          <p className="text-[7px] text-slate-400">갤러리 &gt; 화면 녹화</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm">&#128193;</div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-800">내 파일 앱</p>
                          <p className="text-[7px] text-slate-400">DCIM &gt; Screen recordings</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-sm">&#128247;</div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-800">Google 포토</p>
                          <p className="text-[7px] text-slate-400">라이브러리 &gt; 화면 녹화</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Phone>
              </div>
            </div>

            {/* Step 4-2: 영상 전달 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">4-2</span>
                <h3 className="font-bold text-slate-800">녹화 영상 전달</h3>
              </div>
              <p className="text-slate-600 mb-4">
                녹화된 영상을 CONTEX Corp. 담당자에게 전달하는 방법:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">1</span>
                  <span>갤러리에서 녹화 영상 선택</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">2</span>
                  <span><b>공유</b> 버튼 탭</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">3</span>
                  <span>카카오톡, 이메일, 또는 메시지로 전송</span>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════ 참고 영상 ═══════════ */}
          <section className="mb-16 no-print">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-lg">&#9654;</div>
              <h2 className="text-2xl font-bold text-slate-900">참고 영상</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <video controls playsInline className="w-full aspect-[9/16] max-h-[500px] object-contain bg-black" src="/guide1.mp4" />
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 mb-1">AR 접속 및 확인</h3>
                  <p className="text-sm text-slate-500">Chrome 접속 → NIN.Earth → AR 페이지 → 3D 광고 확인</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <video controls playsInline className="w-full aspect-[9/16] max-h-[500px] object-contain bg-black" src="/guide2.mp4" />
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 mb-1">화면 녹화 방법</h3>
                  <p className="text-sm text-slate-500">빠른 설정 패널 → 화면 녹화 → 갤러리에서 확인</p>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════ Quick Summary ═══════════ */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
              <h2 className="text-xl font-bold mb-6">전체 흐름 요약</h2>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { step: "1", title: "사이트 접속", desc: "Chrome → nin.earth → 스크롤 → AR 버튼" },
                  { step: "2", title: "AR 확인", desc: "GPS 수신 → 옵션 설정 → START AR" },
                  { step: "3", title: "화면 녹화", desc: "빠른설정 → 화면녹화 → 촬영" },
                  { step: "4", title: "저장 확인", desc: "갤러리 → 화면 녹화 폴더" },
                ].map((item) => (
                  <div key={item.step} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold mb-2">{item.step}</div>
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-blue-100">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-slate-400 text-sm pb-8">
            <p>CONTEX Corp. | contact@contexcorp.com | +82-10-3653-1987</p>
            <p className="mt-1">본 가이드에 대한 문의사항은 담당자에게 연락해 주세요.</p>
          </div>
        </main>
      </div>
    </>
  );
}
