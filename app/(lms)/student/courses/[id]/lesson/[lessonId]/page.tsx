"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { CodeEditor } from "@/components/CodeEditor";
import {
  PlayCircle,
  FileText,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Send,
  Loader2,
  Circle,
  AlertCircle,
  RotateCcw,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

interface SubmissionData {
  id: string;
  status: string;
  mentorFeedback: string | null;
  grade: number | null;
  submittedAt: string;
  content: string | null;
}

interface LessonData {
  id: string;
  title: string;
  type: string;
  videoUrl: string | null;
  content: string | null;
  duration: number | null;
  completed: boolean;
  prevLesson: { id: string; title: string } | null;
  nextLesson: { id: string; title: string } | null;
  totalLessons: number;
  currentLessonIndex: number;
  submission: SubmissionData | null;
  module: {
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
}

const statusConfig: Record<
  string,
  { color: string; icon: LucideIcon; label: string }
> = {
  PENDING: {
    color: "bg-yellow-100 text-yellow-700",
    icon: Circle,
    label: "Pending Review",
  },
  UNDER_REVIEW: {
    color: "bg-blue-100 text-blue-700",
    icon: Loader2,
    label: "Under Review",
  },
  APPROVED: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    label: "Approved",
  },
  REJECTED: {
    color: "bg-red-100 text-red-700",
    icon: XCircle,
    label: "Rejected",
  },
  RESUBMIT: {
    color: "bg-orange-100 text-orange-700",
    icon: RotateCcw,
    label: "Resubmit Required",
  },
};

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;

  // Already an embed URL
  if (
    url.includes("youtube.com/embed/") ||
    url.includes("youtube-nocookie.com/embed/")
  ) {
    return url.replace("youtube.com", "youtube-nocookie.com");
  }

  // Extract video ID from various YouTube URL formats
  let videoId: string | null = null;

  if (url.includes("youtube.com/watch")) {
    const match = url.match(/v=([^&\s]+)/);
    videoId = match?.[1] || null;
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split(/[?&]/)[0] || null;
  } else if (url.includes("youtube.com/v/")) {
    videoId = url.split("youtube.com/v/")[1]?.split(/[?&]/)[0] || null;
  }

  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  }

  return url;
}

