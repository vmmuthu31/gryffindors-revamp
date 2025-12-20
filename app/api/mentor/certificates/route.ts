import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/auth";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId, grade } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID required" },
        { status: 400 }
      );
    }

    const { data: application, error: appError } = await supabaseAdmin
      .from("applications")
      .select("id, user_id")
      .eq("id", applicationId)
      .eq("mentor_id", session.user.id)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: "Not authorized to issue certificate" },
        { status: 403 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from("certificates")
      .select("id")
      .eq("application_id", applicationId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Certificate already exists" },
        { status: 400 }
      );
    }

    const uniqueCode = `GRYF-${nanoid(8).toUpperCase()}`;
    const { data: certificate, error } = await supabaseAdmin
      .from("certificates")
      .insert({
        application_id: applicationId,
        user_id: application.user_id,
        unique_code: uniqueCode,
        grade: grade || "Pass",
      })
      .select()
      .single();

    if (error) throw error;

    await supabaseAdmin
      .from("applications")
      .update({ status: "COMPLETED" })
      .eq("id", applicationId);

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Failed to issue certificate:", error);
    return NextResponse.json(
      { error: "Failed to issue certificate" },
      { status: 500 }
    );
  }
}
