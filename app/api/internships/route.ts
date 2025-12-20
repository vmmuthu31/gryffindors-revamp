import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const internships = await prisma.internship.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(internships);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch internships" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const internship = await prisma.internship.create({
      data: {
        title: data.title,
        track: data.track,
        price: data.price,
        duration: data.duration,
        curriculum: data.curriculum || {},
      },
    });
    return NextResponse.json(internship);
  } catch {
    return NextResponse.json(
      { error: "Failed to create internship" },
      { status: 500 }
    );
  }
}
