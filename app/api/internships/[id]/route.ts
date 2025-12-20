import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const internship = await prisma.internship.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    if (!internship) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(internship);
  } catch (error) {
    console.error("Failed to fetch internship:", error);
    return NextResponse.json(
      { error: "Failed to fetch internship" },
      { status: 500 }
    );
  }
}
