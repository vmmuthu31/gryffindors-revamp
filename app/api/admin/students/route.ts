import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: students, error } = await supabaseAdmin
      .from("Application")
      .select("*")
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
          .select("id, title")
          .eq("id", student.internshipId)
          .single();

        let mentor = null;
        if (student.mentor_id) {
          const { data: mentorData } = await supabaseAdmin
            .from("User")
            .select("id, name")
            .eq("id", student.mentor_id)
            .single();
          mentor = mentorData;
        }

        return {
          ...student,
          createdAt: student.createdAt,
          user,
          internship,
          mentor,
        };
      })
    );

    return NextResponse.json(studentsWithRelations);
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
