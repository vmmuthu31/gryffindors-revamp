import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const { data: certificates, error } = await supabaseAdmin
      .from("Certificate")
      .select("*")
      .order("issued_at", { ascending: false });

    if (error) throw error;

    const certsWithRelations = await Promise.all(
      (certificates || []).map(async (cert) => {
        const { data: application } = await supabaseAdmin
          .from("Application")
          .select("*")
          .eq("id", cert.application_id)
          .single();

        let user = null;
        let internship = null;

        if (application) {
          const { data: userData } = await supabaseAdmin
            .from("User")
            .select("id, name, email")
            .eq("id", application.user_id)
            .single();
          user = userData;

          const { data: internshipData } = await supabaseAdmin
            .from("Internship")
            .select("id, title, track")
            .eq("id", application.internship_id)
            .single();
          internship = internshipData;
        }

        return {
          ...cert,
          issuedAt: cert.issued_at,
          uniqueCode: cert.unique_code,
          applicationId: cert.application_id,
          application: application
            ? { ...application, user, internship }
            : null,
        };
      })
    );

    return NextResponse.json(certsWithRelations);
  } catch (error) {
    console.error("Failed to fetch certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.applicationId) {
      return NextResponse.json(
        { error: "Application ID required" },
        { status: 400 }
      );
    }

    const { data: application, error: appError } = await supabaseAdmin
      .from("Application")
      .select("user_id")
      .eq("id", data.applicationId)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const { data: exists } = await supabaseAdmin
      .from("Certificate")
      .select("id")
      .eq("application_id", data.applicationId)
      .single();

    if (exists) {
      return NextResponse.json(
        { error: "Certificate already exists" },
        { status: 400 }
      );
    }

    const uniqueCode = `GRYF-${nanoid(8).toUpperCase()}`;

    const { data: certificate, error } = await supabaseAdmin
      .from("Certificate")
      .insert({
        application_id: data.applicationId,
        user_id: application.user_id,
        unique_code: uniqueCode,
        grade: data.grade || "Pass",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Failed to create certificate:", error);
    return NextResponse.json(
      { error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}
