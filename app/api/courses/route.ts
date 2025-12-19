import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { order: "asc" },
      include: {
        internship: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const course = await prisma.course.create({
      data: {
        internshipId: data.internshipId,
        title: data.title,
        description: data.description || "",
        order: data.order || 1,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