function getLanguageFromContent(content: string): string {
  if (
    content.includes("python") ||
    content.includes("Python") ||
    content.includes("def ")
  ) {
    return "python";
  }
  if (
    content.includes("javascript") ||
    content.includes("JavaScript") ||
    content.includes("const ") ||
    content.includes("function")
  ) {
    return "javascript";
  }
  if (
    content.includes("typescript") ||
    content.includes("TypeScript") ||
    content.includes(": string") ||
    content.includes(": number")
  ) {
    return "typescript";
  }
  if (
    content.includes("solidity") ||
    content.includes("Solidity") ||
    content.includes("pragma solidity")
  ) {
    return "solidity";
  }
  if (
    content.includes("html") ||
    content.includes("HTML") ||
    content.includes("<!DOCTYPE")
  ) {
    return "html";
  }
  if (content.includes("css") || content.includes("CSS")) {
    return "css";
  }
  return "javascript";
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [submissionCode, setSubmissionCode] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchLesson = useCallback(async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      if (res.ok) {
        const data = await res.json();
        setLesson(data);
      }
    } catch (error) {
      console.error("Failed to fetch lesson:", error);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  const handleMarkComplete = async () => {
    setCompleting(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
      });
      if (res.ok) {
        setLesson((prev) => (prev ? { ...prev, completed: true } : null));
        toast.success("Lesson marked as complete!");

        if (lesson?.nextLesson) {
          setTimeout(() => {
            router.push(
              `/student/courses/${courseId}/lesson/${lesson.nextLesson!.id}`
            );
          }, 1000);
        }
      } else {
        toast.error("Failed to mark as complete");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCompleting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const submissionContent = submissionCode
        ? `## Code Submission\n\`\`\`\n${submissionCode}\n\`\`\`\n\n## Notes\n${submissionNotes}`
        : submissionNotes;

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          content: submissionContent,
          fileUrl: fileUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Task submitted successfully!");
        await fetchLesson();
        setSubmissionCode("");
        setSubmissionNotes("");
        setFileUrl("");
      } else {
        toast.error(data.error || "Failed to submit task");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const navigateTo = (lessonId: string) => {
    router.push(`/student/courses/${courseId}/lesson/${lessonId}`);
  };

  const canSubmit = () => {
    if (!lesson?.submission) return true;
    return (
      lesson.submission.status === "REJECTED" ||
      lesson.submission.status === "RESUBMIT"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#841a1c]" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-500">Lesson not found</p>
      </div>
    );
  }

  const submissionStatus = lesson.submission
    ? statusConfig[lesson.submission.status]
    : null;
  const embedUrl = lesson.videoUrl ? getYouTubeEmbedUrl(lesson.videoUrl) : null;
  const detectedLanguage = lesson.content
    ? getLanguageFromContent(lesson.content)
    : "javascript";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => router.push(`/student/courses/${courseId}`)}
            className="hover:text-[#841a1c]"
          >
            ← Back to Course
          </button>
          <span>/</span>
          <span>{lesson.module.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {lesson.completed ? (
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" />
              Completed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
              <Circle className="w-4 h-4" />
              In Progress
            </span>
          )}
          <span className="text-sm text-gray-400">
            {lesson.currentLessonIndex} of {lesson.totalLessons}
          </span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            {lesson.type === "VIDEO" && <PlayCircle className="w-4 h-4" />}
            {lesson.type === "READING" && <FileText className="w-4 h-4" />}
            {lesson.type === "TASK" && <ClipboardCheck className="w-4 h-4" />}
            {lesson.type === "QUIZ" && <ClipboardCheck className="w-4 h-4" />}
            {lesson.type}
          </span>
          {lesson.duration && <span>{lesson.duration} min</span>}
        </div>
      </div>

      {/* VIDEO LESSON */}
      {lesson.type === "VIDEO" && (
        <Card className="overflow-hidden">
          <div className="aspect-video bg-black">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            ) : lesson.videoUrl ? (
              <div className="flex flex-col items-center justify-center h-full text-white">
                <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
                <p className="mb-4">Unable to embed video directly</p>
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#841a1c] rounded-lg hover:bg-[#681416]"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch on YouTube
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>No video available</p>
              </div>
            )}
          </div>
          {lesson.content && (
            <CardContent className="p-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-4">Lesson Notes</h3>
              <MarkdownViewer markdown={lesson.content} />
            </CardContent>
          )}
        </Card>
      )}

      {/* READING LESSON */}
      {lesson.type === "READING" && lesson.content && (
        <Card>
          <CardContent className="p-8">
            <MarkdownViewer markdown={lesson.content} />
          </CardContent>
        </Card>
      )}

      {/* QUIZ LESSON */}
      {lesson.type === "QUIZ" && lesson.content && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-500" />
              Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownViewer markdown={lesson.content} />
          </CardContent>
        </Card>
      )}

      {/* TASK LESSON */}
      {lesson.type === "TASK" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-orange-500" />
              Task Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Task Description */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              {lesson.content ? (
                <MarkdownViewer markdown={lesson.content} />
              ) : (
                <p className="text-gray-500 italic">
                  No task description available
                </p>
              )}
            </div>

            {/* Previous Submission Status */}
            {lesson.submission && submissionStatus && (
              <div
                className={`p-4 rounded-lg border ${
                  lesson.submission.status === "APPROVED"
                    ? "bg-green-50 border-green-200"
                    : lesson.submission.status === "REJECTED" ||
                      lesson.submission.status === "RESUBMIT"
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={submissionStatus.color}>
                    <submissionStatus.icon
                      className={`w-3 h-3 mr-1 ${
                        lesson.submission.status === "UNDER_REVIEW"
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                    {submissionStatus.label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Submitted{" "}
                    {new Date(
                      lesson.submission.submittedAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                {lesson.submission.mentorFeedback && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Mentor Feedback:
                    </div>
                    <MarkdownViewer
                      markdown={lesson.submission.mentorFeedback}
                    />
                  </div>
                )}

                {lesson.submission.grade !== null && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Grade: </span>
                    <span className="font-bold text-[#841a1c]">
                      {lesson.submission.grade}/100
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Submission Form */}
            {lesson.submission?.status === "APPROVED" ? (
              <div className="text-center p-8 bg-green-50 rounded-lg">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-700">
                  Task Completed!
                </h3>
                <p className="text-green-600 mt-2">
                  Your submission has been approved.
                </p>
              </div>
            ) : canSubmit() ? (
              <div className="space-y-4">
                {(lesson.submission?.status === "REJECTED" ||
                  lesson.submission?.status === "RESUBMIT") && (
                  <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700">
                    <AlertCircle className="w-5 h-5" />
                    <span>
                      Please address the feedback and resubmit your task.
                    </span>
                  </div>
                )}

                {/* Code Editor */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Your Code
                  </label>
                  <CodeEditor
                    defaultValue={`// Write your ${detectedLanguage} code here\n`}
                    value={submissionCode}
                    onChange={(val) => setSubmissionCode(val || "")}
                    language={detectedLanguage}
                    height="300px"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Notes for Reviewer
                  </label>
                  <textarea
                    placeholder="Describe your approach, explain your code, or add any notes..."
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent resize-none"
                  />
                </div>

                {/* GitHub/Live Link */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    GitHub/Live Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={
                    (!submissionCode.trim() && !submissionNotes.trim()) ||
                    submitting
                  }
                  className="w-full bg-[#841a1c] hover:bg-[#681416]"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {lesson.submission ? "Resubmit Task" : "Submit Task"}
                </Button>
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
                <p className="text-gray-600">
                  Your submission is being reviewed...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          variant="outline"
          className="gap-2"
          disabled={!lesson.prevLesson}
          onClick={() => lesson.prevLesson && navigateTo(lesson.prevLesson.id)}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {lesson.type !== "TASK" && (
          <Button
            className={`gap-2 ${
              lesson.completed
                ? "bg-green-600 hover:bg-green-700"
                : "bg-[#841a1c] hover:bg-[#681416]"
            }`}
            disabled={lesson.completed || completing}
            onClick={handleMarkComplete}
          >
            {completing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : lesson.completed ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Completed
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Mark as Complete
              </>
            )}
          </Button>
        )}

        <Button
          variant="outline"
          className="gap-2"
          disabled={!lesson.nextLesson}
          onClick={() => lesson.nextLesson && navigateTo(lesson.nextLesson.id)}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
