import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: internship, error } = await supabaseAdmin
      .from("Internship")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !internship) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    const { data: courses } = await supabaseAdmin
      .from("Course")
      .select("*")
      .eq("internship_id", id);

    const { data: applications } = await supabaseAdmin
      .from("Application")
      .select("*")
      .eq("internship_id", id);

    return NextResponse.json({
      ...internship,
      courses: courses || [],
      applications: applications || [],
    });
  } catch (error) {
    console.error("Failed to fetch internship:", error);
    return NextResponse.json(
      { error: "Failed to fetch internship" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const { data: internship, error } = await supabaseAdmin
      .from("Internship")
      .update({
        title: data.title,
        description: data.description,
        track: data.track,
        price: parseFloat(data.price),
        duration: data.duration,
        is_active: data.isActive,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(internship);
  } catch (error) {
    console.error("Failed to update internship:", error);
    return NextResponse.json(
      { error: "Failed to update internship" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("Internship")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete internship:", error);
    return NextResponse.json(
      { error: "Failed to delete internship" },
      { status: 500 }
    );
  }
}
