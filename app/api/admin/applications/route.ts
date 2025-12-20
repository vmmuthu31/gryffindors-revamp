import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AppStatus } from "@/lib/supabase/types";

interface AppRow {
  id: string;
  userId: string;
  internshipId: string;
  createdAt: string;
  [key: string]: unknown;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as AppStatus | null;

    let query = supabaseAdmin
      .from("Application")
      .select("*")
      .order("createdAt", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    const applications = (data || []) as AppRow[];

    const appsWithRelations = await Promise.all(
      applications.map(async (app) => {
        const { data: user } = await supabaseAdmin
          .from("User")
          .select("id, name, email")
          .eq("id", app.userId)
          .single();

        const { data: internship } = await supabaseAdmin
          .from("Internship")
          .select("id, title, track")
          .eq("id", app.internshipId)
          .single();

        return {
          ...app,
          createdAt: app.createdAt,
          user,
          internship,
        };
      })
    );

    return NextResponse.json(appsWithRelations);
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
