import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  PlayCircle,
  FileText,
  CheckCircle,
  Circle,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface Lesson {
  id: string;
  title: string;
  type: string;
  duration: number | null;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  internship: { title: string };
  modules: Module[];
}

async function getCourse(courseId: string): Promise<Course | null> {
  interface CourseRow {
    id: string;
    title: string;
    description: string | null;
    internship_id: string;
  }
  interface ModRow {
    id: string;
    title: string;
    order: number;
  }
  interface LessonRow {
    id: string;
    title: string;
    type: string;
    duration: number | null;
    order: number;
  }

  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("id, title, description, internship_id")
    .eq("id", courseId)
    .single();

  if (error || !data) return null;

  const course = data as CourseRow;

  const { data: internship } = await supabaseAdmin
    .from("internships")
    .select("title")
    .eq("id", course.internship_id)
    .single();

  const { data: mods } = await supabaseAdmin
    .from("modules")
    .select("id, title, order")
    .eq("course_id", courseId)
    .order("order");

  const modules = (mods || []) as ModRow[];

  const modulesWithLessons = await Promise.all(
    modules.map(async (mod) => {
      const { data: lessonData } = await supabaseAdmin
        .from("lessons")
        .select("id, title, type, duration, order")
        .eq("module_id", mod.id)
        .order("order");

      const lessons = (lessonData || []) as LessonRow[];

      return { ...mod, lessons };
    })
  );

  return {
    id: course.id,
    title: course.title,
    description: course.description || "",
    internship: {
      title: (internship as { title: string } | null)?.title || "",
    },
    modules: modulesWithLessons,
  };
}

async function getUserLessonProgress(userId: string, lessonIds: string[]) {
  if (lessonIds.length === 0) return new Set<string>();

  interface ProgressRow {
    lesson_id: string;
  }

  const { data } = await supabaseAdmin
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds)
    .eq("completed", true);

  const progress = (data || []) as ProgressRow[];

  return new Set(progress.map((p) => p.lesson_id));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  const allLessonIds = course.modules.flatMap((mod) =>
    mod.lessons.map((lesson) => lesson.id)
  );

  const completedLessonIds = await getUserLessonProgress(
    session.user.id,
    allLessonIds
  );

  const totalLessons = course.modules.reduce(
    (acc: number, mod: Module) => acc + mod.lessons.length,
    0
  );
  const completedLessons = completedLessonIds.size;
  const progress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case "READING":
        return <FileText className="w-4 h-4 text-purple-500" />;
      case "TASK":
        return <ClipboardCheck className="w-4 h-4 text-orange-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-[#841a1c] to-[#a52528] text-white overflow-hidden">
        <CardContent className="p-8">
          <div className="text-sm opacity-80 mb-2">
            {course.internship.title}
          </div>
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="opacity-90 mb-6">{course.description}</p>

          <div className="flex items-center gap-6">
            <div>
              <div className="text-2xl font-bold">{course.modules.length}</div>
              <div className="text-sm opacity-80">Modules</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalLessons}</div>
              <div className="text-sm opacity-80">Lessons</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {completedLessons}/{totalLessons}
              </div>
              <div className="text-sm opacity-80">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{progress}%</div>
              <div className="text-sm opacity-80">Progress</div>
            </div>
          </div>

          <div className="mt-6">
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="module-0"
          >
            {course.modules.map((module: Module, idx: number) => {
              const moduleCompletedCount = module.lessons.filter((lesson) =>
                completedLessonIds.has(lesson.id)
              ).length;

              return (
                <AccordionItem key={module.id} value={`module-${idx}`}>
                  <AccordionTrigger className="hover:no-underline px-4 py-4 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-8 h-8 rounded-full bg-[#841a1c]/10 flex items-center justify-center text-sm font-bold text-[#841a1c]">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{module.title}</div>
                        <div className="text-sm text-gray-500 font-normal">
                          {moduleCompletedCount}/{module.lessons.length} lessons
                          completed
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="space-y-1 ml-12">
                      {module.lessons.map((lesson: Lesson) => {
                        const isCompleted = completedLessonIds.has(lesson.id);

                        return (
                          <Link
                            key={lesson.id}
                            href={`/student/courses/${course.id}/lesson/${lesson.id}`}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                getLessonIcon(lesson.type)
                              )}
                              <span
                                className={`${
                                  isCompleted
                                    ? "text-gray-500"
                                    : "text-gray-700"
                                } group-hover:text-[#841a1c]`}
                              >
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.duration && (
                                <span className="text-xs text-gray-400">
                                  {lesson.duration} min
                                </span>
                              )}
                              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-500 capitalize">
                                {lesson.type.toLowerCase()}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
