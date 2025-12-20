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
      .eq("mentorId", session.user.id)
      .in("status", ["ENROLLED", "IN_PROGRESS", "COMPLETED"])
      .order("createdAt", { ascending: false });

    if (error) throw error;

    const studentsWithRelations = await Promise.all(
      (students || []).map(async (student) => {
        const { data: user } = await supabaseAdmin
          .from("User")
          .select("id, name, email")
          .eq("id", student.userId)
          .single();

        const { data: internship } = await supabaseAdmin
          .from("Internship")
          .select("id, title, track")
          .eq("id", student.internshipId)
          .single();

        const { data: certificate } = await supabaseAdmin
          .from("Certificate")
          .select("id, uniqueCode")
          .eq("applicationId", student.id)
          .single();

        return {
          ...student,
          createdAt: student.createdAt,
          user,
          internship,
          certificate: certificate
            ? { id: certificate.id, uniqueCode: certificate.uniqueCode }
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
