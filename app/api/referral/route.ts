import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/auth";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let { data: user } = await supabaseAdmin
      .from("users")
      .select("referral_code")
      .eq("id", session.user.id)
      .single();

    if (!user?.referral_code) {
      const code = `GRYF${nanoid(6).toUpperCase()}`;
      const { data: updated } = await supabaseAdmin
        .from("users")
        .update({ referral_code: code })
        .eq("id", session.user.id)
        .select("referral_code")
        .single();
      user = updated;
    }

    const { data: referrals } = await supabaseAdmin
      .from("referrals")
      .select("*")
      .eq("referrer_id", session.user.id);

    const referralsWithUsers = await Promise.all(
      (referrals || []).map(async (r) => {
        let referredUser = null;
        if (r.referred_user_id) {
          const { data } = await supabaseAdmin
            .from("users")
            .select("name, email")
            .eq("id", r.referred_user_id)
            .single();
          referredUser = data;
        }
        return { ...r, referredUser };
      })
    );

    const totalEarnings = referralsWithUsers
      .filter((r) => r.status === "PAID")
      .reduce((acc, r) => acc + (r.earned_amount || 0), 0);

    const usedCount = referralsWithUsers.filter(
      (r) => r.status !== "PENDING"
    ).length;

    return NextResponse.json({
      code: user?.referral_code,
      totalReferrals: referralsWithUsers.length,
      usedReferrals: usedCount,
      totalEarnings,
      referrals: referralsWithUsers.map((r) => ({
        id: r.id,
        status: r.status,
        usedAt: r.used_at,
        referredUser: r.referredUser,
        earnedAmount: r.earned_amount,
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
    const { code, userId } = await request.json();

    if (!code || !userId) {
      return NextResponse.json(
        { error: "Code and userId required" },
        { status: 400 }
      );
    }

    const { data: referrer } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("referral_code", code)
      .single();

    if (!referrer) {
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
      .from("referrals")
      .select("id")
      .eq("referred_user_id", userId)
      .single();

    if (existingReferral) {
      return NextResponse.json(
        { error: "Already used a referral code" },
        { status: 400 }
      );
    }

    const { data: referral, error } = await supabaseAdmin
      .from("referrals")
      .insert({
        code: `${code}-${nanoid(4)}`,
        referrer_id: referrer.id,
        referred_user_id: userId,
        discount: 200,
        status: "USED",
        used_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    await supabaseAdmin
      .from("users")
      .update({ referred_by: referrer.id })
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
