import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendOTPEmail } from "@/lib/email";
import { generateOTP, sanitizeEmail } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const { email: rawEmail } = await request.json();
    const email = sanitizeEmail(rawEmail);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data: user, error } = await supabaseAdmin
      .from("User")
      .select("id")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabaseAdmin
      .from("User")
      .update({ otp, otpExpiry: otpExpiry })
      .eq("id", user.id);

    const sent = await sendOTPEmail(email, otp);

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
