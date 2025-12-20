import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { issuedAt: "desc" },
      include: {
        application: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            internship: {
              select: { id: true, title: true, track: true },
            },
          },
        },
      },
    });
    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.applicationId) {
      return NextResponse.json(
        { error: "Application ID required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
      select: { userId: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const exists = await prisma.certificate.findFirst({
      where: { applicationId: data.applicationId },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Certificate already exists" },
        { status: 400 }
      );
    }

    const uniqueCode = `GRYF-${nanoid(8).toUpperCase()}`;

    const certificate = await prisma.certificate.create({
      data: {
        applicationId: data.applicationId,
        userId: application.userId,
        uniqueCode,
        grade: data.grade || "Pass",
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Failed to create certificate:", error);
    return NextResponse.json(
      { error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}
