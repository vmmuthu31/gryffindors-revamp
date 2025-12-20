import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { mentorId } = await request.json();

    if (!mentorId) {
      return NextResponse.json(
        { error: "Mentor ID required" },
        { status: 400 }
      );
    }

    const { data: mentor, error: mentorError } = await supabaseAdmin
      .from("User")
      .select("id")
      .eq("id", mentorId)
      .eq("role", "MENTOR")
      .single();

    if (mentorError || !mentor) {
      return NextResponse.json({ error: "Invalid mentor" }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from("Application")
      .update({ mentor_id: mentorId })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to assign mentor:", error);
    return NextResponse.json(
      { error: "Failed to assign mentor" },
      { status: 500 }
    );
  }
}
