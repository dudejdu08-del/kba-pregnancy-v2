export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">
        개인정보처리방침
      </h1>

      <div className="space-y-6 text-sm leading-7">
        <div>
          <h2 className="font-bold">1. 수집하는 개인정보 항목</h2>
          <p>
            KBA PARTNERS는 임신 준비 체크 서비스 제공 및 상담 안내를 위해 아래 개인정보를 수집합니다.
          </p>
          <p>[필수] 이름</p>
          <p>[필수] 출생연도</p>
          <p>[필수] 연락처(카카오계정 전화번호)</p>
        </div>

        <div>
          <h2 className="font-bold">2. 개인정보 수집 및 이용 목적</h2>
          <p>카카오 간편 회원가입 진행</p>
          <p>회원 식별 및 본인 확인</p>
          <p>임신 준비 체크 서비스 제공</p>
          <p>출산 혜택 및 정부지원금 안내</p>
          <p>태아보험 및 여성질환 정보 안내</p>
          <p>상담 진행 및 고객 응대</p>
        </div>

        <div>
          <h2 className="font-bold">3. 개인정보 보유 및 이용기간</h2>
          <p>
            수집된 개인정보는 이용 목적 달성 시까지 보관하며,
            관련 법령에 따라 필요한 경우 해당 기간 동안 보관 후 파기합니다.
          </p>
        </div>

        <div>
          <h2 className="font-bold">4. 문의처</h2>
          <p>kbapartners19@gmail.com</p>
        </div>
      </div>
    </main>
  );
}