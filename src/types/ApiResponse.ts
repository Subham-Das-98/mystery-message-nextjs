import { Message } from "@/models/Message.model";
import { NextResponse } from "next/server";

interface ApiResponse {
  success: boolean;
  message: string;
  status: number;
  data?: object;
  isAcceptingMessages?: boolean;
  isVerified?: boolean;
  messages?: Array<Message>;
}

function sendApiResponse(data: ApiResponse): NextResponse<ApiResponse> {
  return NextResponse.json(data, {
    status: data.status ?? 200,
  });
}

export type { ApiResponse };
export { sendApiResponse };
