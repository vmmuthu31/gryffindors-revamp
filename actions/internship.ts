"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

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
    const internship = await prisma.internship.findUnique({
      where: { id },
    });

    if (!internship) return null;

    const trackMeta =
      TRACK_METADATA[internship.track] || TRACK_METADATA.FULL_STACK;

    return {
      ...internship,
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
    const internships = await prisma.internship.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return internships.map((internship) => {
      const trackMeta =
        TRACK_METADATA[internship.track] || TRACK_METADATA.FULL_STACK;
      return {
        ...internship,
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
  curriculum?: Prisma.InputJsonValue;
}) {
  try {
    const internship = await prisma.internship.create({
      data: {
        title: data.title,
        track: data.track,
        price: data.price,
        duration: data.duration,
        description: data.description || "",
        curriculum: data.curriculum || {},
      },
    });
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
    curriculum?: Prisma.InputJsonValue;
  }
) {
  try {
    const internship = await prisma.internship.update({
      where: { id },
      data,
    });
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
    await prisma.internship.delete({
      where: { id },
    });
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
    const application = await prisma.application.create({
      data: {
        internshipId,
        userId,
        status: "PENDING",
      },
    });
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
    await prisma.application.update({
      where: { id: applicationId },
      data,
    });
    revalidatePath("/student/dashboard");
    return true;
  } catch (error) {
    console.error("Failed to update application:", error);
    return false;
  }
}

export async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        applications: {
          include: {
            internship: true,
          },
        },
      },
    });
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
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath("/admin/users");
    return true;
  } catch (error) {
    console.error("Failed to update user role:", error);
    return false;
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath("/admin/users");
    return true;
  } catch (error) {
    console.error("Failed to delete user:", error);
    return false;
  }
}
