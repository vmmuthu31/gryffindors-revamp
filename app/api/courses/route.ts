import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const { data: courses, error } = await supabaseAdmin
      .from("Course")
      .select("*")
      .order("order");

    if (error) throw error;

    const coursesWithRelations = await Promise.all(
      (courses || []).map(async (course) => {
        const { data: internship } = await supabaseAdmin
          .from("Internship")
          .select("*")
          .eq("id", course.internshipId)
          .single();

        const { data: modules } = await supabaseAdmin
          .from("Module")
          .select("*")
          .eq("courseId", course.id)
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

        return {
          ...course,
          internshipId: course.internshipId,
          internship,
          modules: modulesWithLessons,
        };
      })
    );

    return NextResponse.json(coursesWithRelations);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { data: course, error } = await supabaseAdmin
      .from("Course")
      .insert({
        id: nanoid(),
        internshipId: data.internshipId,
        title: data.title,
        description: data.description || "",
        order: data.order || 1,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(course);
  } catch {
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
