import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { sendApiResponse } from "@/types/ApiResponse";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return sendApiResponse({
      success: false,
      message: "Unauthorized user",
      status: 401,
    });
  }

  try {
    const userId = user._id;
    const { acceptMessages } = await request.json();
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return sendApiResponse({
        success: false,
        message: "Username not found",
        status: 404,
      });
    }

    return sendApiResponse({
      success: true,
      message: "User status has been updated successfully",
      status: 200,
    });
  } catch (error) {
    console.error("ACCEPT_MESSAGES_ERROR: Cannot change user status: ", error);
    return sendApiResponse({
      success: false,
      message: "Cannot change user status",
      status: 500,
    });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return sendApiResponse({
      success: false,
      message: "Unauthorized user",
      status: 401,
    });
  }

  try {
    const userId = user._id;
    const userFound = await UserModel.findById({ userId });
    if (!userFound) {
      return sendApiResponse({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    return sendApiResponse({
      success: true,
      message: "success",
      isAcceptingMessages: userFound.isAcceptingMessages,
      status: 200,
    });
  } catch (error) {
    console.error(
      "ACCEPT_MESSAGE_ERROR:: something went wrong while checking accept messages status: ",
      error
    );

    return sendApiResponse({
      success: false,
      message: "something went wrong while checking accept messages status",
      status: 500,
    });
  }
}
