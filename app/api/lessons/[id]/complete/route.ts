import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: lessonId } = await params;

    const { data: existing } = await supabaseAdmin
      .from("lesson_progress")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("lesson_id", lessonId)
      .single();

    let progress;
    if (existing) {
      const { data, error } = await supabaseAdmin
        .from("lesson_progress")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      progress = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("lesson_progress")
        .insert({
          user_id: session.user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      progress = data;
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Failed to mark lesson complete:", error);
    return NextResponse.json(
      { error: "Failed to mark complete" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ completed: false });
    }

    const { id: lessonId } = await params;

    const { data: progress } = await supabaseAdmin
      .from("lesson_progress")
      .select("completed")
      .eq("user_id", session.user.id)
      .eq("lesson_id", lessonId)
      .single();

    return NextResponse.json({ completed: progress?.completed || false });
  } catch {
    return NextResponse.json({ completed: false });
  }
}
