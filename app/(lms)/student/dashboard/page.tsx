import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Target, Flame, Users, Medal } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Course {
  id: string;
  title: string;
  modules: Array<{
    id: string;
    title: string;
    lessons: Array<{ id: string; title: string }>;
  }>;
}

interface Application {
  internship: {
    title: string;
    courses: Course[];
  };
}

async function getStudentData(userId: string) {
  interface UserRow {
    id: string;
    name: string | null;
    learningStreak: number;
    totalTimeSpent: number;
    referralCode: string | null;
  }
  interface AppRow {
    id: string;
    internshipId: string;
  }
  interface CourseRow {
    id: string;
    title: string;
  }
  interface ModRow {
    id: string;
    title: string;
  }
  interface LessonRow {
    id: string;
    title: string;
  }
  interface LeaderRow {
    id: string;
    name: string | null;
    learningStreak: number;
  }

  const { data: userData } = await supabaseAdmin
    .from("User")
    .select("id, name, learningStreak, totalTimeSpent, referralCode")
    .eq("id", userId)
    .single();

  let user = userData as UserRow | null;

  if (user && !user.referralCode) {
    const code = `${
      user.name?.split(" ")[0].toUpperCase() || "GRYF"
    }${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: updated } = await supabaseAdmin
      .from("User")
      .update({ referralCode: code })
      .eq("id", userId)
      .select("id, name, learningStreak, totalTimeSpent, referralCode")
      .single();

    user = updated as UserRow | null;
  }

  const { data: appData } = await supabaseAdmin
    .from("Application")
    .select("id, internshipId")
    .eq("userId", userId)
    .in("status", ["ENROLLED", "IN_PROGRESS", "COMPLETED"])
    .order("createdAt", { ascending: false })
    .limit(1)
    .single();

  const applicationData = appData as AppRow | null;

  let application: Application | null = null;
  if (applicationData) {
    const { data: intData } = await supabaseAdmin
      .from("Internship")
      .select("id, title")
      .eq("id", applicationData.internshipId)
      .single();

    const internship = intData as { id: string; title: string } | null;

    const { data: cData } = await supabaseAdmin
      .from("Course")
      .select("id, title")
      .eq("internshipId", applicationData.internshipId)
      .order("order");

    const courses = (cData || []) as CourseRow[];

    const coursesWithModules = await Promise.all(
      courses.map(async (course) => {
        const { data: mData } = await supabaseAdmin
          .from("Module")
          .select("id, title")
          .eq("courseId", course.id)
          .order("order");

        const modules = (mData || []) as ModRow[];

        const modulesWithLessons = await Promise.all(
          modules.map(async (mod) => {
            const { data: lData } = await supabaseAdmin
              .from("Lesson")
              .select("id, title")
              .eq("moduleId", mod.id)
              .order("order");

            const lessons = (lData || []) as LessonRow[];

            return { ...mod, lessons };
          })
        );

        return { ...course, modules: modulesWithLessons };
      })
    );

    application = {
      internship: {
        title: internship?.title || "",
        courses: coursesWithModules,
      },
    };
  }

  const { count: certificates } = await supabaseAdmin
    .from("Certificate")
    .select("*", { count: "exact", head: true })
    .eq("userId", userId);

  const { count: lessonProgress } = await supabaseAdmin
    .from("LessonProgress")
    .select("*", { count: "exact", head: true })
    .eq("userId", userId)
    .eq("completed", true);

  const { data: lbData } = await supabaseAdmin
    .from("User")
    .select("id, name, learningStreak")
    .eq("role", "STUDENT")
    .order("learningStreak", { ascending: false })
    .limit(5);

  const leaderboard = (lbData || []) as LeaderRow[];

  return {
    user: user
      ? {
          ...user,
          learningStreak: user.learningStreak,
          referralCode: user.referralCode,
        }
      : null,
    application,
    certificates: certificates || 0,
    lessonProgress: lessonProgress || 0,
    leaderboard: leaderboard.map((s) => ({
      ...s,
      learningStreak: s.learningStreak,
    })),
  };
}

async function updateStreak(userId: string) {
  interface StreakRow {
    lastActiveAt: string | null;
    learningStreak: number;
  }

  const { data } = await supabaseAdmin
    .from("User")
    .select("lastActiveAt, learningStreak")
    .eq("id", userId)
    .single();

  const user = data as StreakRow | null;

  if (!user) return;

  const now = new Date();
  const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;

  const isNewDay =
    !lastActive || now.toDateString() !== lastActive.toDateString();

  if (isNewDay) {
    const isConsecutive =
      lastActive && now.getTime() - lastActive.getTime() < 48 * 60 * 60 * 1000;

    await supabaseAdmin
      .from("User")
      .update({
        lastActiveAt: now.toISOString(),
        learningStreak: isConsecutive ? (user.learningStreak || 0) + 1 : 1,
      })
      .eq("id", userId);
  }
}

export default async function StudentDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div className="p-8">Please log in to access your dashboard.</div>;
  }

  await updateStreak(session.user.id);

  const { user, application, certificates, lessonProgress, leaderboard } =
    await getStudentData(session.user.id);

  const totalLessons =
    application?.internship.courses.reduce(
      (acc, course) =>
        acc +
        course.modules.reduce((mAcc, mod) => mAcc + mod.lessons.length, 0),
      0
    ) || 1;
  const progressPercent = Math.round((lessonProgress / totalLessons) * 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name?.split(" ")[0] || "Student"}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Track your learning progress</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full">
          <Flame className="w-5 h-5" />
          <span className="font-bold">
            {user?.learningStreak || 0} Day Streak
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#841a1c]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-3xl font-bold text-[#841a1c]">
                  {progressPercent}%
                </p>
              </div>
              <div className="p-3 bg-[#841a1c]/10 rounded-lg">
                <Target className="w-6 h-6 text-[#841a1c]" />
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#841a1c] rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#d79c64]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Lessons Done</p>
                <p className="text-3xl font-bold">
                  {lessonProgress}/{totalLessons}
                </p>
              </div>
              <div className="p-3 bg-[#d79c64]/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-[#d79c64]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Learning Streak</p>
                <p className="text-3xl font-bold text-orange-500">
                  {user?.learningStreak || 0} 🔥
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Certificates</p>
                <p className="text-3xl font-bold">{certificates}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-yellow-500" />
              Top Learners
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {leaderboard.map((student, index) => (
              <div
                key={student.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  session?.user && student.id === session.user.id
                    ? "bg-[#841a1c]/10"
                    : "bg-gray-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : index === 2
                      ? "bg-orange-400"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {student.name || "Anonymous"}
                    {session?.user && student.id === session.user.id && (
                      <span className="text-[#841a1c] ml-2 text-sm">(You)</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-orange-500 font-bold">
                  <Flame className="w-4 h-4" />
                  {student.learningStreak}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#841a1c] to-[#a52528] text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6" />
              <h3 className="text-xl font-bold">Refer & Earn</h3>
            </div>
            <p className="text-white/80 mb-4">
              Invite friends and both get ₹200 off! Share your code:
            </p>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <code className="text-2xl font-bold tracking-wider">
                {user?.referralCode || "GENERATING..."}
              </code>
            </div>
            <p className="text-white/60 text-sm mt-4 text-center">
              Friends use this code at checkout
            </p>
          </CardContent>
        </Card>
      </div>

      {application?.internship.courses.map((course) => (
        <Card key={course.id}>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between">
              <span>{course.title}</span>
              <span className="text-sm font-normal text-gray-500">
                {application.internship.title}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {course.modules.map((module) => (
                <div
                  key={module.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">
                      {module.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {module.lessons.length} lessons
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {module.lessons.slice(0, 3).map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/student/courses/${course.id}/lesson/${lesson.id}`}
                        className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-[#841a1c]/10 hover:text-[#841a1c] transition-colors"
                      >
                        {lesson.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href={`/student/courses/${course.id}`}
                className="inline-flex items-center text-[#841a1c] font-medium hover:underline"
              >
                Continue Learning →
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}

      {!application && (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Active Enrollment
            </h3>
            <p className="text-gray-500 mb-4">
              You haven&apos;t enrolled in any internship yet.
            </p>
            <Link
              href="/internships"
              className="inline-block px-6 py-3 bg-[#841a1c] text-white rounded-lg hover:bg-[#681416]"
            >
              Browse Internships
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
