import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [{ internshipId: "asc" }, { order: "asc" }],
      include: {
        internship: {
          select: { id: true, title: true, track: true },
        },
        modules: {
          include: {
            lessons: {
              select: { id: true },
            },
          },
        },
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.internshipId || !data.title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingCourses = await prisma.course.count({
      where: { internshipId: data.internshipId },
    });

    const course = await prisma.course.create({
      data: {
        internshipId: data.internshipId,
        title: data.title,
        description: data.description || "",
        order: data.order || existingCourses + 1,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Failed to create course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
