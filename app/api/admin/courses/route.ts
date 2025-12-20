import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: courses, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .order("internship_id")
      .order("order");

    if (error) throw error;

    const coursesWithRelations = await Promise.all(
      (courses || []).map(async (course) => {
        const { data: internship } = await supabaseAdmin
          .from("internships")
          .select("id, title, track")
          .eq("id", course.internship_id)
          .single();

        const { data: modules } = await supabaseAdmin
          .from("modules")
          .select("id")
          .eq("course_id", course.id);

        const modulesWithLessons = await Promise.all(
          (modules || []).map(async (module) => {
            const { data: lessons } = await supabaseAdmin
              .from("lessons")
              .select("id")
              .eq("module_id", module.id);

            return { ...module, lessons: lessons || [] };
          })
        );

        return {
          ...course,
          internshipId: course.internship_id,
          internship,
          modules: modulesWithLessons,
        };
      })
    );

    return NextResponse.json(coursesWithRelations);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.internshipId || !data.title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { count } = await supabaseAdmin
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("internship_id", data.internshipId);

    const { data: course, error } = await supabaseAdmin
      .from("courses")
      .insert({
        internship_id: data.internshipId,
        title: data.title,
        description: data.description || "",
        order: data.order || (count || 0) + 1,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Failed to create course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
