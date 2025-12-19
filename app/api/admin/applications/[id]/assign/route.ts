import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST - assign mentor to application
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { mentorId } = await request.json();

    if (!mentorId) {
      return NextResponse.json(
        { error: "Mentor ID required" },
        { status: 400 }
      );
    }

    // Verify mentor exists and is a MENTOR
    const mentor = await prisma.user.findFirst({
      where: { id: mentorId, role: "MENTOR" },
    });

    if (!mentor) {
      return NextResponse.json({ error: "Invalid mentor" }, { status: 400 });
    }

    // Update application
    const updated = await prisma.application.update({
      where: { id },
      data: { mentorId },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to assign mentor:", error);
    return NextResponse.json(
      { error: "Failed to assign mentor" },
      { status: 500 }
    );
  }
}
