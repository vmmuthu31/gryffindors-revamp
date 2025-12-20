import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const trackPrompts: Record<string, string> = {
  FULL_STACK: `You are an expert technical interviewer for a Full Stack Development internship. 
Ask questions about:
- JavaScript fundamentals (closures, promises, async/await)
- React concepts (hooks, state management, lifecycle)
- Node.js and Express
- Database design (SQL, MongoDB)
- REST APIs and authentication
- Git and deployment basics

Start with easier questions and progressively increase difficulty.`,

  AI_ML: `You are an expert technical interviewer for an AI/ML Engineering internship.
Ask questions about:
- Python programming fundamentals
- Machine learning concepts (supervised/unsupervised learning)
- Neural networks basics
- Data preprocessing and feature engineering
- Popular ML libraries (scikit-learn, TensorFlow, PyTorch)
- Model evaluation metrics

Start with theory and move to practical applications.`,

  WEB3: `You are an expert technical interviewer for a Web3/Blockchain Development internship.
Ask questions about:
- Blockchain fundamentals (consensus, blocks, transactions)
- Smart contracts and Solidity basics
- Ethereum ecosystem
- Web3.js/Ethers.js
- DeFi concepts
- NFTs and token standards

Focus on understanding of decentralized systems.`,
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    const { messages, track, internshipId, action } = await request.json();

    if (action === "complete" && session?.user?.id && internshipId) {
      return handleInterviewComplete(session.user.id, internshipId, messages);
    }

    const safeMessages = Array.isArray(messages) ? messages : [];
    const safeTrack = track || "FULL_STACK";
    const systemPrompt = trackPrompts[safeTrack] || trackPrompts.FULL_STACK;

    const formattedMessages = safeMessages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })
    );

    const result = streamText({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      model: groq("llama-3.3-70b-versatile") as any,
      system: `${systemPrompt}

Interview Guidelines:
- Ask one question at a time
- Be encouraging but professional
- After each answer, give brief feedback then ask the next question
- After 5-7 questions, conclude with an overall assessment
- Rate the candidate's performance out of 100
- End with: "INTERVIEW_COMPLETE: [SCORE]/100 - [PASS/FAIL]" where PASS is >= 60`,
      messages: formattedMessages,
    });

    return (await result).toTextStreamResponse();
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json(
      { error: "Failed to process interview" },
      { status: 500 }
    );
  }
}

async function handleInterviewComplete(
  userId: string,
  internshipId: string,
  messages: Array<{ role: string; content: string }>
) {
  try {
    const lastMessage = messages[messages.length - 1];
    let score = 0;
    let passed = false;

    if (lastMessage?.content) {
      const scoreMatch = lastMessage.content.match(
        /INTERVIEW_COMPLETE:\s*(\d+)\/100/i
      );
      if (scoreMatch) {
        score = parseInt(scoreMatch[1], 10);
        passed = score >= 60;
      }
    }

    // Save interview result
    await prisma.interviewResult.upsert({
      where: {
        userId_internshipId: { userId, internshipId },
      },
      update: {
        score,
        passed,
        transcript: messages,
        feedback: lastMessage?.content,
      },
      create: {
        userId,
        internshipId,
        score,
        passed,
        transcript: messages,
        feedback: lastMessage?.content,
      },
    });

    // Update application status if passed
    if (passed) {
      await prisma.application.updateMany({
        where: {
          userId,
          internshipId,
          status: "ELIGIBILITY_PASSED",
        },
        data: {
          status: "INTERVIEW_PASSED",
          interviewScore: score,
          interviewLog: messages,
        },
      });
    }

    return NextResponse.json({ score, passed });
  } catch (error) {
    console.error("Failed to save interview result:", error);
    return NextResponse.json(
      { error: "Failed to save result" },
      { status: 500 }
    );
  }
}

// GET - Check if user has completed interview
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const internshipId = searchParams.get("internshipId");

    if (!internshipId) {
      return NextResponse.json(
        { error: "Internship ID required" },
        { status: 400 }
      );
    }

    const result = await prisma.interviewResult.findUnique({
      where: {
        userId_internshipId: {
          userId: session.user.id,
          internshipId,
        },
      },
    });

    return NextResponse.json(result || { completed: false });
  } catch (error) {
    console.error("Failed to fetch interview result:", error);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}
