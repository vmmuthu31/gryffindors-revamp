import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { nanoid } from "nanoid";
import { sendWelcomeEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (admin?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const internshipId = formData.get("internshipId") as string;
    const mentorId = formData.get("mentorId") as string | null;

    if (!file || !internshipId) {
      return NextResponse.json(
        { error: "File and internship required" },
        { status: 400 }
      );
    }

    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "CSV must have header and at least one row" },
        { status: 400 }
      );
    }

    const header = lines[0]
      .split(",")
      .map((h) => h.trim().toLowerCase().replace(/"/g, ""));
    const emailIndex = header.indexOf("email");
    const nameIndex = header.indexOf("name");

    if (emailIndex === -1) {
      return NextResponse.json(
        { error: "CSV must have 'email' column" },
        { status: 400 }
      );
    }

    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    const rows = lines.slice(1, 101);

    for (const line of rows) {
      const cells = line.split(",").map((c) => c.trim().replace(/"/g, ""));
      const email = cells[emailIndex]?.toLowerCase();
      const name = nameIndex !== -1 ? cells[nameIndex] : null;

      if (!email || !email.includes("@")) {
        errors.push(`Invalid email: ${email || "empty"}`);
        failed++;
        continue;
      }

      try {
        let user = await prisma.user.findUnique({
          where: { email },
        });

        const tempPassword = nanoid(8);

        if (!user) {
          const hashedPassword = await bcrypt.hash(tempPassword, 10);
          user = await prisma.user.create({
            data: {
              email,
              name,
              passwordHash: hashedPassword,
              role: "STUDENT",
              referralCode: `GRYF${nanoid(6).toUpperCase()}`,
            },
          });

          try {
            await sendWelcomeEmail(email, name || "Student", "STUDENT");
          } catch (emailError) {
            console.error(`Failed to send email to ${email}:`, emailError);
          }
        }

        const existingApp = await prisma.application.findFirst({
          where: {
            userId: user.id,
            internshipId,
            status: { in: ["ENROLLED", "IN_PROGRESS", "COMPLETED"] },
          },
        });

        if (existingApp) {
          errors.push(`${email}: Already enrolled`);
          failed++;
          continue;
        }

        await prisma.application.create({
          data: {
            userId: user.id,
            internshipId,
            mentorId: mentorId || null,
            status: "ENROLLED",
            paymentStatus: "SUCCESS",
            paymentId: `BULK_${nanoid(8)}`,
          },
        });

        success++;
      } catch (err) {
        console.error(`Error processing ${email}:`, err);
        errors.push(`${email}: Processing error`);
        failed++;
      }
    }

    return NextResponse.json({
      success,
      failed,
      errors: errors.slice(0, 10),
    });
  } catch (error) {
    console.error("Bulk enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to process bulk enrollment" },
      { status: 500 }
    );
  }
}
