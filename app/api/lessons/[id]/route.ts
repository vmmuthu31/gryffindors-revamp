import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          include: {
            course: {
              select: { id: true, title: true },
            },
            lessons: {
              orderBy: { order: "asc" },
              select: { id: true, title: true, order: true },
            },
          },
        },
        lessonProgress: session?.user?.id
          ? {
              where: { userId: session.user.id },
              select: { completed: true },
            }
          : false,
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    let submission = null;
    if (session?.user?.id && lesson.type === "TASK") {
      submission = await prisma.submission.findFirst({
        where: {
          lessonId: id,
          userId: session.user.id,
        },
        orderBy: { submittedAt: "desc" },
        select: {
          id: true,
          status: true,
          mentorFeedback: true,
          grade: true,
          submittedAt: true,
        },
      });
    }

    const allLessons = lesson.module.lessons;
    const currentIndex = allLessons.findIndex((l) => l.id === id);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : null;

    return NextResponse.json({
      ...lesson,
      completed: lesson.lessonProgress?.[0]?.completed || false,
      submission,
      prevLesson,
      nextLesson,
      totalLessons: allLessons.length,
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
