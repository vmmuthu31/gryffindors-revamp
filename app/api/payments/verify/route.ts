import { NextResponse } from "next/server";
import { verifyPaymentSignature, fetchOrder } from "@/lib/razorpay";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendPaymentSuccessEmail } from "@/lib/email";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { z } from "zod";

const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  internshipId: z.string().min(1),
  internshipTitle: z.string().min(1),
  discountApplied: z.number().optional().default(0),
  studentName: z.string().min(1),
  studentEmail: z.string().email(),
});

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parseResult = VerifyPaymentSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      internshipId,
      internshipTitle,
      discountApplied,
      studentName,
      studentEmail,
    } = parseResult.data;

    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      console.error("Payment signature verification failed");
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const order = await fetchOrder(razorpay_order_id);
    const amountPaid = (order as { amount_paid?: number }).amount_paid || 0;

    const tempPassword = nanoid(10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const { data: existingUser } = await supabaseAdmin
      .from("User")
      .select("id, role")
      .eq("email", studentEmail.toLowerCase())
      .single();

    let studentUserId: string;

    if (existingUser) {
      studentUserId = existingUser.id;

      await supabaseAdmin
        .from("User")
        .update({
          name: studentName,
          passwordHash: hashedPassword,
          ...(existingUser.role !== "ADMIN" && existingUser.role !== "MENTOR"
            ? { role: "STUDENT" }
            : {}),
        })
        .eq("id", existingUser.id);
    } else {
      studentUserId = nanoid();

      const { error: createUserError } = await supabaseAdmin
        .from("User")
        .insert({
          id: studentUserId,
          email: studentEmail.toLowerCase(),
          name: studentName,
          passwordHash: hashedPassword,
          role: "STUDENT",
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

      if (createUserError) {
        console.error("Error creating user:", createUserError);
        throw createUserError;
      }
    }

    const { data: existingApp } = await supabaseAdmin
      .from("Application")
      .select("id")
      .eq("userId", studentUserId)
      .eq("internshipId", internshipId)
      .eq("paymentStatus", "SUCCESS")
      .single();

    if (existingApp) {
      await sendPaymentSuccessEmail({
        email: studentEmail.toLowerCase(),
        name: studentName,
        programTitle: internshipTitle,
        amountPaid: amountPaid / 100,
        paymentId: razorpay_payment_id,
        tempPassword: tempPassword,
      });

      return NextResponse.json({
        success: true,
        message: "Already enrolled",
        applicationId: existingApp.id,
        emailSent: true,
      });
    }

    const { data: existingApplication } = await supabaseAdmin
      .from("Application")
      .select("id")
      .eq("userId", studentUserId)
      .eq("internshipId", internshipId)
      .single();

    let applicationId: string;

    if (existingApplication) {
      const { error: updateError } = await supabaseAdmin
        .from("Application")
        .update({
          status: "ENROLLED",
          paymentStatus: "SUCCESS",
          paymentId: razorpay_payment_id,
          discountApplied: discountApplied,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", existingApplication.id);

      if (updateError) throw updateError;
      applicationId = existingApplication.id;
    } else {
      const { data: newApp, error: insertError } = await supabaseAdmin
        .from("Application")
        .insert({
          id: nanoid(),
          userId: studentUserId,
          internshipId: internshipId,
          status: "ENROLLED",
          paymentStatus: "SUCCESS",
          paymentId: razorpay_payment_id,
          discountApplied: discountApplied,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      applicationId = newApp.id;
    }

    await sendPaymentSuccessEmail({
      email: studentEmail.toLowerCase(),
      name: studentName,
      programTitle: internshipTitle,
      amountPaid: amountPaid / 100,
      paymentId: razorpay_payment_id,
      tempPassword: tempPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and enrollment complete",
      applicationId: applicationId,
      emailSent: true,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
