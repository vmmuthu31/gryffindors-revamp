"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MOCK_MCQ_QUESTIONS } from "@/lib/mock-data/eligibility";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface EligibilityTestProps {
  track: string;
  onComplete: (passed: boolean, score: number) => void;
}

const EligibilityTest: React.FC<EligibilityTestProps> = ({
  track,
  onComplete,
}) => {
  const questions: Question[] =
    (MOCK_MCQ_QUESTIONS as Record<string, Question[]>)[track] ||
    (MOCK_MCQ_QUESTIONS as Record<string, Question[]>)[
      "Full Stack Development"
    ];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    answers.forEach((ans, idx) => {
      if (ans === questions[idx].correct) correctCount++;
    });
    const finalScore = (correctCount / questions.length) * 100;
    setScore(finalScore);
    setSubmitted(true);
  };

  const isPassed = score >= 60; // 60% Passing criteria

  if (submitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-[#841a1c]/20 shadow-xl bg-white/90 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-100">
            {isPassed ? (
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            ) : (
              <AlertCircle className="w-10 h-10 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isPassed ? "Eligibility Confirmed!" : "Eligibility Check Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-[#841a1c]">
            {score.toFixed(0)}%
          </div>
          <p className="text-gray-600">
            {isPassed
              ? "Great job! You have demonstrated the baseline knowledge required for this internship."
              : "Unfortunately, you didn't meet the minimum score requirement (60%). We recommend brushing up on your basics."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          {isPassed ? (
            <Button
              onClick={() => onComplete(true, score)}
              className="bg-[#841a1c] hover:bg-[#681416] px-8"
            >
              Proceed to Payment
            </Button>
          ) : (
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retake Test
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <Card className="w-full max-w-2xl mx-auto border-[#841a1c]/20 shadow-xl bg-white/90 backdrop-blur min-h-[400px] flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Question {currentQIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-semibold text-[#841a1c]">{track}</span>
        </div>
        <Progress
          value={((currentQIndex + 1) / questions.length) * 100}
          className="h-2"
        />
      </CardHeader>

      <CardContent className="flex-grow pt-6">
        <h3 className="text-xl font-medium mb-6 text-gray-800 leading-relaxed">
          {currentQ.question}
        </h3>

        <RadioGroup
          onValueChange={(val: string) => handleSelect(parseInt(val))}
          value={answers[currentQIndex]?.toString()}
        >
          <div className="space-y-3">
            {currentQ.options.map((option: string, idx: number) => (
              <div
                key={idx}
                className={`flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 transition-colors ${
                  answers[currentQIndex] === idx
                    ? "border-[#841a1c] bg-[#841a1c]/5"
                    : "border-gray-200"
                }`}
              >
                <RadioGroupItem
                  value={idx.toString()}
                  id={`opt-${idx}`}
                  className="text-[#841a1c] border-gray-400"
                />
                <Label
                  htmlFor={`opt-${idx}`}
                  className="flex-grow cursor-pointer font-normal text-base text-gray-700"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>

      <CardFooter className="flex justify-between border-t bg-gray-50/50 p-6 rounded-b-xl">
        <Button
          variant="ghost"
          disabled={currentQIndex === 0}
          onClick={() => setCurrentQIndex(currentQIndex - 1)}
        >
          Previous
        </Button>
        <Button
          className="bg-[#841a1c] hover:bg-[#681416] min-w-[120px]"
          disabled={answers[currentQIndex] === -1}
          onClick={handleNext}
        >
          {currentQIndex === questions.length - 1
            ? "Submit Test"
            : "Next Question"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EligibilityTest;
