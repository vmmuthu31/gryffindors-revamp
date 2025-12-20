import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { sendTaskReviewedEmail, sendCertificateEmail } from "@/lib/email";
import { nanoid } from "nanoid";

// GET single submission
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
        lesson: {
          select: {
            title: true,
            content: true,
            module: {
              select: {
                title: true,
                course: {
                  select: { id: true, title: true },
                },
              },
            },
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Failed to fetch submission:", error);
    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}

// PATCH - Update submission (mentor review)
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

    // Verify mentor is assigned to this student
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        lesson: {
          select: {
            id: true,
            title: true,
            module: {
              select: {
                course: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Update submission
    const updated = await prisma.submission.update({
      where: { id },
      data: {
        status,
        mentorFeedback,
        grade,
        reviewedAt: new Date(),
      },
    });

    // Mark lesson as complete if approved
    if (status === "APPROVED") {
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: submission.userId,
            lessonId: submission.lessonId,
          },
        },
        update: {
          completed: true,
          completedAt: new Date(),
        },
        create: {
          userId: submission.userId,
          lessonId: submission.lessonId,
          completed: true,
          completedAt: new Date(),
        },
      });

      // Check if all lessons in the course are completed
      await checkAndIssueCertificate(
        submission.userId,
        submission.lesson.module.course.id
      );
    }

    // Send email notification to student
    if (submission.user.email) {
      await sendTaskReviewedEmail(
        submission.user.email,
        submission.user.name || "Student",
        submission.lesson.title,
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

// Helper function to check if all lessons are completed and issue certificate
async function checkAndIssueCertificate(userId: string, courseId: string) {
  try {
    // Get the course with all its lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        internship: true,
        modules: {
          include: {
            lessons: {
              where: { type: "TASK" }, // Only task lessons require completion
              select: { id: true },
            },
          },
        },
      },
    });

    if (!course) return;

    // Get all task lesson IDs in this course
    const allTaskLessonIds = course.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );

    if (allTaskLessonIds.length === 0) return;

    // Check how many are completed by this user
    const completedCount = await prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: allTaskLessonIds },
        completed: true,
      },
    });

    // If all tasks are completed, issue certificate
    if (completedCount >= allTaskLessonIds.length) {
      // Find the user's application for this internship
      const application = await prisma.application.findFirst({
        where: {
          userId,
          internshipId: course.internshipId,
          status: { in: ["ENROLLED", "IN_PROGRESS"] },
        },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      });

      if (!application) return;

      // Check if certificate already exists
      const existingCert = await prisma.certificate.findFirst({
        where: { applicationId: application.id },
      });

      if (existingCert) return;

      // Create certificate
      const uniqueCode = `GRYF-${nanoid(8).toUpperCase()}`;
      await prisma.certificate.create({
        data: {
          applicationId: application.id,
          userId,
          uniqueCode,
          grade: "Pass",
        },
      });
      console.log(`Certificate created with code: ${uniqueCode}`);

      // Update application status to completed
      await prisma.application.update({
        where: { id: application.id },
        data: { status: "COMPLETED" },
      });

      // Send certificate email
      if (application.user.email) {
        await sendCertificateEmail(
          application.user.email,
          application.user.name || "Student",
          course.internship.title,
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
