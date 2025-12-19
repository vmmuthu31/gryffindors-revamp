import { PrismaClient, Track, LessonType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Generate proper password hash for demo accounts
  const demoPasswordHash = await bcrypt.hash("demo123", 10);

  // Clear existing data
  await prisma.submission.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.application.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: "admin@gryffindors.in",
      name: "Admin",
      role: "ADMIN",
      passwordHash: demoPasswordHash,
    },
  });
  console.log("✅ Created admin user");

  // Create Mentor User
  const mentor = await prisma.user.create({
    data: {
      email: "mentor@gryffindors.in",
      name: "Mentor",
      role: "MENTOR",
      passwordHash: demoPasswordHash,
    },
  });
  console.log("✅ Created mentor user");

  // Create Demo Student
  const student = await prisma.user.create({
    data: {
      email: "student@demo.com",
      name: "Demo Student",
      role: "STUDENT",
      passwordHash: demoPasswordHash,
    },
  });
  console.log("✅ Created student user");

  // Create Internships
  const fullStackInternship = await prisma.internship.create({
    data: {
      title: "Full Stack Development",
      description:
        "Master React, Next.js, Node.js, and PostgreSQL with real-world projects.",
      track: Track.FULL_STACK,
      price: 2499,
      duration: "8 weeks",
      isActive: true,
    },
  });

  const aiInternship = await prisma.internship.create({
    data: {
      title: "AI / ML Engineering",
      description:
        "Learn Python, LLMs, RAG systems, and deploy production AI applications.",
      track: Track.AI_ML,
      price: 2999,
      duration: "8 weeks",
      isActive: true,
    },
  });

  const web3Internship = await prisma.internship.create({
    data: {
      title: "Web3 / Blockchain",
      description:
        "Build smart contracts, dApps, and understand DeFi protocols.",
      track: Track.WEB3,
      price: 3499,
      duration: "8 weeks",
      isActive: true,
    },
  });
  console.log("✅ Created internships");

  // Create Course for Full Stack
  const fullStackCourse = await prisma.course.create({
    data: {
      internshipId: fullStackInternship.id,
      title: "Full Stack Mastery",
      description: "Complete course covering frontend to backend",
      order: 1,
    },
  });

  // Create Modules
  const module1 = await prisma.module.create({
    data: {
      courseId: fullStackCourse.id,
      title: "Week 1: React Fundamentals",
      description: "Learn React from scratch",
      order: 1,
    },
  });

  const module2 = await prisma.module.create({
    data: {
      courseId: fullStackCourse.id,
      title: "Week 2: Next.js & Routing",
      description: "Master Next.js App Router",
      order: 2,
    },
  });

  const module3 = await prisma.module.create({
    data: {
      courseId: fullStackCourse.id,
      title: "Week 3: Backend APIs",
      description: "Build REST APIs with Node.js",
      order: 3,
    },
  });
  console.log("✅ Created modules");

  // Create Lessons for Module 1
  await prisma.lesson.createMany({
    data: [
      {
        moduleId: module1.id,
        title: "Introduction to React",
        type: LessonType.VIDEO,
        videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
        duration: 45,
        order: 1,
      },
      {
        moduleId: module1.id,
        title: "Components & Props",
        type: LessonType.VIDEO,
        videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
        duration: 30,
        order: 2,
      },
      {
        moduleId: module1.id,
        title: "Task: Build a Counter App",
        type: LessonType.TASK,
        content:
          "Create a React counter application with increment, decrement, and reset functionality. Submit your GitHub repo link.",
        order: 3,
      },
    ],
  });

  // Create Lessons for Module 2
  await prisma.lesson.createMany({
    data: [
      {
        moduleId: module2.id,
        title: "Next.js Basics",
        type: LessonType.VIDEO,
        videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
        duration: 50,
        order: 1,
      },
      {
        moduleId: module2.id,
        title: "File-based Routing",
        type: LessonType.READING,
        content:
          "# File-based Routing in Next.js\n\nNext.js uses a file-system based router where folders define routes...",
        order: 2,
      },
      {
        moduleId: module2.id,
        title: "Task: Build a Multi-page App",
        type: LessonType.TASK,
        content:
          "Create a Next.js app with Home, About, and Contact pages. Use the App Router.",
        order: 3,
      },
    ],
  });

  // Create Lessons for Module 3
  await prisma.lesson.createMany({
    data: [
      {
        moduleId: module3.id,
        title: "REST API Design",
        type: LessonType.VIDEO,
        videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
        duration: 40,
        order: 1,
      },
      {
        moduleId: module3.id,
        title: "Capstone Project",
        type: LessonType.TASK,
        content:
          "Build a complete CRUD API for a todo application with user authentication.",
        order: 2,
      },
    ],
  });
  console.log("✅ Created lessons");

  // Create demo application (enrolled student)
  await prisma.application.create({
    data: {
      userId: student.id,
      internshipId: fullStackInternship.id,
      status: "ENROLLED",
      eligibilityScore: 80,
      interviewScore: 85,
      paymentStatus: "SUCCESS",
      paymentId: "pay_demo_123",
    },
  });
  console.log("✅ Created demo application");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
