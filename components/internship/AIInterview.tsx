"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Code,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface AIInterviewProps {
  track: string;
  internshipId?: string;
  onComplete: (score: number) => void;
}

interface Question {
  type: "mcq" | "debug";
  question: string;
  code?: string;
  options?: string[];
  correct: number | string[]; // string[] for multiple acceptable answers
  points: number;
}

// Track-specific questions with multiple acceptable answers for debug
const trackQuestions: Record<string, Question[]> = {
  FULL_STACK: [
    {
      type: "mcq",
      question:
        "What does the 'this' keyword refer to in JavaScript arrow functions?",
      options: [
        "The global object",
        "The calling object",
        "Inherits from enclosing scope",
        "undefined always",
      ],
      correct: 2,
      points: 10,
    },
    {
      type: "mcq",
      question: "Which HTTP method is idempotent?",
      options: ["POST", "PUT", "PATCH", "All of the above"],
      correct: 1,
      points: 10,
    },
    {
      type: "mcq",
      question: "What is the purpose of React's useEffect cleanup function?",
      options: [
        "To optimize performance",
        "To prevent memory leaks",
        "To handle errors",
        "To cache data",
      ],
      correct: 1,
      points: 10,
    },
    {
      type: "debug",
      question: "Find and fix the bug in this async function:",
      code: `async function fetchData() {
  const response = fetch('/api/data');
  const data = response.json();
  return data;
}`,
      correct: ["await", "async", "promise", "missing await"],
      points: 20,
    },
    {
      type: "debug",
      question:
        "What's wrong with this React component that causes infinite re-renders?",
      code: `function Counter() {
  const [count, setCount] = useState(0);
  setCount(count + 1);
  return <div>{count}</div>;
}`,
      correct: [
        "useEffect",
        "effect",
        "render",
        "infinite",
        "loop",
        "side effect",
      ],
      points: 20,
    },
  ],
  AI_ML: [
    {
      type: "mcq",
      question: "What is overfitting in machine learning?",
      options: [
        "Model performs well on training data but poorly on test data",
        "Model performs poorly on both training and test data",
        "Model takes too long to train",
        "Model uses too much memory",
      ],
      correct: 0,
      points: 10,
    },
    {
      type: "mcq",
      question: "Which algorithm is best for binary classification?",
      options: ["Linear Regression", "Logistic Regression", "K-Means", "PCA"],
      correct: 1,
      points: 10,
    },
    {
      type: "mcq",
      question:
        "What does the activation function ReLU output for negative inputs?",
      options: ["The negative value", "Zero", "One", "Absolute value"],
      correct: 1,
      points: 10,
    },
    {
      type: "debug",
      question: "Fix the bug in this NumPy array operation:",
      code: `import numpy as np
arr = np.array([1, 2, 3])
result = arr + [4, 5]  # Error here
print(result)`,
      correct: [
        "shape",
        "broadcast",
        "dimension",
        "size",
        "mismatch",
        "length",
      ],
      points: 20,
    },
    {
      type: "debug",
      question: "What's wrong with this train-test split approach?",
      code: `from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_train, X_test = train_test_split(X_scaled)`,
      correct: ["leak", "leakage", "data leak", "fit", "test data", "overfit"],
      points: 20,
    },
  ],
  WEB3: [
    {
      type: "mcq",
      question: "What is the purpose of gas in Ethereum?",
      options: [
        "To store data on chain",
        "To measure computational effort",
        "To encrypt transactions",
        "To create new tokens",
      ],
      correct: 1,
      points: 10,
    },
    {
      type: "mcq",
      question: "Which Solidity modifier prevents reentrancy attacks?",
      options: ["onlyOwner", "nonReentrant", "payable", "view"],
      correct: 1,
      points: 10,
    },
    {
      type: "mcq",
      question: "What is the difference between msg.sender and tx.origin?",
      options: [
        "They are the same",
        "msg.sender is immediate caller, tx.origin is original sender",
        "tx.origin is immediate caller, msg.sender is contract address",
        "msg.sender includes gas estimation",
      ],
      correct: 1,
      points: 10,
    },
    {
      type: "debug",
      question: "Find the security vulnerability in this Solidity function:",
      code: `function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount;
}`,
      correct: [
        "reentrancy",
        "reentrant",
        "check effect",
        "CEI",
        "before transfer",
        "balance update",
      ],
      points: 20,
    },
    {
      type: "debug",
      question: "What's wrong with this ERC20 approve pattern?",
      code: `// User wants to change allowance from 100 to 50
token.approve(spender, 50);`,
      correct: [
        "race",
        "front run",
        "frontrun",
        "zero first",
        "approve 0",
        "atomic",
      ],
      points: 20,
    },
  ],
};

