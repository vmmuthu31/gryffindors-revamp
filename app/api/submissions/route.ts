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
      .from("submissions")
      .select("id, status")
      .eq("lesson_id", lessonId)
      .eq("user_id", session.user.id)
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
      .from("submissions")
      .delete()
      .eq("lesson_id", lessonId)
      .eq("user_id", session.user.id)
      .in("status", ["REJECTED", "RESUBMIT"]);

    const { data: submission, error } = await supabaseAdmin
      .from("submissions")
      .insert({
        lesson_id: lessonId,
        user_id: session.user.id,
        content,
        file_url: fileUrl,
        status: "PENDING",
      })
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("name")
      .eq("id", session.user.id)
      .single();

    const { data: lesson } = await supabaseAdmin
      .from("lessons")
      .select("title, module_id")
      .eq("id", lessonId)
      .single();

    if (lesson) {
      const { data: module } = await supabaseAdmin
        .from("modules")
        .select("course_id")
        .eq("id", lesson.module_id)
        .single();

      if (module) {
        const { data: course } = await supabaseAdmin
          .from("courses")
          .select("internship_id")
          .eq("id", module.course_id)
          .single();

        if (course?.internship_id) {
          const { data: application } = await supabaseAdmin
            .from("applications")
            .select("mentor_id")
            .eq("user_id", session.user.id)
            .eq("internship_id", course.internship_id)
            .not("mentor_id", "is", null)
            .single();

          if (application?.mentor_id) {
            const { data: mentor } = await supabaseAdmin
              .from("users")
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
      .from("submissions")
      .select("*")
      .eq("user_id", session.user.id)
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    const subsWithLessons = await Promise.all(
      (submissions || []).map(async (sub) => {
        const { data: lesson } = await supabaseAdmin
          .from("lessons")
          .select("title, module_id")
          .eq("id", sub.lesson_id)
          .single();

        let moduleTitle = "";
        if (lesson) {
          const { data: module } = await supabaseAdmin
            .from("modules")
            .select("title")
            .eq("id", lesson.module_id)
            .single();
          moduleTitle = module?.title || "";
        }

        return {
          ...sub,
          submittedAt: sub.submitted_at,
          lessonId: sub.lesson_id,
          userId: sub.user_id,
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
