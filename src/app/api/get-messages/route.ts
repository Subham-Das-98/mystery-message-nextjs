import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { sendApiResponse } from "@/types/ApiResponse";
import mongoose from "mongoose";

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
    const userId = new mongoose.Types.ObjectId(user._id);
    const data = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    if (!data || data.length === 0) {
      return sendApiResponse({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    return sendApiResponse({
      success: true,
      message: "Success",
      status: 200,
      messages: data[0].messages,
    });
  } catch (error) {
    console.error(
      "GET_MESSAGES_ERROR:: Something went wrong while fetching messages: ",
      error
    );
    return sendApiResponse({
      success: false,
      message: "Something went wrong while fetching messages",
      status: 500,
    });
  }
}
