import { supabaseAdmin } from "@/lib/supabase/admin";
import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText } from "lucide-react";
import Link from "next/link";

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

async function getSubmissions(mentorId: string): Promise<Submission[]> {
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

  const { data: subs } = await supabaseAdmin
    .from("Submission")
    .select("id, status, submittedAt, userId, lessonId")
    .in("status", ["PENDING", "UNDER_REVIEW"])
    .in("userId", assignedUserIds)
    .order("submittedAt", { ascending: true });

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
