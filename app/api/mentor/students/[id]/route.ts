import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data: application, error } = await supabaseAdmin
      .from("Application")
      .select("*")
      .eq("id", id)
      .eq("mentor_id", session.user.id)
      .single();

    if (error || !application) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const { data: user } = await supabaseAdmin
      .from("User")
      .select("id, name, email")
      .eq("id", application.user_id)
      .single();

    const { data: internship } = await supabaseAdmin
      .from("Internship")
      .select("id, title, track")
      .eq("id", application.internship_id)
      .single();

    const { data: certificate } = await supabaseAdmin
      .from("Certificate")
      .select("id, unique_code, grade")
      .eq("application_id", application.id)
      .single();

    const { data: course } = await supabaseAdmin
      .from("Course")
      .select("id")
      .eq("internship_id", application.internship_id)
      .single();

    const progress: Array<{
      lessonId: string;
      lessonTitle: string;
      moduleTitle: string;
      type: string;
      completed: boolean;
      submissionStatus: string | null;
    }> = [];

    if (course) {
      const { data: modules } = await supabaseAdmin
        .from("Module")
        .select("id, title, order")
        .eq("course_id", course.id)
        .order("order");

      const { data: lessonProgress } = await supabaseAdmin
        .from("LessonProgress")
        .select("lesson_id, completed")
        .eq("user_id", application.user_id);

      const { data: submissions } = await supabaseAdmin
        .from("Submission")
        .select("lesson_id, status")
        .eq("user_id", application.user_id)
        .order("submitted_at", { ascending: false });

      const progressMap = new Map(
        (lessonProgress || []).map((p) => [p.lesson_id, p.completed])
      );
      const submissionMap = new Map(
        (submissions || []).map((s) => [s.lesson_id, s.status])
      );

      for (const mod of modules || []) {
        const { data: lessons } = await supabaseAdmin
          .from("Lesson")
          .select("id, title, type, order")
          .eq("module_id", mod.id)
          .order("order");

        for (const lesson of lessons || []) {
          progress.push({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            moduleTitle: mod.title,
            type: lesson.type,
            completed: progressMap.get(lesson.id) || false,
            submissionStatus: submissionMap.get(lesson.id) || null,
          });
        }
      }
    }

    return NextResponse.json({
      student: {
        ...application,
        user,
        internship,
        certificate: certificate
          ? {
              id: certificate.id,
              uniqueCode: certificate.unique_code,
              grade: certificate.grade,
            }
          : null,
      },
      progress,
    });
  } catch (error) {
    console.error("Failed to fetch student detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}
