import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Submission {
  id: string;
  status: string;
  submittedAt: string;
  user: { name: string | null; email: string };
  lesson: {
    title: string;
    module: {
      title: string;
      course: { title: string };
    };
  };
}

async function getSubmissions(
  mentorId: string,
  view: "pending" | "history" = "pending"
): Promise<Submission[]> {
  interface AppRow {
    userId: string;
  }
  interface SubRow {
    id: string;
    status: string;
    submittedAt: string;
    userId: string;
    lessonId: string;
  }
  interface LessonRow {
    title: string;
    moduleId: string;
  }
  interface ModRow {
    title: string;
    courseId: string;
  }

  const { data: assignedApps } = await supabaseAdmin
    .from("Application")
    .select("userId")
    .eq("mentorId", mentorId);

  const assignedApplications = (assignedApps || []) as AppRow[];
  const assignedUserIds = assignedApplications.map((a) => a.userId);

  if (assignedUserIds.length === 0) return [];

  const statusFilter =
    view === "pending"
      ? ["PENDING", "UNDER_REVIEW"]
      : ["APPROVED", "REJECTED", "RESUBMIT"];

  const { data: subs } = await supabaseAdmin
    .from("Submission")
    .select("id, status, submittedAt, userId, lessonId")
    .in("status", statusFilter)
    .in("userId", assignedUserIds)
    .order("submittedAt", { ascending: view === "pending" ? true : false });

  const submissions = (subs || []) as SubRow[];

  const result = await Promise.all(
    submissions.map(async (sub) => {
      const { data: user } = await supabaseAdmin
        .from("User")
        .select("name, email")
        .eq("id", sub.userId)
        .single();

      const { data: lessonData } = await supabaseAdmin
        .from("Lesson")
        .select("title, moduleId")
        .eq("id", sub.lessonId)
        .single();

      const lesson = lessonData as LessonRow | null;

      let moduleData = { title: "", course: { title: "" } };
      if (lesson) {
        const { data: modData } = await supabaseAdmin
          .from("Module")
          .select("title, courseId")
          .eq("id", lesson.moduleId)
          .single();

        const mod = modData as ModRow | null;

        if (mod) {
          const { data: course } = await supabaseAdmin
            .from("Course")
            .select("title")
            .eq("id", mod.courseId)
            .single();

          moduleData = {
            title: mod.title,
            course: {
              title: (course as { title: string } | null)?.title || "",
            },
          };
        }
      }

      return {
        id: sub.id,
        status: sub.status,
        submittedAt: sub.submittedAt,
        user: {
          name:
            (user as { name: string | null; email: string } | null)?.name ||
            null,
          email:
            (user as { name: string | null; email: string } | null)?.email ||
            "",
        },
        lesson: {
          title: lesson?.title || "",
          module: moduleData,
        },
      };
    })
  );

  return result;
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const session = await auth();
  const { view = "pending" } = await searchParams;
  const currentView = view === "history" ? "history" : "pending";

  if (!session?.user?.id) {
    return <div className="p-8">Please log in.</div>;
  }

  const submissions = await getSubmissions(session.user.id, currentView);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
          <p className="text-gray-500 mt-1">
            {currentView === "pending"
              ? `${submissions.length} submissions awaiting review`
              : `${submissions.length} submissions in history`}
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          <Link
            href="/mentor/submissions?view=pending"
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all",
              currentView === "pending"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Pending
          </Link>
          <Link
            href="/mentor/submissions?view=history"
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all",
              currentView === "history"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            History
          </Link>
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            {currentView === "pending" ? (
              <>
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  All Caught Up!
                </h3>
                <p className="text-gray-500">
                  No pending submissions from your assigned students.
                </p>
              </>
            ) : (
              <>
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No History Yet
                </h3>
                <p className="text-gray-500">
                  You haven't reviewed any submissions yet.
                </p>
              </>
            )}
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
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={cn(
                          sub.status === "PENDING" &&
                            "bg-orange-100 text-orange-700 hover:bg-orange-100",
                          sub.status === "UNDER_REVIEW" &&
                            "bg-blue-100 text-blue-700 hover:bg-blue-100",
                          sub.status === "APPROVED" &&
                            "bg-green-100 text-green-700 hover:bg-green-100",
                          sub.status === "REJECTED" &&
                            "bg-red-100 text-red-700 hover:bg-red-100",
                          sub.status === "RESUBMIT" &&
                            "bg-purple-100 text-purple-700 hover:bg-purple-100"
                        )}
                      >
                        {sub.status}
                      </Badge>
                      {sub.status === "APPROVED" && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {sub.status === "REJECTED" && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
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
