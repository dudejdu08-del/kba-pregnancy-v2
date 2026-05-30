import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const data = await request.json();

  const { error } = await supabaseAdmin.from("pregnancy_v2_leads").insert({
    name: data.name || null,
    gender: data.gender || null,
    birthyear: data.birthyear || null,
    phone: data.phone || null,
    career_stage: data.career_stage || null,
    main_concern: data.main_concern || null,
    agree_privacy: data.agree_privacy,
    agree_third_party: data.agree_third_party,
  });

  if (error) {
    console.log("Supabase 저장 오류:", error);
    return NextResponse.json(
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}