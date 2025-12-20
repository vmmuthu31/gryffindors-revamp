import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: course, error } = await supabaseAdmin
      .from("Course")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const { data: internship } = await supabaseAdmin
      .from("Internship")
      .select("*")
      .eq("id", course.internshipId)
      .single();

    const { data: modules } = await supabaseAdmin
      .from("Module")
      .select("*")
      .eq("courseId", id)
      .order("order");

    const modulesWithLessons = await Promise.all(
      (modules || []).map(async (module) => {
        const { data: lessons } = await supabaseAdmin
          .from("Lesson")
          .select("*")
          .eq("moduleId", module.id)
          .order("order");

        return { ...module, lessons: lessons || [] };
      })
    );

    return NextResponse.json({
      ...course,
      internship,
      modules: modulesWithLessons,
    });
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const { data: course, error } = await supabaseAdmin
      .from("Course")
      .update({
        title: data.title,
        description: data.description,
        order: data.order,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(course);
  } catch (error) {
    console.error("Failed to update course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin.from("Course").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
