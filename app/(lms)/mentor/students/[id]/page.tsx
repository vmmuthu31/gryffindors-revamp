"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  ArrowLeft,
  Loader2,
  FileText,
  Circle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface StudentDetail {
  id: string;
  status: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
  internship: { id: string; title: string; track: string };
  certificate: { id: string; uniqueCode: string; grade: string | null } | null;
}

interface LessonProgress {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  type: string;
  completed: boolean;
  submissionStatus: string | null;
}

export default function MentorStudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetail();
  }, [params.id]);

  const fetchStudentDetail = async () => {
    try {
      const res = await fetch(`/api/mentor/students/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setStudent(data.student);
        setProgress(data.progress);
      } else {
        toast.error("Student not found");
        router.push("/mentor/students");
      }
    } catch (error) {
      console.error("Failed to fetch student:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#841a1c]" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-500">Student not found</p>
      </div>
    );
  }

  const completedCount = progress.filter((p) => p.completed).length;
  const totalCount = progress.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/mentor/students")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#841a1c] to-[#d79c64] text-white flex items-center justify-center font-bold text-2xl">
              {(student.user.name || student.user.email)[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {student.user.name || "Unnamed Student"}
              </h1>
              <p className="text-gray-500">{student.user.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <Badge className="bg-blue-100 text-blue-700">
                  {student.internship.title}
                </Badge>
                <Badge
                  className={
                    student.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {student.status.replace("_", " ")}
                </Badge>
                {student.certificate && (
                  <Badge className="bg-purple-100 text-purple-700">
                    <Award className="w-3 h-3 mr-1" />
                    Certified
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Enrolled</p>
              <p className="font-medium">
                {new Date(student.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-3xl font-bold text-[#841a1c]">
                  {progressPercent}%
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-[#841a1c] flex items-center justify-center">
                <span className="font-bold">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Lessons</p>
                <p className="text-3xl font-bold text-green-600">
                  {completedCount}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="text-3xl font-bold text-gray-600">
                  {totalCount - completedCount}
                </p>
              </div>
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificate */}
      {student.certificate && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Award className="w-10 h-10 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-900">
                    Certificate Issued
                  </h3>
                  <p className="text-sm text-purple-700">
                    Code:{" "}
                    <code className="font-mono">
                      {student.certificate.uniqueCode}
                    </code>
                    {student.certificate.grade && (
                      <span className="ml-3">
                        Grade: {student.certificate.grade}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Link
                href={`/verify-certificate/${student.certificate.uniqueCode}`}
                target="_blank"
                className="text-purple-700 hover:underline text-sm"
              >
                View Certificate →
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lesson Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Lesson Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">
                  Lesson
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Module
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Type
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {progress.map((lesson) => (
                <tr key={lesson.lessonId} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{lesson.lessonTitle}</td>
                  <td className="p-4 text-gray-500">{lesson.moduleTitle}</td>
                  <td className="p-4">
                    <Badge variant="outline">
                      {lesson.type === "TASK" && (
                        <FileText className="w-3 h-3 mr-1" />
                      )}
                      {lesson.type}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {lesson.completed ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    ) : lesson.submissionStatus ? (
                      <Badge
                        className={
                          lesson.submissionStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : lesson.submissionStatus === "UNDER_REVIEW"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {lesson.submissionStatus}
                      </Badge>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Circle className="w-4 h-4" />
                        Not Started
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {progress.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No lessons found for this course.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
