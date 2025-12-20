import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Role } from "@/lib/supabase/types";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") as Role | null;

    let query = supabaseAdmin
      .from("User")
      .select("id, name, email, role, createdAt")
      .order("createdAt", { ascending: false });

    if (role) {
      query = query.eq("role", role);
    }

    const { data: users, error } = await query;

    if (error) throw error;

    const usersWithApplications = await Promise.all(
      (users || []).map(async (user) => {
        const { data: applications } = await supabaseAdmin
          .from("Application")
          .select("id, status, internshipId")
          .eq("userId", user.id);

        const appsWithInternships = await Promise.all(
          (applications || []).map(async (app) => {
            const { data: internship } = await supabaseAdmin
              .from("Internship")
              .select("title")
              .eq("id", app.internshipId)
              .single();

            return {
              id: app.id,
              status: app.status,
              internship: internship || { title: "" },
            };
          })
        );

        return {
          ...user,
          createdAt: user.createdAt,
          applications: appsWithInternships,
        };
      })
    );

    return NextResponse.json(usersWithApplications);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.email || !data.password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const { data: exists } = await supabaseAdmin
      .from("User")
      .select("id")
      .eq("email", data.email)
      .single();

    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const { data: user, error } = await supabaseAdmin
      .from("User")
      .insert({
        id: nanoid(),
        name: data.name || null,
        email: data.email,
        passwordHash: passwordHash,
        role: data.role || "STUDENT",
      })
      .select("id, email, role")
      .single();

    if (error) throw error;

    return NextResponse.json(
      { id: user.id, email: user.email, role: user.role },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
