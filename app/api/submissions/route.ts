import { prisma } from "@/lib/db";
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

    const existingSubmission = await prisma.submission.findFirst({
      where: {
        lessonId,
        userId: session.user.id,
        status: { in: ["PENDING", "UNDER_REVIEW", "APPROVED"] },
      },
    });

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

    await prisma.submission.deleteMany({
      where: {
        lessonId,
        userId: session.user.id,
        status: { in: ["REJECTED", "RESUBMIT"] },
      },
    });

    const submission = await prisma.submission.create({
      data: {
        lessonId,
        userId: session.user.id,
        content,
        fileUrl,
        status: "PENDING",
      },
      include: {
        user: { select: { name: true } },
        lesson: {
          select: {
            title: true,
            module: {
              select: {
                course: {
                  select: {
                    internship: {
                      select: { id: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const internshipId = submission.lesson.module.course.internship?.id;
    if (internshipId) {
      const application = await prisma.application.findFirst({
        where: {
          userId: session.user.id,
          internshipId,
          mentorId: { not: null },
        },
        include: {
          mentor: { select: { name: true, email: true } },
        },
      });

      if (application?.mentor?.email) {
        await sendNewSubmissionEmail(
          application.mentor.email,
          application.mentor.name || "Mentor",
          submission.user.name || "Student",
          submission.lesson.title
        );
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

    const submissions = await prisma.submission.findMany({
      where: { userId: session.user.id },
      include: {
        lesson: {
          select: {
            title: true,
            module: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
