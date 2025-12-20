import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId, grade } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        mentorId: session.user.id,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Not authorized to issue certificate" },
        { status: 403 }
      );
    }

    const existing = await prisma.certificate.findFirst({
      where: { applicationId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Certificate already exists" },
        { status: 400 }
      );
    }

    const uniqueCode = `GRYF-${nanoid(8).toUpperCase()}`;
    const certificate = await prisma.certificate.create({
      data: {
        applicationId,
        userId: application.userId,
        uniqueCode,
        grade: grade || "Pass",
      },
    });

    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Failed to issue certificate:", error);
    return NextResponse.json(
      { error: "Failed to issue certificate" },
      { status: 500 }
    );
  }
}
