import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play } from "lucide-react";
import Link from "next/link";

async function getEnrolledCourses(userId: string) {
  const applications = await prisma.application.findMany({
    where: {
      userId,
      status: { in: ["ENROLLED", "IN_PROGRESS", "COMPLETED"] },
    },
    include: {
      internship: {
        include: {
          courses: {
            include: {
              modules: {
                include: {
                  lessons: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return applications;
}

export default async function CoursesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div className="p-8">Please log in to view your courses.</div>;
  }

  const applications = await getEnrolledCourses(session.user.id);

  const courses = applications.flatMap((app) =>
    app.internship.courses.map((course) => ({
      ...course,
      internshipTitle: app.internship.title,
      track: app.internship.track,
    }))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-500 mt-1">Continue where you left off</p>
      </div>

      {courses.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Courses Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Enroll in an internship to access courses.
            </p>
            <Link
              href="/internships"
              className="inline-block px-6 py-3 bg-[#841a1c] text-white rounded-lg hover:bg-[#681416]"
            >
              Browse Internships
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const totalLessons = course.modules.reduce(
              (acc, mod) => acc + mod.lessons.length,
              0
            );
            // Mock progress for now - would come from submissions
            const progress = 35;

            return (
              <Card
                key={course.id}
                className="hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Course Thumbnail */}
                <div className="h-32 bg-gradient-to-br from-[#841a1c] to-[#d79c64] flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white/80" />
                </div>

                <CardHeader className="pb-2">
                  <div className="text-xs text-[#d79c64] font-medium mb-1">
                    {course.internshipTitle}
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>{course.modules.length} modules</span>
                    <span>{totalLessons} lessons</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-right text-gray-400 mt-1">
                    {progress}% complete
                  </div>
                </CardContent>

                <CardFooter className="border-t pt-4">
                  <Link
                    href={`/student/courses/${course.id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#841a1c] text-white rounded-lg hover:bg-[#681416] transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Continue
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