const AIInterview: React.FC<AIInterviewProps> = ({ track, onComplete }) => {
  const [step, setStep] = useState<"setup" | "test" | "result">("setup");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | string)[]>([]);
  const [debugAnswer, setDebugAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [violations, setViolations] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [cameraReady, setCameraReady] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const questions = trackQuestions[track] || trackQuestions.FULL_STACK;

  // Check camera permission on mount
  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  // Anti-cheat detection
  useEffect(() => {
    if (step !== "test") return;

    const handleVisibility = () => {
      if (document.hidden) {
        setViolations((v) => v + 1);
        toast.error("⚠️ Tab switch detected!");
      }
    };

    const handleBlur = () => {
      setViolations((v) => v + 1);
      toast.error("⚠️ Window focus lost!");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
    };
  }, [step]);

  // Timer
  useEffect(() => {
    if (step !== "test" || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          calculateScore();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleWebcamReady = () => {
    setCameraReady(true);
    toast.success("Camera ready!");
  };

  const startTest = () => {
    if (!cameraReady && hasPermission !== false) {
      toast.error("Wait for camera to load");
      return;
    }
    setStep("test");
    setAnswers(new Array(questions.length).fill(-1));
  };

  const skipCamera = () => {
    setCameraReady(true);
    toast.info("Camera skipped for testing");
  };

  const handleMCQSelect = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (questions[currentQ].type === "debug") {
      const newAnswers = [...answers];
      newAnswers[currentQ] = debugAnswer.toLowerCase().trim();
      setAnswers(newAnswers);
      setDebugAnswer("");
    }
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let total = 0;
    const max = questions.reduce((a, q) => a + q.points, 0);

    answers.forEach((ans, i) => {
      const q = questions[i];
      if (q.type === "mcq" && ans === q.correct) {
        total += q.points;
      } else if (
        q.type === "debug" &&
        typeof ans === "string" &&
        Array.isArray(q.correct)
      ) {
        // Check if any keyword matches
        const userAnswer = ans.toLowerCase();
        const matches = q.correct.some((keyword) =>
          userAnswer.includes(keyword.toLowerCase())
        );
        if (matches) {
          total += q.points;
        }
      }
    });

    total = Math.max(0, total - violations * 10);
    setScore(Math.round((total / max) * 100));
    setStep("result");
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const isAnswered = () =>
    questions[currentQ].type === "mcq"
      ? answers[currentQ] !== -1
      : debugAnswer.trim().length > 0;

  // SETUP SCREEN
  if (step === "setup") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-[#841a1c]" />
            Proctored Interview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-700 font-medium mb-2">
              <AlertTriangle className="w-5 h-5" />
              Guidelines
            </div>
            <ul className="text-sm text-yellow-600 space-y-1">
              <li>• Camera will be ON during test</li>
              <li>• Do NOT switch tabs</li>
              <li>• 5 minutes, 5 questions</li>
              <li>• Violations = -10 pts each</li>
            </ul>
          </div>

          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            {hasPermission === false ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <Camera className="w-12 h-12 opacity-50 mb-2" />
                <p className="text-sm text-center">
                  Camera blocked. Click 🔒 in address bar → Allow camera
                </p>
              </div>
            ) : (
              <Webcam
                ref={webcamRef}
                audio={true}
                videoConstraints={{ facingMode: "user" }}
                onUserMedia={handleWebcamReady}
                onUserMediaError={() => setHasPermission(false)}
                className="w-full h-full object-cover"
                mirrored
              />
            )}
          </div>

          <div className="flex justify-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                cameraReady ? "text-green-600" : "text-gray-400"
              }`}
            >
              <Camera className="w-5 h-5" />
              {cameraReady
                ? "Ready"
                : hasPermission === false
                ? "Blocked"
                : "Loading..."}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={startTest}
              disabled={!cameraReady && hasPermission !== false}
              className="w-full bg-[#841a1c] hover:bg-[#681416]"
            >
              Start Interview
            </Button>
            <button
              onClick={skipCamera}
              className="text-sm text-gray-500 hover:text-gray-700 underline w-full"
            >
              Skip camera (testing only)
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // TEST SCREEN
  if (step === "test") {
    const q = questions[currentQ];
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow">
          <div className="flex items-center gap-4">
            <div className="w-20 h-14 bg-gray-900 rounded-lg overflow-hidden">
              {hasPermission !== false && (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full object-cover"
                  mirrored
                />
              )}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Recording
              </div>
              {violations > 0 && (
                <div className="text-red-500">⚠️ {violations} violation(s)</div>
              )}
            </div>
          </div>
          <div
            className={`flex items-center gap-2 text-2xl font-mono ${
              timeLeft < 60 ? "text-red-500" : ""
            }`}
          >
            <Timer className="w-6 h-6" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Q{currentQ + 1}/{questions.length}
            </span>
            <Badge
              className={
                q.type === "debug"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }
            >
              {q.type === "debug" ? <Code className="w-3 h-3 mr-1" /> : null}
              {q.points} pts
            </Badge>
          </div>
          <Progress
            value={((currentQ + 1) / questions.length) * 100}
            className="h-2"
          />
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-xl font-medium">{q.question}</h3>
            {q.type === "mcq" && q.options && (
              <RadioGroup
                onValueChange={(v) => handleMCQSelect(parseInt(v))}
                value={answers[currentQ]?.toString()}
              >
                <div className="space-y-3">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer ${
                        answers[currentQ] === i
                          ? "border-[#841a1c] bg-[#841a1c]/5"
                          : "border-gray-200"
                      }`}
                    >
                      <RadioGroupItem value={i.toString()} id={`o${i}`} />
                      <Label
                        htmlFor={`o${i}`}
                        className="flex-grow cursor-pointer"
                      >
                        {opt}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
            {q.type === "debug" && q.code && (
              <div className="space-y-4">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{q.code}</code>
                </pre>
                <Textarea
                  placeholder="Describe the bug and how to fix it..."
                  value={debugAnswer}
                  onChange={(e) => setDebugAnswer(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-400">
                  Hint: Explain what's wrong and mention the fix
                </p>
              </div>
            )}
            <div className="flex justify-between pt-4">
              <Button
                variant="ghost"
                disabled={currentQ === 0}
                onClick={() => setCurrentQ(currentQ - 1)}
              >
                Prev
              </Button>
              <Button
                className="bg-[#841a1c] hover:bg-[#681416]"
                disabled={!isAnswered()}
                onClick={handleNext}
              >
                {currentQ === questions.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // RESULT SCREEN
  const passed = score >= 60;
  return (
    <Card className="max-w-md mx-auto text-center">
      <CardContent className="p-8 space-y-6">
        <div
          className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
            passed ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {passed ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {passed ? "Passed! 🎉" : "Not Passed"}
          </h2>
          <p
            className={`text-5xl font-bold ${
              passed ? "text-green-600" : "text-red-500"
            }`}
          >
            {score}%
          </p>
          <p className="text-gray-500 mt-2">Min: 60%</p>
        </div>
        {violations > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
            {violations} violation(s) = -{violations * 10} pts
          </div>
        )}
        {passed ? (
          <Button
            onClick={() => onComplete(score)}
            className="w-full bg-[#841a1c] hover:bg-[#681416]"
          >
            Proceed to Payment →
          </Button>
        ) : (
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInterview;
