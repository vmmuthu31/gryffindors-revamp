import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { sendNewSubmissionEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId, content, fileUrl } = await request.json();

    const { data: existingSubmission } = await supabaseAdmin
      .from("Submission")
      .select("id, status")
      .eq("lessonId", lessonId)
      .eq("userId", session.user.id)
      .in("status", ["PENDING", "UNDER_REVIEW", "APPROVED"])
      .limit(1)
      .single();

    if (existingSubmission) {
      if (existingSubmission.status === "APPROVED") {
        return NextResponse.json(
          { error: "This task has already been approved" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "You already have a pending submission for this task" },
        { status: 400 }
      );
    }

    await supabaseAdmin
      .from("Submission")
      .delete()
      .eq("lessonId", lessonId)
      .eq("userId", session.user.id)
      .in("status", ["REJECTED", "RESUBMIT"]);

    const { data: submission, error } = await supabaseAdmin
      .from("Submission")
      .insert({
        lessonId: lessonId,
        userId: session.user.id,
        content,
        fileUrl: fileUrl,
        status: "PENDING",
      })
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabaseAdmin
      .from("User")
      .select("name")
      .eq("id", session.user.id)
      .single();

    const { data: lesson } = await supabaseAdmin
      .from("Lesson")
      .select("title, moduleId")
      .eq("id", lessonId)
      .single();

    if (lesson) {
      const { data: module } = await supabaseAdmin
        .from("Module")
        .select("courseId")
        .eq("id", lesson.moduleId)
        .single();

      if (module) {
        const { data: course } = await supabaseAdmin
          .from("Course")
          .select("internshipId")
          .eq("id", module.courseId)
          .single();

        if (course?.internshipId) {
          const { data: application } = await supabaseAdmin
            .from("Application")
            .select("mentor_id")
            .eq("userId", session.user.id)
            .eq("internshipId", course.internshipId)
            .not("mentor_id", "is", null)
            .single();

          if (application?.mentor_id) {
            const { data: mentor } = await supabaseAdmin
              .from("User")
              .select("name, email")
              .eq("id", application.mentor_id)
              .single();

            if (mentor?.email) {
              await sendNewSubmissionEmail(
                mentor.email,
                mentor.name || "Mentor",
                user?.name || "Student",
                lesson.title
              );
            }
          }
        }
      }
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: submissions, error } = await supabaseAdmin
      .from("Submission")
      .select("*")
      .eq("userId", session.user.id)
      .order("submittedAt", { ascending: false });

    if (error) throw error;

    const subsWithLessons = await Promise.all(
      (submissions || []).map(async (sub) => {
        const { data: lesson } = await supabaseAdmin
          .from("Lesson")
          .select("title, moduleId")
          .eq("id", sub.lessonId)
          .single();

        let moduleTitle = "";
        if (lesson) {
          const { data: module } = await supabaseAdmin
            .from("Module")
            .select("title")
            .eq("id", lesson.moduleId)
            .single();
          moduleTitle = module?.title || "";
        }

        return {
          ...sub,
          submittedAt: sub.submittedAt,
          lessonId: sub.lessonId,
          userId: sub.userId,
          lesson: {
            title: lesson?.title || "",
            module: { title: moduleTitle },
          },
        };
      })
    );

    return NextResponse.json(subsWithLessons);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
