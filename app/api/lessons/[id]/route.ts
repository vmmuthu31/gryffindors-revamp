import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const { data: lesson, error } = await supabaseAdmin
      .from("Lesson")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const { data: module } = await supabaseAdmin
      .from("Module")
      .select("*")
      .eq("id", lesson.moduleId)
      .single();

    const { data: course } = await supabaseAdmin
      .from("Course")
      .select("id, title")
      .eq("id", module?.courseId)
      .single();

    const { data: allLessons } = await supabaseAdmin
      .from("Lesson")
      .select("id, title, order")
      .eq("moduleId", lesson.moduleId)
      .order("order");

    let lessonProgress = null;
    if (session?.user?.id) {
      const { data: progress } = await supabaseAdmin
        .from("LessonProgress")
        .select("completed")
        .eq("userId", session.user.id)
        .eq("lessonId", id)
        .single();
      lessonProgress = progress;
    }

    let submission = null;
    if (session?.user?.id && lesson.type === "TASK") {
      const { data: sub } = await supabaseAdmin
        .from("Submission")
        .select("id, status, mentorFeedback, grade, submittedAt")
        .eq("lessonId", id)
        .eq("userId", session.user.id)
        .order("submittedAt", { ascending: false })
        .limit(1)
        .single();

      if (sub) {
        submission = {
          id: sub.id,
          status: sub.status,
          mentorFeedback: sub.mentorFeedback,
          grade: sub.grade,
          submittedAt: sub.submittedAt,
        };
      }
    }

    const lessonsList = allLessons || [];
    const currentIndex = lessonsList.findIndex((l) => l.id === id);
    const prevLesson = currentIndex > 0 ? lessonsList[currentIndex - 1] : null;
    const nextLesson =
      currentIndex < lessonsList.length - 1
        ? lessonsList[currentIndex + 1]
        : null;

    return NextResponse.json({
      ...lesson,
      videoUrl: lesson.videoUrl,
      module: {
        ...module,
        course,
        lessons: lessonsList,
      },
      completed: lessonProgress?.completed || false,
      submission,
      prevLesson,
      nextLesson,
      totalLessons: lessonsList.length,
      currentLessonIndex: currentIndex + 1,
    });
  } catch (error) {
    console.error("Failed to fetch lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
