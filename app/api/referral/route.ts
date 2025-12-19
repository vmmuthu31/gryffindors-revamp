import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { nanoid } from "nanoid";

// GET - Get user's referral info
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create referral code
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true },
    });

    if (!user?.referralCode) {
      const code = `GRYF${nanoid(6).toUpperCase()}`;
      user = await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode: code },
        select: { referralCode: true },
      });
    }

    // Get referral stats
    const referrals = await prisma.referral.findMany({
      where: { referrerId: session.user.id },
      include: {
        referredUser: {
          select: { name: true, email: true },
        },
      },
    });

    const totalEarnings = referrals
      .filter((r) => r.status === "PAID")
      .reduce((acc, r) => acc + r.earnedAmount, 0);

    const usedCount = referrals.filter((r) => r.status !== "PENDING").length;

    return NextResponse.json({
      code: user.referralCode,
      totalReferrals: referrals.length,
      usedReferrals: usedCount,
      totalEarnings,
      referrals: referrals.map((r) => ({
        id: r.id,
        status: r.status,
        usedAt: r.usedAt,
        referredUser: r.referredUser,
        earnedAmount: r.earnedAmount,
      })),
    });
  } catch (error) {
    console.error("Failed to get referral info:", error);
    return NextResponse.json(
      { error: "Failed to get referral info" },
      { status: 500 }
    );
  }
}

// POST - Validate and apply referral code
export async function POST(request: Request) {
  try {
    const { code, userId } = await request.json();

    if (!code || !userId) {
      return NextResponse.json(
        { error: "Code and userId required" },
        { status: 400 }
      );
    }

    // Find referrer by code
    const referrer = await prisma.user.findFirst({
      where: { referralCode: code },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 400 }
      );
    }

    // Can't refer yourself
    if (referrer.id === userId) {
      return NextResponse.json(
        { error: "Cannot use your own code" },
        { status: 400 }
      );
    }

    // Check if user already used a referral
    const existingReferral = await prisma.referral.findFirst({
      where: { referredUserId: userId },
    });

    if (existingReferral) {
      return NextResponse.json(
        { error: "Already used a referral code" },
        { status: 400 }
      );
    }

    // Create referral record
    const referral = await prisma.referral.create({
      data: {
        code: `${code}-${nanoid(4)}`,
        referrerId: referrer.id,
        referredUserId: userId,
        discount: 200,
        status: "USED",
        usedAt: new Date(),
      },
    });

    // Update referred user
    await prisma.user.update({
      where: { id: userId },
      data: { referredBy: referrer.id },
    });

    return NextResponse.json({
      success: true,
      discount: 200,
      referralId: referral.id,
    });
  } catch (error) {
    console.error("Failed to apply referral:", error);
    return NextResponse.json(
      { error: "Failed to apply referral" },
      { status: 500 }
    );
  }
}
