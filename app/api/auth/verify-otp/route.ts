import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sanitizeEmail } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const { email: rawEmail, otp } = await request.json();
    const email = sanitizeEmail(rawEmail as string);

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from("User")
      .select("id, otp, otpExpiry")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json({ error: "No OTP requested" }, { status: 400 });
    }

    const expiryStr = user.otpExpiry.endsWith("Z")
      ? user.otpExpiry
      : `${user.otpExpiry}Z`;
    if (new Date() > new Date(expiryStr)) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    await supabaseAdmin
      .from("User")
      .update({
        otp: null,
        otpExpiry: null,
        emailVerified: true,
      })
      .eq("id", user.id);

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
