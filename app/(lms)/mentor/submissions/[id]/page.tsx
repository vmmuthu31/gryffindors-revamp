"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface SubmissionData {
  id: string;
  content: string | null;
  fileUrl: string | null;
  status: string;
  submittedAt: string;
  user: { name: string | null; email: string };
  lesson: {
    title: string;
    content: string | null;
    module: {
      title: string;
      course: { title: string };
    };
  };
}

export default function ReviewSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/submissions/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSubmission(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleAction = async (action: "APPROVED" | "REJECTED" | "RESUBMIT") => {
    setSubmitting(true);
    try {
      await fetch(`/api/submissions/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: action,
          mentorFeedback: feedback,
          grade: action === "APPROVED" ? grade : null,
        }),
      });
      router.push("/mentor/submissions");
    } catch (error) {
      console.error("Failed to update submission:", error);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#841a1c]"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-500">Submission not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Review Submission
          </h1>
          <p className="text-gray-500">{submission.lesson.title}</p>
        </div>
        <Badge
          className={
            submission.status === "PENDING"
              ? "bg-orange-100 text-orange-700"
              : "bg-blue-100 text-blue-700"
          }
        >
          {submission.status}
        </Badge>
      </div>

      {/* Student Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#841a1c] text-white flex items-center justify-center font-bold text-lg">
              {(submission.user.name || submission.user.email)[0].toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">
                {submission.user.name || "Unknown"}
              </div>
              <div className="text-sm text-gray-500">
                {submission.user.email}
              </div>
            </div>
            <div className="ml-auto text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Submitted {new Date(submission.submittedAt).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Task Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{submission.lesson.content}</p>
        </CardContent>
      </Card>

      {/* Submission Content */}
      <Card>
        <CardHeader>
          <CardTitle>Student Submission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="whitespace-pre-wrap text-gray-800">
              {submission.content || "No text provided"}
            </p>
          </div>

          {submission.fileUrl && (
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#841a1c] hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              View Attached Link
            </a>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Feedback
            </label>
            <Textarea
              placeholder="Provide constructive feedback to the student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Grade (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={grade || ""}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  setGrade(null);
                  return;
                }

                const num = Number(value);
                if (num >= 0 && num <= 100) {
                  setGrade(num);
                }
              }}
              className="w-32 px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => handleAction("APPROVED")}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </Button>
            <Button
              onClick={() => handleAction("RESUBMIT")}
              disabled={submitting}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Request Resubmit
            </Button>
            <Button
              onClick={() => handleAction("REJECTED")}
              disabled={submitting}
              variant="destructive"
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
