"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { YouTubeTranscript } from "@/components/YouTubeTranscript";
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
  Link as LinkIcon,
  File,
} from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: YouTubePlayerConfig
      ) => YouTubePlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayer {
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
}

interface YouTubePlayerConfig {
  videoId: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: { target: YouTubePlayer }) => void;
    onStateChange?: (event: { data: number }) => void;
  };
}

interface SubmissionData {
  id: string;
  status: string;
  mentorFeedback: string | null;
  grade: number | null;
  submittedAt: string;
  content: string | null;
  fileUrl: string | null;
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

function extractVideoId(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/watch")) {
    const match = url.match(/v=([^&\s]+)/);
    return match?.[1] || null;
  }
  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1]?.split(/[?&]/)[0] || null;
  }
  if (
    url.includes("youtube.com/embed/") ||
    url.includes("youtube-nocookie.com/embed/")
  ) {
    return url.split("/embed/")[1]?.split(/[?&]/)[0] || null;
  }
  return null;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;

  const playerRef = useRef<YouTubePlayer | null>(null);
  const timeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);

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

  useEffect(() => {
    if (lesson?.type !== "VIDEO" || !lesson.videoUrl) return;

    const videoId = extractVideoId(lesson.videoUrl);
    if (!videoId) return;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      const playerElement = document.getElementById("youtube-player");
      if (!playerElement) return;

      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
          },
          onStateChange: (event) => {
            if (event.data === 1) {
              timeIntervalRef.current = setInterval(() => {
                if (playerRef.current) {
                  setCurrentTime(playerRef.current.getCurrentTime());
                }
              }, 500);
            } else {
              if (timeIntervalRef.current) {
                clearInterval(timeIntervalRef.current);
              }
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        setApiLoaded(true);
        initPlayer();
      };
    } else {
      setApiLoaded(true);
      initPlayer();
    }

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [lesson?.type, lesson?.videoUrl, apiLoaded]);

  const handleTimestampClick = (seconds: number) => {
    if (playerRef.current && playerReady) {
      playerRef.current.seekTo(seconds, true);
      setCurrentTime(seconds);
    }
  };

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
      const submissionContent = `## Submission Notes\n${
        submissionNotes || "No notes provided"
      }\n\n## Links\n- **GitHub**: ${
        githubUrl || "Not provided"
      }\n- **Live Demo**: ${liveUrl || "Not provided"}`;

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          content: submissionContent,
          fileUrl: githubUrl || liveUrl || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Task submitted successfully!");
        await fetchLesson();
        setSubmissionNotes("");
        setGithubUrl("");
        setLiveUrl("");
      } else {
        toast.error(data.error || "Failed to submit task");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const navigateTo = (id: string) =>
    router.push(`/student/courses/${courseId}/lesson/${id}`);
  const canSubmit = () =>
    !lesson?.submission ||
    ["REJECTED", "RESUBMIT"].includes(lesson.submission.status);

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
              <CheckCircle className="w-4 h-4" /> Completed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
              <Circle className="w-4 h-4" /> In Progress
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
            {(lesson.type === "TASK" || lesson.type === "QUIZ") && (
              <ClipboardCheck className="w-4 h-4" />
            )}
            {lesson.type}
          </span>
          {lesson.duration && <span>{lesson.duration} min</span>}
        </div>
      </div>

      {lesson.type === "VIDEO" && (
        <>
          <Card className="overflow-hidden">
            <div className="aspect-video bg-black">
              <div id="youtube-player" className="w-full h-full" />
            </div>
          </Card>

          {lesson.videoUrl && (
            <YouTubeTranscript
              videoUrl={lesson.videoUrl}
              currentTime={currentTime}
              onTimestampClick={handleTimestampClick}
            />
          )}

          {lesson.content && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lesson Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownViewer markdown={lesson.content} />
              </CardContent>
            </Card>
          )}
        </>
      )}

      {lesson.type === "READING" && lesson.content && (
        <Card>
          <CardContent className="p-8">
            <MarkdownViewer markdown={lesson.content} />
          </CardContent>
        </Card>
      )}

      {lesson.type === "QUIZ" && lesson.content && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-500" /> Quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownViewer markdown={lesson.content} />
          </CardContent>
        </Card>
      )}

      {lesson.type === "TASK" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-orange-500" /> Task
              Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              {lesson.content ? (
                <MarkdownViewer markdown={lesson.content} />
              ) : (
                <p className="text-gray-500 italic">No task description</p>
              )}
            </div>

            {lesson.submission && submissionStatus && (
              <div
                className={`p-4 rounded-lg border ${
                  lesson.submission.status === "APPROVED"
                    ? "bg-green-50 border-green-200"
                    : ["REJECTED", "RESUBMIT"].includes(
                        lesson.submission.status
                      )
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
                {["REJECTED", "RESUBMIT"].includes(
                  lesson.submission?.status || ""
                ) && (
                  <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-700">
                    <AlertCircle className="w-5 h-5" />
                    <span>
                      Please address the feedback and resubmit your task.
                    </span>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <File className="w-4 h-4" /> How to Submit
                  </h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Complete the task on your local machine</li>
                    <li>Push your code to GitHub</li>
                    <li>Deploy if required (Vercel, Netlify, etc.)</li>
                    <li>Submit your GitHub repo link and live URL below</li>
                  </ol>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    GitHub Repository URL *
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      placeholder="https://github.com/username/repo"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Live Demo URL (Optional)
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      placeholder="https://your-app.vercel.app"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    placeholder="Any notes for the reviewer..."
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!githubUrl.trim() || submitting}
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

      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          variant="outline"
          className="gap-2"
          disabled={!lesson.prevLesson}
          onClick={() => lesson.prevLesson && navigateTo(lesson.prevLesson.id)}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
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
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {lesson.completed ? "Completed" : "Mark as Complete"}
          </Button>
        )}

        <Button
          variant="outline"
          className="gap-2"
          disabled={!lesson.nextLesson}
          onClick={() => lesson.nextLesson && navigateTo(lesson.nextLesson.id)}
        >
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
