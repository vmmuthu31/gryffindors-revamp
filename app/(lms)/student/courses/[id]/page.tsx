import { prisma } from "@/lib/db";
import { auth } from "@/auth";
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
import { notFound } from "next/navigation";

async function getCourse(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      internship: true,
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
  return course;
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  const totalLessons = course.modules.reduce(
    (acc: number, mod: any) => acc + mod.lessons.length,
    0
  );
  // Mock completed - would come from submissions
  const completedLessons = 2;
  const progress = Math.round((completedLessons / totalLessons) * 100);

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
      {/* Course Header */}
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
              <div className="text-2xl font-bold">{progress}%</div>
              <div className="text-sm opacity-80">Complete</div>
            </div>
          </div>

          <div className="mt-6">
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
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
            {course.modules.map((module: any, idx: number) => (
              <AccordionItem key={module.id} value={`module-${idx}`}>
                <AccordionTrigger className="hover:no-underline px-4 py-4 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-8 h-8 rounded-full bg-[#841a1c]/10 flex items-center justify-center text-sm font-bold text-[#841a1c]">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{module.title}</div>
                      <div className="text-sm text-gray-500 font-normal">
                        {module.lessons.length} lessons
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="space-y-1 ml-12">
                    {module.lessons.map((lesson: any) => {
                      // Mock completed status
                      const isCompleted = false;

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
                                isCompleted ? "text-gray-500" : "text-gray-700"
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
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
