import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createOrder } from "@/lib/razorpay";
import { z } from "zod";
import { nanoid } from "nanoid";

const CreateOrderSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().optional().default("INR"),
  internshipId: z.string().optional(),
  internshipTitle: z.string().optional(),
  studentEmail: z.string().email().optional(),
  studentName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    let body;
    try {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parseResult = CreateOrderSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const {
      amount,
      currency,
      internshipId,
      internshipTitle,
      studentEmail,
      studentName,
    } = parseResult.data;

    const uniqueId = session?.user?.id || nanoid(8);
    const timestamp = Date.now().toString(36);

    const order = await createOrder({
      amount,
      currency,
      receipt: `ord_${uniqueId.slice(0, 8)}_${timestamp}`,
      notes: {
        userId: session?.user?.id || "guest",
        userEmail: studentEmail || session?.user?.email || "",
        userName: studentName || session?.user?.name || "",
        internshipId: internshipId || "",
        internshipTitle: internshipTitle || "",
      },
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Error creating order";

    if (errorMessage.includes("credentials")) {
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
