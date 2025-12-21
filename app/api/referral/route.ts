import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/auth";
import { nanoid } from "nanoid";
import { sanitizeInput } from "@/lib/security";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let { data: user } = await supabaseAdmin
      .from("User")
      .select("referralCode")
      .eq("id", session.user.id)
      .single();

    if (!user?.referralCode) {
      const code = `GRYF${nanoid(6).toUpperCase()}`;
      const { data: updated } = await supabaseAdmin
        .from("User")
        .update({ referralCode: code })
        .eq("id", session.user.id)
        .select("referralCode")
        .single();
      user = updated;
    }

    const { data: referrals } = await supabaseAdmin
      .from("Referral")
      .select("*")
      .eq("referrerId", session.user.id);

    const referralsWithUsers = await Promise.all(
      (referrals || []).map(async (r) => {
        let referredUser = null;
        if (r.referredUserId) {
          const { data } = await supabaseAdmin
            .from("User")
            .select("name, email")
            .eq("id", r.referredUserId)
            .single();
          referredUser = data;
        }
        return { ...r, referredUser };
      })
    );

    const totalEarnings = referralsWithUsers
      .filter((r) => r.status === "PAID")
      .reduce((acc, r) => acc + (r.earnedAmount || 0), 0);

    const usedCount = referralsWithUsers.filter(
      (r) => r.status !== "PENDING"
    ).length;

    return NextResponse.json({
      code: user?.referralCode,
      totalReferrals: referralsWithUsers.length,
      usedReferrals: usedCount,
      totalEarnings,
      referrals: referralsWithUsers.map((r) => ({
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

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code: rawCode, userId } = await request.json();
    const code = sanitizeInput(rawCode);

    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!code || !userId) {
      return NextResponse.json(
        { error: "Code and userId required" },
        { status: 400 }
      );
    }

    const { data: referrers, error: referrerError } = await supabaseAdmin
      .from("User")
      .select("id")
      .ilike("referralCode", code)
      .limit(1);

    if (referrerError) {
      console.error("Referral lookup error:", referrerError);
    }

    const referrer = referrers?.[0];

    if (!referrer) {
      console.error(`Referral code not found: "${code}"`);
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 400 }
      );
    }

    if (referrer.id === userId) {
      return NextResponse.json(
        { error: "Cannot use your own code" },
        { status: 400 }
      );
    }

    const { data: existingReferral } = await supabaseAdmin
      .from("Referral")
      .select("id")
      .eq("referredUserId", userId)
      .single();

    if (existingReferral) {
      return NextResponse.json(
        { error: "Already used a referral code" },
        { status: 400 }
      );
    }

    const { data: referral, error } = await supabaseAdmin
      .from("Referral")
      .insert({
        id: nanoid(),
        code: `${code}-${nanoid(4)}`,
        referrerId: referrer.id,
        referredUserId: userId,
        discount: 200,
        status: "USED",
        usedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    await supabaseAdmin
      .from("User")
      .update({ referredBy: referrer.id })
      .eq("id", userId);

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
