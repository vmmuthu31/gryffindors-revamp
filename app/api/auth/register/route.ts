import { supabaseAdmin } from "@/lib/supabase/admin";
import { sanitizeInput, sanitizeEmail } from "@/lib/security";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const { name: rawName, email: rawEmail, password } = await request.json();

    const name = sanitizeInput(rawName);
    const email = sanitizeEmail(rawEmail);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabaseAdmin
      .from("User")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabaseAdmin
      .from("User")
      .insert({
        id: nanoid(),
        name,
        email,
        passwordHash: passwordHash,
        role: "STUDENT",
        updatedAt: new Date().toISOString(),
      })
      .select("id, email, name")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
