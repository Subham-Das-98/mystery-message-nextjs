import { sendApiResponse } from "@/types/ApiResponse";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const openrouter = createOpenRouter({
      apiKey: "YOUR_OPENROUTER_API_KEY",
    });

    const { textStream } = streamText({
      model: openrouter.chat("meta-llama/llama-3.1-405b-instruct"),
      prompt: "Write a short story about AI.",
      messages,
    });

    for await (const textPart of textStream) {
      process.stdout.write(textPart);
    }
  } catch (error) {
    console.error(
      "SUGGEST_MESSAGE_ERROR:: Something went wrong while generating suggest messages: ",
      error
    );
    return sendApiResponse({
      success: false,
      message: "Something went wrong while generating suggest messages",
      status: 500,
    });
  }
}
