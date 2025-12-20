import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/auth";
import { sendTaskReviewedEmail, sendCertificateEmail } from "@/lib/email";
import { nanoid } from "nanoid";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: submission, error } = await supabaseAdmin
      .from("Submission")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const { data: user } = await supabaseAdmin
      .from("User")
      .select("name, email")
      .eq("id", submission.user_id)
      .single();

    const { data: lesson } = await supabaseAdmin
      .from("Lesson")
      .select("title, content, module_id")
      .eq("id", submission.lesson_id)
      .single();

    let lessonModule = null;
    let course = null;
    if (lesson) {
      const { data: moduleData } = await supabaseAdmin
        .from("Module")
        .select("title, course_id")
        .eq("id", lesson.module_id)
        .single();
      lessonModule = moduleData;

      if (moduleData) {
        const { data: courseData } = await supabaseAdmin
          .from("Course")
          .select("id, title")
          .eq("id", moduleData.course_id)
          .single();
        course = courseData;
      }
    }

    return NextResponse.json({
      ...submission,
      submittedAt: submission.submitted_at,
      lessonId: submission.lesson_id,
      userId: submission.user_id,
      mentorFeedback: submission.mentor_feedback,
      user,
      lesson: lesson
        ? {
            title: lesson.title,
            content: lesson.content,
            module: lessonModule ? { title: lessonModule.title, course } : null,
          }
        : null,
    });
  } catch (error) {
    console.error("Failed to fetch submission:", error);
    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, mentorFeedback, grade } = await request.json();

    const { data: submission, error: subError } = await supabaseAdmin
      .from("Submission")
      .select("*")
      .eq("id", id)
      .single();

    if (subError || !submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const { data: user } = await supabaseAdmin
      .from("User")
      .select("id, name, email")
      .eq("id", submission.user_id)
      .single();

    const { data: lesson } = await supabaseAdmin
      .from("Lesson")
      .select("id, title, module_id")
      .eq("id", submission.lesson_id)
      .single();

    const { data: updated, error } = await supabaseAdmin
      .from("Submission")
      .update({
        status,
        mentor_feedback: mentorFeedback,
        grade,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (status === "APPROVED" && lesson) {
      const { data: existing } = await supabaseAdmin
        .from("LessonProgress")
        .select("id")
        .eq("user_id", submission.user_id)
        .eq("lesson_id", submission.lesson_id)
        .single();

      if (existing) {
        await supabaseAdmin
          .from("LessonProgress")
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await supabaseAdmin.from("LessonProgress").insert({
          user_id: submission.user_id,
          lesson_id: submission.lesson_id,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      }

      const { data: module } = await supabaseAdmin
        .from("Module")
        .select("course_id")
        .eq("id", lesson.module_id)
        .single();

      if (module) {
        await checkAndIssueCertificate(submission.user_id, module.course_id);
      }
    }

    if (user?.email && lesson) {
      await sendTaskReviewedEmail(
        user.email,
        user.name || "Student",
        lesson.title,
        status,
        mentorFeedback
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}

async function checkAndIssueCertificate(userId: string, courseId: string) {
  try {
    const { data: course } = await supabaseAdmin
      .from("Course")
      .select("id, internship_id")
      .eq("id", courseId)
      .single();

    if (!course) return;

    const { data: internship } = await supabaseAdmin
      .from("Internship")
      .select("id, title")
      .eq("id", course.internship_id)
      .single();

    const { data: modules } = await supabaseAdmin
      .from("Module")
      .select("id")
      .eq("course_id", courseId);

    const moduleIds = (modules || []).map((m) => m.id);

    const { data: taskLessons } = await supabaseAdmin
      .from("Lesson")
      .select("id")
      .in("module_id", moduleIds)
      .eq("type", "TASK");

    const allTaskLessonIds = (taskLessons || []).map((l) => l.id);

    if (allTaskLessonIds.length === 0) return;

    const { count } = await supabaseAdmin
      .from("LessonProgress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("lesson_id", allTaskLessonIds)
      .eq("completed", true);

    if ((count || 0) >= allTaskLessonIds.length) {
      const { data: application } = await supabaseAdmin
        .from("Application")
        .select("id, user_id")
        .eq("user_id", userId)
        .eq("internship_id", course.internship_id)
        .in("status", ["ENROLLED", "IN_PROGRESS"])
        .single();

      if (!application) return;

      const { data: existingCert } = await supabaseAdmin
        .from("Certificate")
        .select("id")
        .eq("application_id", application.id)
        .single();

      if (existingCert) return;

      const { data: user } = await supabaseAdmin
        .from("User")
        .select("name, email")
        .eq("id", userId)
        .single();

      const uniqueCode = `GRYF-${nanoid(8).toUpperCase()}`;
      await supabaseAdmin.from("Certificate").insert({
        application_id: application.id,
        user_id: userId,
        unique_code: uniqueCode,
        grade: "Pass",
      });

      await supabaseAdmin
        .from("Application")
        .update({ status: "COMPLETED" })
        .eq("id", application.id);

      if (user?.email && internship) {
        await sendCertificateEmail(
          user.email,
          user.name || "Student",
          internship.title,
          uniqueCode,
          "Pass"
        );
      }

      console.log(`Certificate issued: ${uniqueCode} for user ${userId}`);
    }
  } catch (error) {
    console.error("Failed to check/issue certificate:", error);
  }
}
