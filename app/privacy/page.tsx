export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FFF7F3] px-5 py-12 text-[#2F2F2F]">
      <div className="mx-auto max-w-[720px] rounded-3xl bg-white p-7 shadow-sm">
        <h1 className="text-3xl font-black">개인정보처리방침</h1>

        <p className="mt-6 text-sm leading-7 text-[#666]">
          KBA PARTNERS는 임신·출산 혜택 체크 및 상담 안내를 위해 아래와 같이
          개인정보를 수집·이용합니다.
        </p>

        <section className="mt-8 space-y-6 text-sm leading-7 text-[#555]">
          <div>
            <h2 className="font-black text-[#E85F83]">1. 수집 항목</h2>
            <p>이름, 출생연도, 연락처, 상담 신청 내용</p>
          </div>

          <div>
            <h2 className="font-black text-[#E85F83]">2. 수집 및 이용 목적</h2>
            <p>
              임신·출산 혜택 체크, 여성 특화 보장 안내, 상담 예약 및 고객 문의 응대
            </p>
          </div>

          <div>
            <h2 className="font-black text-[#E85F83]">3. 보유 및 이용 기간</h2>
            <p>
              상담 신청일로부터 5년 또는 정보주체의 삭제 요청 시까지 보관합니다.
            </p>
          </div>

          <div>
            <h2 className="font-black text-[#E85F83]">4. 제3자 제공</h2>
            <p>
              상담 진행을 위해 제휴 상담 담당자 또는 보험 상담 담당자에게 필요한
              범위 내에서 제공될 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="font-black text-[#E85F83]">5. 개인정보 보호책임자</h2>
            <p>
              KBA PARTNERS<br />
              이메일: kbapartners19@gmail.com
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}