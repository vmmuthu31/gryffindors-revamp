import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering to avoid database access during build
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getSubmissions(mentorId: string) {
  // Get applications assigned to this mentor
  const assignedApplications = await prisma.application.findMany({
    where: { mentorId },
    select: { userId: true },
  });

  const assignedUserIds = assignedApplications.map((a) => a.userId);

  // Get submissions from assigned students only
  const submissions = await prisma.submission.findMany({
    where: {
      status: { in: ["PENDING", "UNDER_REVIEW"] },
      userId: { in: assignedUserIds },
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
      lesson: {
        select: {
          title: true,
          module: {
            select: {
              title: true,
              course: {
                select: { title: true },
              },
            },
          },
        },
      },
    },
    orderBy: { submittedAt: "asc" },
  });

  return submissions;
}

export default async function SubmissionsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div className="p-8">Please log in.</div>;
  }

  const submissions = await getSubmissions(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
        <p className="text-gray-500 mt-1">
          {submissions.length} submissions awaiting review
        </p>
      </div>

      {submissions.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-500">
              No pending submissions from your assigned students.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <Link key={sub.id} href={`/mentor/submissions/${sub.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {sub.lesson.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {sub.lesson.module.course.title} →{" "}
                        {sub.lesson.module.title}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {sub.user.name || sub.user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={
                        sub.status === "PENDING"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    >
                      {sub.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
