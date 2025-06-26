import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import { sendApiResponse } from "@/types/ApiResponse";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const user = await UserModel.findOne({ username });

    if (!user) {
      return sendApiResponse({
        success: false,
        message: "User not found.",
        status: 400,
      });
    }

    const isCodeValid = code === user.verificationCode;
    const isCodeExpiared = new Date(user.verificationCodeExpiary) > new Date();

    if (!isCodeValid) {
      return sendApiResponse({
        success: false,
        message: "Incorrect verification code.",
        status: 400,
      });
    }

    if (!isCodeExpiared) {
      return sendApiResponse({
        success: false,
        message: "Verification Code has expiared. Please Signup again.",
        status: 400,
      });
    }

    user.isVerified = true;
    await user.save();
    return sendApiResponse({
      success: true,
      message: "Username has been verified successfully",
      status: 200,
    });
  } catch (error) {
    console.error("VERIFY_USER_ERROR:: Something went wrong while sending otp: ", error);
    return sendApiResponse({
      success: false,
      message: "Something went wrong while sending otp",
      status: 500,
    });
  }
}
