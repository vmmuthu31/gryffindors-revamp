"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Track, Internship } from "@/lib/supabase/types";

const TRACK_METADATA = {
  FULL_STACK: {
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Tailwind CSS",
      "TypeScript",
    ],
    roles: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
    ],
    tags: ["Best Seller", "High Demand"],
  },
  AI_ML: {
    skills: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "OpenAI API",
      "LangChain",
      "RAG",
    ],
    roles: ["AI Engineer", "ML Practitioner", "Data Scientist", "ML Engineer"],
    tags: ["Trending", "Future Tech"],
  },
  WEB3: {
    skills: [
      "Solidity",
      "Hardhat",
      "Ethers.js",
      "IPFS",
      "Ethereum",
      "Smart Contracts",
    ],
    roles: [
      "Blockchain Developer",
      "Smart Contract Engineer",
      "Solidity Developer",
      "dApp Developer",
    ],
    tags: ["High Pay", "Niche"],
  },
};

export async function getInternship(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("Internship")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    const internship = data as Internship;
    const trackMeta =
      TRACK_METADATA[internship.track as Track] || TRACK_METADATA.FULL_STACK;

    return {
      ...internship,
      isActive: internship.is_active,
      createdAt: internship.created_at,
      skills: trackMeta.skills,
      roles: trackMeta.roles,
      tags: trackMeta.tags,
    };
  } catch (error) {
    console.error("Failed to fetch internship:", error);
    return null;
  }
}

export async function getInternships() {
  try {
    const { data, error } = await supabaseAdmin
      .from("Internship")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const internships = (data || []) as Internship[];
    return internships.map((internship) => {
      const trackMeta =
        TRACK_METADATA[internship.track as Track] || TRACK_METADATA.FULL_STACK;
      return {
        ...internship,
        isActive: internship.is_active,
        createdAt: internship.created_at,
        skills: trackMeta.skills,
        roles: trackMeta.roles,
        tags: trackMeta.tags,
      };
    });
  } catch (error) {
    console.error("Failed to fetch internships:", error);
    return [];
  }
}

export async function createInternship(data: {
  title: string;
  track: "FULL_STACK" | "AI_ML" | "WEB3";
  price: number;
  duration: string;
  description?: string;
  curriculum?: Record<string, unknown>;
}) {
  try {
    const { data: internship, error } = await supabaseAdmin
      .from("Internship")
      .insert({
        title: data.title,
        track: data.track,
        price: data.price,
        duration: data.duration,
        description: data.description || "",
        curriculum: data.curriculum || {},
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/internships");
    revalidatePath("/internships");
    return internship;
  } catch (error) {
    console.error("Failed to create internship:", error);
    return null;
  }
}

export async function updateInternship(
  id: string,
  data: {
    title?: string;
    track?: "FULL_STACK" | "AI_ML" | "WEB3";
    price?: number;
    duration?: string;
    description?: string;
    curriculum?: Record<string, unknown>;
  }
) {
  try {
    const { data: internship, error } = await supabaseAdmin
      .from("Internship")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/internships");
    revalidatePath("/internships");
    return internship;
  } catch (error) {
    console.error("Failed to update internship:", error);
    return null;
  }
}

export async function deleteInternship(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("Internship")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/internships");
    revalidatePath("/internships");
    return true;
  } catch (error) {
    console.error("Failed to delete internship:", error);
    return false;
  }
}

export async function createApplication(internshipId: string, userId: string) {
  try {
    const { data: application, error } = await supabaseAdmin
      .from("Application")
      .insert({
        internship_id: internshipId,
        user_id: userId,
        status: "PENDING",
      })
      .select()
      .single();

    if (error) throw error;
    return application;
  } catch (error) {
    console.error("Failed to create application:", error);
    return null;
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  data: {
    eligibilityScore?: number;
    interviewScore?: number;
    status?: "ELIGIBILITY_PASSED" | "INTERVIEW_PASSED" | "ENROLLED";
  }
) {
  try {
    const updateData: Record<string, unknown> = {};
    if (data.eligibilityScore !== undefined)
      updateData.eligibility_score = data.eligibilityScore;
    if (data.interviewScore !== undefined)
      updateData.interview_score = data.interviewScore;
    if (data.status !== undefined) updateData.status = data.status;

    const { error } = await supabaseAdmin
      .from("Application")
      .update(updateData)
      .eq("id", applicationId);

    if (error) throw error;

    revalidatePath("/student/dashboard");
    return true;
  } catch (error) {
    console.error("Failed to update application:", error);
    return false;
  }
}

export async function getUsers() {
  try {
    const { data, error } = await supabaseAdmin
      .from("User")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    interface UserRow {
      id: string;
      created_at: string;
      [key: string]: unknown;
    }
    interface AppRow {
      internship_id: string;
      [key: string]: unknown;
    }

    const users = (data || []) as UserRow[];
    const usersWithApps = await Promise.all(
      users.map(async (user) => {
        const { data: applications } = await supabaseAdmin
          .from("Application")
          .select("*")
          .eq("user_id", user.id);

        const apps = (applications || []) as AppRow[];
        const appsWithInternships = await Promise.all(
          apps.map(async (app) => {
            const { data: internship } = await supabaseAdmin
              .from("Internship")
              .select("*")
              .eq("id", app.internship_id)
              .single();

            return { ...app, internship };
          })
        );

        return {
          ...user,
          createdAt: user.created_at,
          applications: appsWithInternships,
        };
      })
    );

    return usersWithApps;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function updateUserRole(
  userId: string,
  role: "STUDENT" | "ADMIN"
) {
  try {
    const { error } = await supabaseAdmin
      .from("User")
      .update({ role })
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin/users");
    return true;
  } catch (error) {
    console.error("Failed to update user role:", error);
    return false;
  }
}

export async function deleteUser(userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from("User")
      .delete()
      .eq("id", userId);

    if (error) throw error;

    revalidatePath("/admin/users");
    return true;
  } catch (error) {
    console.error("Failed to delete user:", error);
    return false;
  }
}
