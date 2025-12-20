import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: internships, error } = await supabaseAdmin
      .from("Internship")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(internships);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch internships" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { data: internship, error } = await supabaseAdmin
      .from("Internship")
      .insert({
        title: data.title,
        track: data.track,
        price: data.price,
        duration: data.duration,
        curriculum: data.curriculum || {},
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(internship);
  } catch {
    return NextResponse.json(
      { error: "Failed to create internship" },
      { status: 500 }
    );
  }
}
