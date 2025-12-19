import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// GET single student detail with progress
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get application with verification that mentor is assigned
    const application = await prisma.application.findFirst({
      where: {
        id,
        mentorId: session.user.id,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        internship: {
          select: { id: true, title: true, track: true },
        },
        certificate: {
          select: { id: true, uniqueCode: true, grade: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Get course for this internship
    const course = await prisma.course.findFirst({
      where: { internshipId: application.internship.id },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: { id: true, title: true, type: true },
            },
          },
        },
      },
    });

    // Get lesson progress for this user
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: { userId: application.user.id },
      select: { lessonId: true, completed: true },
    });

    // Get submissions for this user
    const submissions = await prisma.submission.findMany({
      where: { userId: application.user.id },
      select: { lessonId: true, status: true },
      orderBy: { submittedAt: "desc" },
    });

    // Map progress
    const progressMap = new Map(
      lessonProgress.map((p) => [p.lessonId, p.completed])
    );
    const submissionMap = new Map(
      submissions.map((s) => [s.lessonId, s.status])
    );

    const progress = course
      ? course.modules.flatMap((module) =>
          module.lessons.map((lesson) => ({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            moduleTitle: module.title,
            type: lesson.type,
            completed: progressMap.get(lesson.id) || false,
            submissionStatus: submissionMap.get(lesson.id) || null,
          }))
        )
      : [];

    return NextResponse.json({
      student: application,
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
