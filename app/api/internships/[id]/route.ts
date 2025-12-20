import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: internship, error } = await supabaseAdmin
      .from("Internship")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !internship) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    const { data: courses } = await supabaseAdmin
      .from("Course")
      .select("*")
      .eq("internship_id", id)
      .order("order");

    const coursesWithModules = await Promise.all(
      (courses || []).map(async (course) => {
        const { data: modules } = await supabaseAdmin
          .from("Module")
          .select("*")
          .eq("course_id", course.id)
          .order("order");

        const modulesWithLessons = await Promise.all(
          (modules || []).map(async (module) => {
            const { data: lessons } = await supabaseAdmin
              .from("Lesson")
              .select("*")
              .eq("module_id", module.id)
              .order("order");

            return { ...module, lessons: lessons || [] };
          })
        );

        return { ...course, modules: modulesWithLessons };
      })
    );

    return NextResponse.json({
      ...internship,
      courses: coursesWithModules,
    });
  } catch (error) {
    console.error("Failed to fetch internship:", error);
    return NextResponse.json(
      { error: "Failed to fetch internship" },
      { status: 500 }
    );
  }
}
