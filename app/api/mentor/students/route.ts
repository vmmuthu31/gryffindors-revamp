import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: students, error } = await supabaseAdmin
      .from("Application")
      .select("*")
      .eq("mentor_id", session.user.id)
      .in("status", ["ENROLLED", "IN_PROGRESS", "COMPLETED"])
      .order("created_at", { ascending: false });

    if (error) throw error;

    const studentsWithRelations = await Promise.all(
      (students || []).map(async (student) => {
        const { data: user } = await supabaseAdmin
          .from("User")
          .select("id, name, email")
          .eq("id", student.user_id)
          .single();

        const { data: internship } = await supabaseAdmin
          .from("Internship")
          .select("id, title, track")
          .eq("id", student.internship_id)
          .single();

        const { data: certificate } = await supabaseAdmin
          .from("Certificate")
          .select("id, unique_code")
          .eq("application_id", student.id)
          .single();

        return {
          ...student,
          createdAt: student.created_at,
          user,
          internship,
          certificate: certificate
            ? { id: certificate.id, uniqueCode: certificate.unique_code }
            : null,
        };
      })
    );

    return NextResponse.json(studentsWithRelations);
  } catch (error) {
    console.error("Failed to fetch mentor students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
