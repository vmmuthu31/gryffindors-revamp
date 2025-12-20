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
    user_id: string;
  }
  interface SubRow {
    id: string;
    status: string;
    submitted_at: string;
    user_id: string;
    lesson_id: string;
  }
  interface LessonRow {
    title: string;
    module_id: string;
  }
  interface ModRow {
    title: string;
    course_id: string;
  }

  const { data: assignedApps } = await supabaseAdmin
    .from("applications")
    .select("user_id")
    .eq("mentor_id", mentorId);

  const assignedApplications = (assignedApps || []) as AppRow[];
  const assignedUserIds = assignedApplications.map((a) => a.user_id);

  if (assignedUserIds.length === 0) return [];

  const { data: subs } = await supabaseAdmin
    .from("submissions")
    .select("id, status, submitted_at, user_id, lesson_id")
    .in("status", ["PENDING", "UNDER_REVIEW"])
    .in("user_id", assignedUserIds)
    .order("submitted_at", { ascending: true });

  const submissions = (subs || []) as SubRow[];

  const result = await Promise.all(
    submissions.map(async (sub) => {
      const { data: user } = await supabaseAdmin
        .from("users")
        .select("name, email")
        .eq("id", sub.user_id)
        .single();

      const { data: lessonData } = await supabaseAdmin
        .from("lessons")
        .select("title, module_id")
        .eq("id", sub.lesson_id)
        .single();

      const lesson = lessonData as LessonRow | null;

      let moduleData = { title: "", course: { title: "" } };
      if (lesson) {
        const { data: modData } = await supabaseAdmin
          .from("modules")
          .select("title, course_id")
          .eq("id", lesson.module_id)
          .single();

        const mod = modData as ModRow | null;

        if (mod) {
          const { data: course } = await supabaseAdmin
            .from("courses")
            .select("title")
            .eq("id", mod.course_id)
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
        submittedAt: sub.submitted_at,
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
