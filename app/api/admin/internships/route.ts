import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: internships, error } = await supabaseAdmin
      .from("Internship")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;

    const internshipsWithRelations = await Promise.all(
      (internships || []).map(async (internship) => {
        const { data: applications } = await supabaseAdmin
          .from("Application")
          .select("id, status")
          .eq("internshipId", internship.id);

        const { data: courses } = await supabaseAdmin
          .from("Course")
          .select("id, title")
          .eq("internshipId", internship.id);

        return {
          ...internship,
          createdAt: internship.createdAt,
          isActive: internship.isActive,
          applications: applications || [],
          courses: courses || [],
        };
      })
    );

    return NextResponse.json(internshipsWithRelations);
  } catch (error) {
    console.error("Failed to fetch internships:", error);
    return NextResponse.json(
      { error: "Failed to fetch internships" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.title || !data.track || !data.price || !data.duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: internship, error } = await supabaseAdmin
      .from("Internship")
      .insert({
        title: data.title,
        description: data.description || "",
        track: data.track,
        price: parseFloat(data.price),
        duration: data.duration,
        isActive: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(internship, { status: 201 });
  } catch (error) {
    console.error("Failed to create internship:", error);
    return NextResponse.json(
      { error: "Failed to create internship" },
      { status: 500 }
    );
  }
}
