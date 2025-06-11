import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/User.model";
import { Message } from "@/models/Message.model";
import { NextRequest, NextResponse } from "next/server";
import { sendApiResponse } from "@/types/ApiResponse";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await dbConnect();
  try {
    const { username, content } = await request.json();
    const user: User = (await UserModel.findOne({ username })) as User;
    if (!user) {
      sendApiResponse({
        success: false,
        message: "Invalid username",
        status: 404,
      });
    }

    const isAcceptingMessages = user.isAcceptingMessages;
    if (!isAcceptingMessages) {
      return sendApiResponse({
        success: false,
        message: "User is not accepting messages",
        status: 403,
      });
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return sendApiResponse({
      success: true,
      message: "Message sent successfully",
      status: 200,
    });
  } catch (error) {
    console.error(
      "SEND_MESSAGE_ERROR:: Something went wrong while sending message: ",
      error
    );
    return sendApiResponse({
      success: false,
      message: "Something went wrong while sending message",
      status: 500,
    });
  }
}
