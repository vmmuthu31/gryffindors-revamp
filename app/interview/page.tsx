"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  Bot,
  User,
  Trophy,
} from "lucide-react";
import { useChat } from "ai/react";
import Image from "next/image";

const trackInfo: Record<string, { name: string; color: string }> = {
  FULL_STACK: { name: "Full Stack Development", color: "bg-blue-500" },
  AI_ML: { name: "AI/ML Engineering", color: "bg-purple-500" },
  WEB3: { name: "Web3/Blockchain", color: "bg-orange-500" },
};

import { Suspense } from "react";

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const internshipId = searchParams.get("internshipId");
  const track = searchParams.get("track") || "FULL_STACK";

  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);
  const [existingResult, setExistingResult] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/ai/interview",
      body: { track, internshipId },
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content: `Welcome to the ${
            trackInfo[track]?.name || "Technical"
          } Interview! 🎯\n\nI'll be asking you a series of technical questions to assess your knowledge. Answer to the best of your ability.\n\nLet's begin! Are you ready?`,
        },
      ],
      onFinish: (message) => {
        // Check if interview is complete
        if (message.content.includes("INTERVIEW_COMPLETE")) {
          handleInterviewComplete(message.content);
        }
      },
    });

  useEffect(() => {
    // Check for existing interview result
    if (internshipId) {
      fetch(`/api/ai/interview?internshipId=${internshipId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.score !== undefined) {
            setExistingResult(data);
          }
        });
    }
  }, [internshipId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInterviewComplete = async (content: string) => {
    const scoreMatch = content.match(
      /INTERVIEW_COMPLETE:\s*(\d+)\/100\s*-\s*(PASS|FAIL)/i
    );
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1], 10);
      const passed = scoreMatch[2].toUpperCase() === "PASS";

      // Save result to database
      await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          internshipId,
          messages,
        }),
      });

      setResult({ score, passed });
      setCompleted(true);
    }
  };

  const trackDetails = trackInfo[track] || trackInfo.FULL_STACK;

  // Show existing result if already completed
  if (existingResult && existingResult.score !== undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card className="text-center">
            <CardContent className="p-12">
              {existingResult.passed ? (
                <>
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-12 h-12 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-green-600 mb-2">
                    Interview Passed! 🎉
                  </h1>
                  <p className="text-gray-600 mb-4">
                    You scored <strong>{existingResult.score}/100</strong>
                  </p>
                  <Button
                    onClick={() =>
                      router.push(
                        `/internships/${internshipId}/apply?step=payment`
                      )
                    }
                    className="bg-[#841a1c] hover:bg-[#681416]"
                  >
                    Proceed to Payment
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-red-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-red-600 mb-2">
                    Interview Not Passed
                  </h1>
                  <p className="text-gray-600 mb-4">
                    You scored <strong>{existingResult.score}/100</strong> (60+
                    required)
                  </p>
                  <p className="text-gray-500 mb-6">
                    Don't worry! You can retake the interview after reviewing
                    the concepts.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/internships")}
                  >
                    Browse Programs
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show result screen
  if (completed && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card className="text-center">
            <CardContent className="p-12">
              {result.passed ? (
                <>
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-12 h-12 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-green-600 mb-2">
                    Congratulations! 🎉
                  </h1>
                  <p className="text-xl text-gray-700 mb-2">
                    You passed the interview!
                  </p>
                  <p className="text-4xl font-bold text-[#841a1c] mb-6">
                    {result.score}/100
                  </p>
                  <Button
                    onClick={() =>
                      router.push(
                        `/internships/${internshipId}/apply?step=payment`
                      )
                    }
                    className="bg-[#841a1c] hover:bg-[#681416] px-8 py-6 text-lg"
                  >
                    Proceed to Payment →
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-red-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-red-600 mb-2">
                    Not Quite There
                  </h1>
                  <p className="text-xl text-gray-700 mb-2">
                    You need 60+ to pass
                  </p>
                  <p className="text-4xl font-bold text-gray-500 mb-6">
                    {result.score}/100
                  </p>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Don't be discouraged! Review the concepts and try again.
                    Learning is a journey, not a destination.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/internships")}
                  >
                    Browse Programs
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt="Gryffindors"
              width={32}
              height={32}
            />
            <span className="font-bold text-xl">Gryffindors</span>
          </div>
          <Badge className={`${trackDetails.color} text-white`}>
            {trackDetails.name} Interview
          </Badge>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#841a1c]" />
              AI Technical Interview
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-[#841a1c] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-[#841a1c] text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#841a1c] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-md">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type your answer..."
                className="flex-1 resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#841a1c] hover:bg-[#681416] px-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#841a1c]" />
        </div>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}
