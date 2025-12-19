import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// POST - Mark lesson as complete
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: lessonId } = await params;

    // Upsert the progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Failed to mark lesson complete:", error);
    return NextResponse.json(
      { error: "Failed to mark complete" },
      { status: 500 }
    );
  }
}

// GET - Check if lesson is complete
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ completed: false });
    }

    const { id: lessonId } = await params;

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
    });

    return NextResponse.json({ completed: progress?.completed || false });
  } catch (error) {
    return NextResponse.json({ completed: false });
  }
}
