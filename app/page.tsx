"use client";

import { useEffect, useState } from "react";

const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY || "";

const reviews = [
  [
    "💬 임신 전 준비 체크",
    "출산하면 100만원 보장만 알고 있었는데, 임신 전에 확인해야 하는 조건이 있다는 걸 처음 알았어요.",
    "김** · 26세 · 임신 준비 중",
  ],
  [
    "💬 난임 검사 전 점검",
    "검사 전에 먼저 확인해야 할 항목을 정리해줘서 막막함이 줄었어요, 너무 고마워요^^ ",
    "박** · 36세 · 난임 검사 고민",
  ],
  [
    "💬 예비맘 보장 체크",
    "임신하고 나서 알아보면 늦을 수 있다는 말이 와닿았어요. 미리 점검하길 잘했어요.",
    "이** · 31세 · 신혼",
  ],
  [
    "💬 기존 플랜 점검",
    "이미 준비해둔 게 충분한 줄 알았는데, 막상 확인해보니 놓치고 있던 항목들이 있더라고요.",
    "최** · 34세 · 기혼",
  ],
  [
    "💬 둘째 준비",
    "첫째 때는 몰랐던 부분을 둘째 준비하면서 다시 확인할 수 있어서 너무 좋았어요!!",
    "정** · 37세 · 둘째 계획",
  ],
  [
    "💬 상담 부담 없음",
    "온라인 상담으로도 꼼꼼히 안내해주시고, 부담 없이 궁금한 점 물어볼 수 있어서 좋았어요.",
    "한** · 35세 · 임신 준비 중",
  ],
];

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function Page() {
  const [mode, setMode] = useState<"landing" | "survey" | "complete">("landing");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("kakao") === "success") {
      setName(params.get("name") || "");
      setGender(params.get("gender") || "");
      setBirthyear(params.get("birthyear") || "");
      setPhone(params.get("phone") || "");

      setMode("survey");
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthyear, setBirthyear] = useState("");
  const [phone, setPhone] = useState("");
  const [pregnancyStage, setPregnancyStage] = useState<string[]>([]);
  const [mainConcern, setMainConcern] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [agree1, setAgree1] = useState(true);
  const [agree2, setAgree2] = useState(true);
  const [modal, setModal] = useState<null | "privacy" | "third">(null);
  const [isMoving, setIsMoving] = useState(false);

  const submitLead = async () => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          gender,
          birthyear,
          phone,
          career_stage: pregnancyStage.join(", "),
          main_concern: mainConcern.join(", "),
          agree_privacy: agree1,
          agree_third_party: agree2,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert("DB 저장 실패: " + JSON.stringify(result));
        console.log(result);
        return;
      }

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead");
      }

      setTimeout(() => {
        setMode("complete");
      }, 500);

    } catch (error) {
      alert("DB 연결 오류");
      console.log(error);
    }
  };

  const kakaoLogin = () => {
    setIsMoving(true);

    if (!KAKAO_REST_API_KEY) {
      alert("카카오 REST API KEY가 연결되지 않았습니다.");
      setIsMoving(false);
      return;
    }

    const redirectUri =
      "https://kba-pregnancy-v2.vercel.app/api/auth/kakao/callback";

    const scope = ["name", "gender", "birthyear", "phone_number"].join(",");

    const surveyData = {
      name,
      gender,
      birthyear,
      phone,
      career_stage: pregnancyStage,
      main_concern: mainConcern,
      investment_products: benefits,
      agree_privacy: agree1,
      agree_third_party: agree2,
    };

    const state = encodeURIComponent(JSON.stringify(surveyData));

    const kakaoUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${KAKAO_REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&state=${state}` +
      `&prompt=login`;

    window.location.href = kakaoUrl;
  };

  const toggleBenefit = (item: string) => {
    setBenefits((prev) =>
      prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]
    );
  };

  const togglePregnancyStage = (item: string) => {
    setPregnancyStage((prev) =>
      prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]
    );
  };

  const toggleMainConcern = (item: string) => {
    setMainConcern((prev) =>
      prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]
    );
  };

  const canNext =
    step === 1
      ? pregnancyStage.length > 0
      : step === 2
      ? mainConcern.length > 0
      : agree1 && agree2;

  if (mode === "complete") {
    return (
      <main className="min-h-screen bg-[#FFF7F3] px-5 text-[#2F2F2F]">
        <div className="mx-auto flex min-h-screen max-w-[560px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E85F83] text-[42px] font-black text-white shadow-[0_20px_45px_rgba(232,95,131,0.28)]">
            ✓
          </div>

          <p className="mt-8 text-[13px] font-black italic tracking-[0.35em] text-[#E85F83]">
            APPLICATION COMPLETE
          </p>

          <h1 className="mt-5 text-[42px] font-black leading-[1.2] tracking-[-0.06em] text-[#2F2F2F]">
            혜택 체크 신청이
            <br />
            완료되었습니다
          </h1>

          <p className="mt-6 text-[16px] leading-[1.8] text-[#666]">
            입력해주신 내용을 바탕으로
            <br />
            임신·출산 혜택과 여성 보장 내용을 확인해드릴게요.
          </p>

          <div className="mt-10 w-full rounded-[22px] border border-[#FFE1E8] bg-white px-6 py-7 shadow-sm">
            <p className="text-[17px] font-black text-[#E85F83]">
              상담 안내
            </p>
            <p className="mt-4 text-[14px] leading-[1.8] text-[#666]">
              영업일 기준 1~2일 내
              <br />
              전문 상담 담당자가 순차적으로 연락드립니다.
            </p>
          </div>

          <button
            onClick={() => {
              window.history.replaceState({}, "", "/");
              setMode("landing");
              setStep(1);
            }}
            className="mt-8 w-full rounded-[16px] bg-[#E85F83] py-5 text-[17px] font-black text-white shadow-[0_18px_40px_rgba(232,95,131,0.24)]"
          >
            처음 화면으로 돌아가기
          </button>

          <p className="mt-10 text-[11px] md:text-[12px] font-bold text-[#999]">
            KBA PARTNERS
          </p>
        </div>
      </main>
    );
  }

  if (mode === "survey") {
    return (
      <main className="min-h-screen bg-[#FFF7F3] text-[#2F2F2F]">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(232,95,131,0.16),transparent_48%)]" />

        {modal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-5 backdrop-blur-sm">
            <div className="w-full max-w-[420px] rounded-[24px] bg-white px-6 py-7 text-[#1A1A1A] shadow-2xl">
              {modal === "privacy" && (
                <>
                  <h3 className="text-[24px] font-black">
                    개인정보 수집 및 이용 동의
                  </h3>

                  <div className="mt-7 space-y-5 text-[14px] leading-[2] text-[#555]">
                    <div>
                      <p className="font-black text-[#222]">
                        개인정보 수집 및 이용 항목
                      </p>
                      <p className="mt-1">
                        이름, 출생연도, 연락처, 임신 전 준비 관련 관심 항목
                      </p>
                    </div>

                    <div>
                      <p className="font-black text-[#222]">
                        개인정보 수집 및 이용 목적
                      </p>
                      <p className="mt-2">- 임신 전 준비 체크 상담 안내</p>
                      <p>- 여성 특화 보장 항목 안내</p>
                      <p>- 고객 식별 및 상담 예약 진행</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setModal(null)}
                    className="mt-8 h-[58px] w-full rounded-[14px] bg-[#E85F83] text-[16px] md:text-[18px] font-black text-white"
                  >
                    확인
                  </button>
                </>
              )}

              {modal === "third" && (
                <>
                  <h3 className="text-[24px] font-black">
                    개인정보 제3자 제공 동의
                  </h3>

                  <div className="mt-7 space-y-5 text-[14px] leading-[2] text-[#555]">
                    <div>
                      <p className="font-black text-[#222]">
                        제공하는 개인정보 항목
                      </p>
                      <p className="mt-1">
                        이름, 출생연도, 연락처, 상담 신청 내용
                      </p>
                    </div>

                    <div>
                      <p className="font-black text-[#222]">
                        개인정보 제공 목적
                      </p>
                      <p className="mt-2">- 신청 내용 확인 및 상담 진행</p>
                      <p>- 임신 전 준비 관련 보장 안내 및 예약 진행</p>
                    </div>

                    <div>
                      <p className="font-black text-[#222]">
                        개인정보를 제공받는 자의 보유 및 이용 기간
                      </p>
                      <p className="mt-1">5년</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setModal(null)}
                    className="mt-8 h-[58px] w-full rounded-[14px] bg-[#E85F83] text-[16px] md:text-[18px] font-black text-white"
                  >
                    확인
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="sticky top-0 z-50 border-b border-[#FFE1E8] bg-[#FFF7F3]/95 backdrop-blur">
          <div className="mx-auto max-w-[560px] px-5 py-4">
            <div className="flex items-center justify-between text-[11px] md:text-[11px] md:text-[12px] font-black tracking-[0.12em]">
              <span className="text-[#999]">STEP {step} / 3</span>
              <span className="text-[#E85F83]">{step === 1 ? 33 : step === 2 ? 66 : 100}%</span>
            </div>

            <div className="mt-3 h-[3px] rounded-full bg-[#FFE1E8]">
              <div
                className="h-full rounded-full bg-[#E85F83] transition-all duration-300"
                style={{ width: `${step === 1 ? 33 : step === 2 ? 66 : 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[560px] px-5 pb-32 pt-14">
          {step === 1 && (
            <>
              <p className="text-[13px] font-black italic tracking-[0.25em] text-[#E85F83]">
                Q1 / 3
              </p>

              <h1 className="mt-5 text-[44px] font-black leading-[1.18] tracking-[-0.06em]">
                현재 <span className="text-[#E85F83]">상황</span>을 알려주세요
              </h1>

              <p className="mt-5 text-[15px] leading-relaxed">
                <span className="font-bold text-[#E85F83]">
                  ⚠️ 현재 임신 중이라면 해당 체크 대상이 아닙니다.
                </span>
                <br />
                <span className="text-[#666]">
                  임신 전, 임신을 계획하시는 분만 신청 가능합니다.
                </span>
              </p>

              <div className="mt-12 space-y-4">
                {[
                  ["임신 계획 중", "가장 많이 확인하는 준비 항목 체크"],
                  ["1년 이내 임신 계획 중", "임신 전 미리 준비하면 좋은 내용 확인"],
                  ["2년 이내 임신 계획 중", "여유 있게 준비할 수 있는 항목 안내"],
                  ["둘째·셋째 계획 중", "첫째 때 놓쳤던 부분 다시 점검"],
                ].map(([title, desc]) => (
                  <button
                    key={title}
                    onClick={() => setPregnancyStage([title])}
                    className={`w-full rounded-[20px] border px-6 py-7 text-left transition ${
                      pregnancyStage.includes(title)
                        ? "border-[#E85F83] bg-[#FFF0F3]"
                        : "border-[#FFE1E8] bg-white"
                    }`}
                  >
                    <p className="text-[22px] font-black">{title}</p>
                    <p className="mt-3 text-[14px] text-[#666]">{desc}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-[13px] font-black italic tracking-[0.25em] text-[#E85F83]">
                Q2 / 3
              </p>

              <h1 className="mt-5 text-[44px] font-black leading-[1.18] tracking-[-0.06em]">
                가장 <span className="text-[#E85F83]">궁금한 항목</span>은?
              </h1>

              <p className="mt-5 text-[15px] text-[#666]">
                선택에 따라 체크 포인트가 달라집니다
              </p>

              <p className="mt-3 text-[14px] font-semibold text-[#E85F83]">
              ✓ 중복 선택 가능
              </p>

              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {[
                  ["🎁", "출산 시 100만원 혜택", "그 외 내용확인"],
                  ["📋", "임신 준비 체크리스트", "준비 항목 점검"],
                  ["💰", "정부지원금 확인", "지원금 체크"],
                  ["🏥", "여성질환 체크", "임신 전 점검"],
                  ["🍼", "출산 후 부담", "비용 부담 체크"],
                  ["🛡️", "태아보험 안내", "미리 알아보기"],
                  ["📑", "무료 보험 리모델링", "기존 보장 점검"],
                  ["🌱", "처음 알아봐요", "기초부터 안내"],
                ].map(([icon, title, desc]) => (
                  <button
                    key={title}
                    onClick={() => toggleMainConcern(title)}
                    className={`flex min-h-[88px] items-center justify-between rounded-[18px] border px-4 py-4 text-left transition sm:min-h-[120px] sm:px-5 sm:py-6 ${
                      mainConcern.includes(title)
                        ? "border-[#E85F83] bg-[#FFF0F3]"
                        : "border-[#FFE1E8] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#FFF0F3] text-[26px]">
                        {icon}
                      </div>

                      <div>
                        <p className="text-[16px] font-black leading-[1.35] sm:text-[18px]">{title}</p>
                        <p className="mt-1 text-[11px] leading-[1.4] text-[#666] sm:text-[12px]">{desc}</p>
                      </div>
                    </div>

                    <div
                      className={`ml-3 h-6 w-6 shrink-0 rounded-full border ${
                        mainConcern.includes(title)
                          ? "border-[#E85F83] bg-[#E85F83]"
                          : "border-[#E85F83]/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-[13px] font-black italic tracking-[0.25em] text-[#E85F83]">
                FINAL / 3
              </p>

              <h1 className="mt-5 text-[44px] font-black leading-[1.18] tracking-[-0.06em]">
                <span className="text-[#E85F83]">임신 전 준비 체크</span>
                <br />
                신청을 완료해주세요
              </h1>

              <p className="mt-5 text-[15px] text-[#666]">
                아래 정보로 접수됩니다. 확인 후 동의해주세요.
              </p>

              <div className="mt-12 rounded-[24px] border border-[#FFE1E8] bg-white px-6 py-7 shadow-sm">
                <div className="flex items-center justify-between py-4">
                  <button
                    onClick={() => setAgree1(!agree1)}
                    className="flex items-center gap-4"
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-sm text-white ${
                        agree1 ? "bg-[#E85F83]" : "bg-[#EEE]"
                      }`}
                    >
                      ✓
                    </div>

                    <span className="text-[14px] font-bold text-[#555]">
                      [필수] 개인정보 수집 및 이용 동의
                    </span>
                  </button>

                  <button
                    onClick={() => setModal("privacy")}
                    className="text-[13px] font-black text-[#E85F83] underline"
                  >
                    보기
                  </button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <button
                    onClick={() => setAgree2(!agree2)}
                    className="flex items-center gap-4"
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-sm text-white ${
                        agree2 ? "bg-[#E85F83]" : "bg-[#EEE]"
                      }`}
                    >
                      ✓
                    </div>

                    <span className="text-[14px] font-bold text-[#555]">
                      [필수] 개인정보 제3자 제공 동의
                    </span>
                  </button>

                  <button
                    onClick={() => setModal("third")}
                    className="text-[13px] font-black text-[#E85F83] underline"
                  >
                    보기
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            disabled={!canNext}
            onClick={() => {
              if (!canNext) return;

              if (step < 3) {
                setStep(step + 1);
                return;
              }

              submitLead();
            }}
            className={`mt-10 h-[64px] w-full rounded-[18px] text-[20px] font-black transition ${
              canNext
                ? "bg-[#E85F83] text-white"
                : "bg-[#F0C6D0] text-white"
            }`}
          >
            {step < 3 ? "선택 후 다음으로" : "🎁 내가 받을 수 있는 혜택 확인"}
          </button>

          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-5 w-full text-[14px] font-bold text-[#777]"
            >
              이전 단계로
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF7F3] pb-28 text-[#2F2F2F]">
      <style jsx global>{`
        @keyframes reviewMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .review-track {
          animation: reviewMove 28s linear infinite;
        }
      `}</style>

      <section className="relative flex min-h-[560px] justify-center overflow-hidden px-5 pt-10 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFE3E8] via-[#FFF7F3] to-[#FFF7F3]" />
        <div className="absolute left-[-90px] top-[80px] h-[220px] w-[220px] rounded-full bg-[#FFD1DC]/60 blur-3xl" />
        <div className="absolute right-[-80px] top-[230px] h-[220px] w-[220px] rounded-full bg-[#FFE2B8]/60 blur-3xl" />

        <div className="relative z-10 w-full max-w-[430px]">
          <p className="text-[13px] font-semibold italic tracking-[0.28em] text-[#D85C7A]">
            Pre-Mom Care Check · 2026
          </p>

          <h1 className="mt-7 text-[38px] font-black leading-[1.16] tracking-[-0.06em] text-[#2F2F2F] sm:text-[43px]">
            예비맘들이 가장
            <br />
            많이 놓치는 준비,
            <br />
            <span className="text-[#E85F83]">임신 후에는</span>
            <br />
            늦을 수 있습니다
          </h1>

          <p className="mt-7 text-[16px] font-bold leading-[1.7] text-[#555]">
            임신 시 50만원 혜택 가능성부터
            <br />
            난임·출산·여성질환 준비 체크
          </p>

          <p className="mt-6 text-[14px] text-[#777]">
            단 <span className="text-[20px] font-black text-[#E85F83]">3초</span>
            만에 임신 전 체크 포인트 확인
          </p>

          <div className="mx-auto mt-9 h-px w-10 bg-[#E85F83]" />

          <button
            onClick={kakaoLogin}
            className="mt-9 flex w-full items-center justify-center gap-3 rounded-[14px] bg-[#FFE500] py-5 text-[16px] font-black text-[#151515] shadow-lg"
          >
            {isMoving
              ? "카카오 로그인으로 이동중입니다..."
              : "💬 카카오로 임신 전 준비 체크하기"}
          </button>

          <div className="mt-8 animate-bounce text-[13px] font-semibold text-[#999]">
            스크롤을 내려주세요 ↓
          </div>

          <div className="mx-auto mt-10 h-px max-w-[560px] bg-[#FFE1E8]" />
        </div>
      </section>

      <section className="px-5 pb-8">
        <div className="mx-auto max-w-[560px]">
          <h2 className="text-[27px] font-black leading-[1.35] tracking-[-0.04em] text-[#2F2F2F]">
            이런 고민,
            <br />
            한 번쯤 해보셨나요?
          </h2>

          <div className="mt-7 space-y-3">
            {[
              ["💸", "언제 준비해야 할지 모르겠어요..", "주변에서는 미리 확인하라는데 뭘 확인해야 하는지 모르겠어요."],
              ["🔍", "출산 준비 비용이 생각보다 많이 든다던데..", "조리원, 산전검사, 육아용품까지 돈 나갈 생각하면 막막해요."],
              ["🏥", "지금 준비 안 하면 놓치는 게 있을까 걱정돼요..", "나중에 후회하지 않도록 미리 확인하고 싶어요."],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-[14px] border border-[#FFE1E8] bg-white px-5 py-5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#FFF0F3] text-[24px]">
                  {icon}
                </div>
                <div>
                  <h3 className="text-[16px] font-black text-[#2F2F2F]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#666]">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="my-10 h-px w-full bg-[#FFE1E8]" />

          <h2 className="text-[28px] font-black leading-[1.35] tracking-[-0.04em] text-[#2F2F2F]">
            임신 전에 확인하면
            <br />
            <span className="text-[#E85F83]">놓치는 일을</span> 줄일 수 있어요
          </h2>

          <p className="mt-5 text-[14px] leading-relaxed text-[#666]">
            결혼 예정, 신혼, 임신 준비 중이라면
            <span className="font-bold text-[#2F2F2F]"> 한 번쯤 확인해보는 </span>
            항목들입니다.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {[
              ["임신 시 50만원", "임신 전 준비해야 확인 가능한 항목"],
              ["난임 관련 준비", "검사 전 알아두면 좋은 준비 포인트"],
              ["놓치기 쉬운 혜택", "정부지원금 등 미리 확인하면 좋은 항목"],
              ["여성 건강 체크", "많은 예비맘들이 궁금해하는 항목"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-[12px] border border-[#FFE1E8] bg-white px-5 py-5 shadow-sm"
              >
                <h3 className="text-[15px] font-black text-[#E85F83]">
                  {title}
                </h3>
                <p className="mt-3 text-[11px] md:text-[12px] leading-relaxed text-[#666]">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="my-10 h-px w-full bg-[#FFE1E8]" />
        </div>
      </section>

      <section className="px-5 pb-10">
        <div className="mx-auto max-w-[560px]">
          <h2 className="text-[30px] font-black leading-[1.28] tracking-[-0.05em] text-[#2F2F2F]">
            나도 지금
            <br />
            <span className="text-[#E85F83]">확인해봐야 할까?</span>
          </h2>

          <p className="mt-5 text-[14px] leading-[1.8] text-[#666]">
           아래 항목 중 하나라도 해당된다면,
            <br />
            임신 전 준비 항목을 한 번쯤 체크해보는 것이 좋습니다.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ["✓", "결혼 예정 또는 신혼", "아직 임신 전이라면 미리 확인하기 좋은 시기"],
              ["✓", "1년 이내 임신 계획", "준비 시기에 따라 확인 항목이 달라질 수 있어요"],
              ["✓", "둘째·셋째 고민 중", "이전과 달라진 상황을 다시 점검해볼 수 있어요"],
              ["✓", "난임 검사 고민", "검사 전 미리 알아두면 좋은 준비 포인트"],
            ].map(([icon, title, desc], index) => (
              <div
                key={title}
                className={`rounded-[20px] border px-5 py-6 shadow-sm ${
                  index % 2 === 0
                    ? "border-[#FFE1E8] bg-[#FFF9F4]"
                    : "border-[#DDEEFF] bg-[#F5FAFF]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[24px] font-black shadow-sm ${
                      index % 2 === 0
                        ? "bg-[#FFE8D6] text-[#E85F83]"
                        : "bg-[#E6F2FF] text-[#4D8FD6]"
                    }`}
                  >
                    {icon}
                  </div>

                  <div>
                    <h3 className="text-[17px] font-black leading-[1.35] text-[#2F2F2F]">
                      {title}
                    </h3>
                    <p className="mt-2 text-[11px] md:text-[12px] leading-[1.6] text-[#666]">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[18px] border border-[#FFE1E8] bg-white px-5 py-5 text-center shadow-sm">
            <p className="text-[16px] font-black leading-[1.6] text-[#2F2F2F]">
              하나라도 해당된다면,
              <br />
              <span className="text-[#E85F83]">
                지금 한 번쯤 확인해볼 시기일 수 있습니다.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-8">
        <div className="mx-auto max-w-[680px] overflow-hidden">
          <div className="my-10 h-px w-full bg-[#FFE1E8]" />

          <h2 className="ml-6 text-[29px] font-black leading-[1.35] tracking-[-0.04em] text-[#2F2F2F]">
            미리 준비했던
            <br />
            예비맘들의 <span className="text-[#E85F83]">체크 후기</span>
          </h2>

          <div className="mt-9 flex w-max gap-4 review-track">
            {[...reviews, ...reviews].map(([tag, text, name], index) => (
              <div
                key={index}
                className="h-[230px] w-[290px] rounded-[17px] border border-[#FFE1E8] bg-white px-6 py-6 shadow-sm"
              >
                <div className="inline-flex rounded-full border border-[#E85F83]/30 bg-[#FFF0F3] px-3 py-1 text-[11px] font-black text-[#E85F83]">
                  {tag}
                </div>

                <p className="mt-5 text-[15px] font-bold leading-[1.8] text-[#2F2F2F]">
                  “{text}”
                </p>

                <p className="mt-7 text-[11px] md:text-[12px] font-bold text-[#777]">
                  {name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-8 pb-10 text-[#777]">
        <div className="mx-auto max-w-[560px] border-t border-[#FFE1E8] pt-8">
          <p className="text-[13px] font-black text-[#2F2F2F]">
            KBA PARTNERS
          </p>

          <p className="mt-4 text-[11px] leading-relaxed">
            사업자등록번호 497-88-01157
            <span className="mx-3 text-[#DDD]">|</span>
            주소 서울시 금천구 가산디지털1로 219, 벽산디지털밸리6차
            1306호
          </p>

          <a
            href="/privacy"
            className="mt-4 inline-block text-[11px] font-bold underline"
          >
             개인정보처리방침
          </a>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 bg-white/92 px-4 pb-4 pt-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div className="mx-auto max-w-[560px]">
          <button
            onClick={kakaoLogin}
            className="flex w-full items-center justify-center gap-3 rounded-[14px] bg-[#FFE500] py-5 text-[15px] font-black text-[#151515]"
          >
            {isMoving
              ? "카카오 로그인으로 이동중입니다..."
              : "🎁 출산 혜택 확인하기"}
          </button>
        </div>
      </div>
    </main>
  );
}