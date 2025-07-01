import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { sendApiResponse } from "@/types/ApiResponse";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const messageId = params.id;
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
    const result = await UserModel.updateOne({ _id: user._id }, { $pull: { messages: { _id: messageId } } });
    if (result.matchedCount === 0) {
      return sendApiResponse({
        success: false,
        message: "Message not found or already deleted",
        status: 404,
      });
    }

    return sendApiResponse({
      success: true,
      message: "Message deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.log("DELETE_MESSAGE_ERROR:: Something went wrong while deleting message");
    return sendApiResponse({
      success: false,
      message: "Something went wrong while deleting message",
      status: 500,
    });
  }
}
