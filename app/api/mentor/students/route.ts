import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// GET mentor's assigned students
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get applications where this user is the mentor
    const students = await prisma.application.findMany({
      where: {
        mentorId: session.user.id,
        status: { in: ["ENROLLED", "IN_PROGRESS", "COMPLETED"] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        internship: {
          select: { id: true, title: true, track: true },
        },
        certificate: {
          select: { id: true, uniqueCode: true },
        },
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Failed to fetch mentor students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
