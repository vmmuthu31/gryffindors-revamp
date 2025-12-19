// AI Service utility for making interview API calls

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function sendInterviewMessage(
  messages: Message[],
  track: string
): Promise<string> {
  const response = await fetch("/api/ai/interview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      track,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  // Handle streaming response
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let result = "";

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
  }

  return result;
}

// Non-streaming version for simpler use cases
export async function getAIResponse(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      systemPrompt,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  const data = await response.json();
  return data.response;
}
