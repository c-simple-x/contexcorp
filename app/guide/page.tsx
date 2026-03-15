"use client";

export default function GuidePage() {
  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .guide-container { max-width: 100% !important; padding: 0 !important; }
          .step-card { break-inside: avoid; box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
          video { display: none !important; }
          .video-fallback { display: block !important; }
        }
        @media screen {
          .video-fallback { display: none !important; }
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

          {/* ========== PART 1: 사이트 접속 ========== */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">1</div>
              <h2 className="text-2xl font-bold text-slate-900">사이트 접속하기</h2>
            </div>

            {/* Step 1-1 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">1-1</span>
                <h3 className="font-bold text-slate-800">Chrome 브라우저 열기</h3>
              </div>
              <p className="text-slate-600 mb-4">
                안드로이드 홈 화면에서 <b>Google 폴더</b>를 열고, <b>Chrome</b> 앱을 실행합니다.
              </p>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-500">
                <b>Tip:</b> Chrome이 없다면 Play 스토어에서 &quot;Chrome&quot;을 검색하여 설치하세요.
              </div>
            </div>

            {/* Step 1-2 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">1-2</span>
                <h3 className="font-bold text-slate-800">NIN.Earth 접속</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Chrome 주소창에 <code className="bg-slate-100 px-2 py-1 rounded text-blue-700 font-mono font-bold">nin.earth</code>를 입력하고 이동합니다.
              </p>
              <div className="bg-slate-900 rounded-xl p-6 text-center">
                <p className="text-orange-400 font-bold text-xl mb-1">NIN.Earth</p>
                <p className="text-cyan-400 text-sm">Next InterNet on Earth</p>
                <p className="text-slate-400 text-xs mt-2">True Web3 Geolocational Metaverse</p>
              </div>
            </div>

            {/* Step 1-3 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">1-3</span>
                <h3 className="font-bold text-slate-800">AR 접속 버튼 찾기</h3>
              </div>
              <p className="text-slate-600 mb-4">
                NIN.Earth 홈페이지에서 <b>아래로 스크롤</b>하면 중간에 <b>AR 접속 버튼</b>이 있습니다. 해당 버튼을 탭하면 AR 페이지로 이동합니다.
              </p>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 10 5 5 5-5"/></svg>
                페이지를 아래로 스크롤하세요
              </div>
            </div>
          </section>

          {/* ========== PART 2: AR 콘텐츠 확인 ========== */}
          <section className="mb-16 print-break">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">2</div>
              <h2 className="text-2xl font-bold text-slate-900">AR 콘텐츠 확인하기</h2>
            </div>

            {/* Step 2-1 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">2-1</span>
                <h3 className="font-bold text-slate-800">GPS 데이터 수신 대기</h3>
              </div>
              <p className="text-slate-600 mb-4">
                AR 페이지에 접속하면 <b>&quot;Receiving GPS, Compass data... Please wait.&quot;</b> 메시지가 표시됩니다. GPS와 나침반 데이터를 수신할 때까지 잠시 기다려주세요.
              </p>
              <div className="bg-slate-900 rounded-xl p-6">
                <p className="text-orange-400 font-bold text-sm mb-2">Domain Space Monuments within ~200m</p>
                <div className="text-center py-4">
                  <p className="text-yellow-300 text-lg">Receiving GPS, Compass data... Please wait.</p>
                </div>
                <div className="text-slate-400 text-xs mt-2 space-y-1">
                  <p className="text-red-400">Your Location</p>
                  <p>- Latitude: -</p>
                  <p>- Longitude: -</p>
                  <p>- Altitude: -</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 mt-4">
                <b>Note:</b> GPS 수신까지 10~30초 정도 소요될 수 있습니다. 실외에서 하늘이 보이는 곳에서 시도하세요.
              </div>
            </div>

            {/* Step 2-2 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">2-2</span>
                <h3 className="font-bold text-slate-800">위치 및 모뉴먼트 정보 확인</h3>
              </div>
              <p className="text-slate-600 mb-4">
                GPS 수신이 완료되면 내 위치(위도, 경도, 고도)와 주변 모뉴먼트까지의 거리가 표시됩니다.
              </p>
              <div className="bg-slate-900 rounded-xl p-6">
                <div className="text-slate-300 text-sm space-y-1">
                  <p className="text-red-400 font-bold">Your Location</p>
                  <p>- Latitude: 37.692383</p>
                  <p>- Longitude: 126.756342</p>
                  <p>- Altitude: 38.60</p>
                </div>
                <div className="mt-3 text-sm">
                  <p className="text-red-400 font-bold">Distance to Monuments</p>
                  <p className="text-slate-300">- Domain Space #349 : 7.2 m, 24&deg; NE</p>
                </div>
              </div>
            </div>

            {/* Step 2-3 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">2-3</span>
                <h3 className="font-bold text-slate-800">옵션 설정하기</h3>
              </div>
              <p className="text-slate-600 mb-4">
                AR 화면에 표시할 요소를 선택합니다. 체크박스를 활성화하면 해당 요소가 AR 화면에 나타납니다.
              </p>
              <div className="bg-slate-900 rounded-xl p-6 space-y-3">
                <label className="flex items-center gap-3 text-slate-300">
                  <span className="text-orange-400 text-lg">&#x25CF;</span>
                  <b className="text-orange-400">Grid</b>
                  <span className="w-5 h-5 rounded border-2 border-blue-400 bg-blue-500 flex items-center justify-center text-white text-xs">&#10003;</span>
                  <span className="text-slate-500">- 격자 표시</span>
                </label>
                <label className="flex items-center gap-3 text-slate-300">
                  <span className="text-orange-400 text-lg">&#x25CF;</span>
                  <b className="text-orange-400">Gaze Ring</b>
                  <span className="w-5 h-5 rounded border-2 border-blue-400 bg-blue-500 flex items-center justify-center text-white text-xs">&#10003;</span>
                  <span className="text-slate-500">- 시선 링 표시</span>
                </label>
                <label className="flex items-center gap-3 text-slate-300">
                  <span className="text-lg">&#x25A0;</span>
                  <b className="text-orange-400">Sample Monument</b>
                  <span className="w-5 h-5 rounded border-2 border-blue-400 bg-blue-500 flex items-center justify-center text-white text-xs">&#10003;</span>
                  <span className="text-slate-500">- 샘플 모뉴먼트</span>
                </label>
              </div>
            </div>

            {/* Step 2-4 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">2-4</span>
                <h3 className="font-bold text-slate-800">START AR 버튼 클릭</h3>
              </div>
              <p className="text-slate-600 mb-4">
                우측의 <b className="text-blue-600">START AR</b> 버튼을 탭하면 카메라가 활성화되면서 AR 화면이 시작됩니다.
              </p>
              <div className="flex justify-center">
                <div className="bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg">
                  START<br/>AR
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700 mt-4">
                <b>Note:</b> 카메라 접근 권한을 요청하면 반드시 <b>&quot;허용&quot;</b>을 눌러주세요.
              </div>
            </div>

            {/* Step 2-5 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">2-5</span>
                <h3 className="font-bold text-slate-800">AR 광고 콘텐츠 확인</h3>
              </div>
              <p className="text-slate-600 mb-4">
                카메라를 통해 실제 거리 위에 <b>3D 광고물</b>이 떠 있는 것을 확인할 수 있습니다.
                스마트폰을 좌우로 움직이며 광고가 올바르게 표시되는지 확인하세요.
              </p>
              <div className="bg-gradient-to-b from-slate-200 to-slate-300 rounded-xl p-6 text-center relative overflow-hidden">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-yellow-400 font-bold px-4 py-2 rounded-lg shadow-xl text-sm rotate-[-5deg]">
                  3D 광고물이 실제<br/>거리 위에 표시됩니다
                </div>
                <div className="h-32"></div>
                <div className="bg-white/70 rounded-lg px-3 py-1 text-xs text-slate-600 inline-block">
                  NIN.Earth - Next InterNet on Earth
                </div>
              </div>
            </div>
          </section>

          {/* ========== PART 3: 화면 녹화 ========== */}
          <section className="mb-16 print-break">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">3</div>
              <h2 className="text-2xl font-bold text-slate-900">화면 녹화하기</h2>
            </div>

            {/* Step 3-1 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">3-1</span>
                <h3 className="font-bold text-slate-800">빠른 설정 패널 열기</h3>
              </div>
              <p className="text-slate-600 mb-4">
                화면 <b>상단을 아래로 두 번 스와이프</b>하여 빠른 설정 패널을 완전히 엽니다.
              </p>
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="grid grid-cols-4 gap-3 text-center text-white text-xs">
                  {[
                    { icon: "&#128260;", label: "자동 회전" },
                    { icon: "&#9992;", label: "비행기 모드" },
                    { icon: "&#128294;", label: "손전등" },
                    { icon: "NFC", label: "결제만" },
                    { icon: "&#8597;", label: "모바일\n데이터" },
                    { icon: "&#128246;", label: "모바일\n핫스팟" },
                    { icon: "&#128267;", label: "절전 모드" },
                    { icon: "&#128187;", label: "Windows와\n연결" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-lg" dangerouslySetInnerHTML={{ __html: item.icon }} />
                      <span className="whitespace-pre-line leading-tight">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3-2 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">3-2</span>
                <h3 className="font-bold text-slate-800">&quot;화면 녹화&quot; 버튼 탭</h3>
              </div>
              <p className="text-slate-600 mb-4">
                빠른 설정 패널에서 <b className="text-purple-700">&quot;화면 녹화&quot;</b> 아이콘을 찾아 탭합니다.
              </p>
              <div className="flex justify-center">
                <div className="bg-slate-700 rounded-2xl p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  </div>
                  <span className="text-white text-xs font-medium">화면 녹화</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 mt-4">
                <b>Tip:</b> 화면 녹화 버튼이 보이지 않으면, 빠른 설정 패널을 좌우로 스와이프하거나 편집(연필 아이콘)을 눌러 추가하세요.
              </div>
            </div>

            {/* Step 3-3 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">3-3</span>
                <h3 className="font-bold text-slate-800">녹화 시작</h3>
              </div>
              <p className="text-slate-600 mb-4">
                녹화 옵션 팝업이 뜨면 설정을 확인하고 <b>&quot;녹화 시작&quot;</b>을 탭합니다.
                카운트다운(3, 2, 1...) 후 녹화가 시작됩니다.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                <b>중요:</b> 녹화가 시작된 상태에서 Chrome으로 돌아가 AR 화면을 촬영하세요.
              </div>
            </div>

            {/* Step 3-4 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">3-4</span>
                <h3 className="font-bold text-slate-800">녹화 중지</h3>
              </div>
              <p className="text-slate-600">
                AR 콘텐츠 확인이 끝나면, 화면 상단의 <b>빨간 녹화 표시줄</b>을 탭하거나
                알림 패널을 내려서 <b>&quot;중지&quot;</b> 버튼을 눌러 녹화를 종료합니다.
              </p>
            </div>
          </section>

          {/* ========== PART 4: 저장 및 확인 ========== */}
          <section className="mb-16 print-break">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">4</div>
              <h2 className="text-2xl font-bold text-slate-900">저장된 녹화 확인하기</h2>
            </div>

            {/* Step 4-1 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">4-1</span>
                <h3 className="font-bold text-slate-800">자동 저장</h3>
              </div>
              <p className="text-slate-600">
                녹화가 종료되면 동영상이 <b>자동으로 저장</b>됩니다.
                별도로 저장 버튼을 누를 필요가 없습니다.
              </p>
            </div>

            {/* Step 4-2 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">4-2</span>
                <h3 className="font-bold text-slate-800">갤러리에서 확인</h3>
              </div>
              <p className="text-slate-600 mb-4">
                녹화된 영상은 아래 위치에서 확인할 수 있습니다:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">&#127909;</div>
                  <div>
                    <p className="font-bold text-slate-800">갤러리 앱</p>
                    <p className="text-sm text-slate-500">갤러리 &gt; 화면 녹화 폴더</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">&#128193;</div>
                  <div>
                    <p className="font-bold text-slate-800">내 파일 앱</p>
                    <p className="text-sm text-slate-500">내 파일 &gt; 내장 메모리 &gt; DCIM &gt; Screen recordings</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">&#128247;</div>
                  <div>
                    <p className="font-bold text-slate-800">Google 포토</p>
                    <p className="text-sm text-slate-500">Google 포토 앱 &gt; 라이브러리 &gt; 화면 녹화</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4-3 */}
            <div className="step-card bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">4-3</span>
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
                  <span>공유 버튼 탭</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">3</span>
                  <span>카카오톡, 이메일, 또는 메시지로 전송</span>
                </div>
              </div>
            </div>
          </section>

          {/* ========== Video Reference ========== */}
          <section className="mb-16 no-print">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-lg">&#9654;</div>
              <h2 className="text-2xl font-bold text-slate-900">참고 영상</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <video
                  controls
                  playsInline
                  className="w-full aspect-[9/16] max-h-[500px] object-contain bg-black"
                  src="/guide1.mp4"
                />
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 mb-1">AR 접속 및 확인</h3>
                  <p className="text-sm text-slate-500">Chrome 접속 → NIN.Earth → AR 페이지 → 3D 광고 확인</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <video
                  controls
                  playsInline
                  className="w-full aspect-[9/16] max-h-[500px] object-contain bg-black"
                  src="/guide2.mp4"
                />
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 mb-1">화면 녹화 방법</h3>
                  <p className="text-sm text-slate-500">빠른 설정 패널 → 화면 녹화 → 갤러리에서 확인</p>
                </div>
              </div>
            </div>
          </section>

          {/* ========== Quick Summary ========== */}
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
