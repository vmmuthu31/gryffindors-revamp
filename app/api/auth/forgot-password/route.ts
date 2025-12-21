import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parseResult = ForgotPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = parseResult.data;

    const { data: user } = await supabaseAdmin
      .from("User")
      .select("id, name")
      .eq("email", email.toLowerCase())
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    const newPassword = nanoid(10);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await supabaseAdmin
      .from("User")
      .update({ passwordHash: hashedPassword })
      .eq("id", user.id);

    await sendPasswordResetEmail({
      email: email.toLowerCase(),
      name: user.name || "Student",
      newPassword: newPassword,
    });

    return NextResponse.json({
      success: true,
      message: "New password sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
