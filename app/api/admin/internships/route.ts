import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all internships
export async function GET() {
  try {
    const internships = await prisma.internship.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        applications: {
          select: { id: true, status: true },
        },
        courses: {
          select: { id: true, title: true },
        },
      },
    });
    return NextResponse.json(internships);
  } catch (error) {
    console.error("Failed to fetch internships:", error);
    return NextResponse.json(
      { error: "Failed to fetch internships" },
      { status: 500 }
    );
  }
}

// POST create new internship
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.title || !data.track || !data.price || !data.duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const internship = await prisma.internship.create({
      data: {
        title: data.title,
        description: data.description || "",
        track: data.track,
        price: parseFloat(data.price),
        duration: data.duration,
        isActive: true,
      },
    });

    return NextResponse.json(internship, { status: 201 });
  } catch (error) {
    console.error("Failed to create internship:", error);
    return NextResponse.json(
      { error: "Failed to create internship" },
      { status: 500 }
    );
  }
}
