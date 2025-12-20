import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const { data: certificates, error } = await supabaseAdmin
      .from("Certificate")
      .select("*")
      .order("issuedAt", { ascending: false });

    if (error) throw error;

    const certsWithRelations = await Promise.all(
      (certificates || []).map(async (cert) => {
        const { data: application } = await supabaseAdmin
          .from("Application")
          .select("*")
          .eq("id", cert.applicationId)
          .single();

        let user = null;
        let internship = null;

        if (application) {
          const { data: userData } = await supabaseAdmin
            .from("User")
            .select("id, name, email")
            .eq("id", application.userId)
            .single();
          user = userData;

          const { data: internshipData } = await supabaseAdmin
            .from("Internship")
            .select("id, title, track")
            .eq("id", application.internshipId)
            .single();
          internship = internshipData;
        }

        return {
          ...cert,
          issuedAt: cert.issuedAt,
          uniqueCode: cert.uniqueCode,
          applicationId: cert.applicationId,
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
      .select("userId")
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
      .eq("applicationId", data.applicationId)
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
        applicationId: data.applicationId,
        userId: application.userId,
        uniqueCode: uniqueCode,
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
