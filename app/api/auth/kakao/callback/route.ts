import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/?kakao=error`);
  }

  const redirectUri = `${origin}/api/auth/kakao/callback`;

  const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id:
        process.env.KAKAO_REST_API_KEY ||
        process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY ||
        "",
      redirect_uri: redirectUri,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    console.log("카카오 토큰 오류:", tokenData);
    return NextResponse.redirect(`${origin}/?kakao=token_error`);
  }

  const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  const userData = await userResponse.json();
  const kakaoAccount = userData.kakao_account || {};

  const params = new URLSearchParams({
    kakao: "success",
    kakao_id: String(userData.id || ""),
    name: kakaoAccount.name || "",
    gender: kakaoAccount.gender || "",
    birthyear: kakaoAccount.birthyear || "",
    phone: kakaoAccount.phone_number || "",
  });

  return NextResponse.redirect(`${origin}/?${params.toString()}`);
}