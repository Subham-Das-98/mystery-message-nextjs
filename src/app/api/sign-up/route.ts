import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendApiResponse } from "@/types/ApiResponse";
import generateOTP from "@/helpers/generateOTP";
import setVerificationCodeExpiary from "@/helpers/setVerificationCodeExpiary";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // verify if username already exists
    const verifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (verifiedUser) {
      return sendApiResponse({
        success: false,
        message: "SIGNUP_API_ERROR:: username already exists",
        status: 400,
      });
    }

    // verify if email already exists
    const userByEmail = await UserModel.findOne({ email });
    if (userByEmail) {
      if (userByEmail.isVerified) {
        return sendApiResponse({
          success: false,
          message: "SIGNUP_API_ERROR:: email already exists",
          status: 400,
        });
      }

      // update user
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = generateOTP(100000, 999999);

      userByEmail.password = hashedPassword;
      userByEmail.verificationCode = verificationCode;
      userByEmail.verificationCodeExpiary = setVerificationCodeExpiary(1);

      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verificationCode
      );

      if (!emailResponse.success) {
        return sendApiResponse({
          success: false,
          message: "SIGNUP_API_ERROR:: failed to send verification email",
          status: 500,
        });
      }

      await userByEmail.save();

      return sendApiResponse({
        success: true,
        message:
          "Account has been updated successfully. An email has been sent to your account. Please verify.",
        status: 202,
      });
    }

    // create new account
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateOTP(100000, 999999);
    const verificationCodeExpiary = setVerificationCodeExpiary(1);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiary,
      isAcceptingMessages: true,
      isVerified: false,
      message: [],
    });

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verificationCode
    );

    if (!emailResponse.success) {
      return sendApiResponse({
        success: false,
        message: "SIGNUP_API_ERROR:: failed to send verification email",
        status: 500,
      });
    }

    await newUser.save();

    return sendApiResponse({
      success: true,
      message:
        "New account has been created successfully. An email has been sent to your account. Please verify.",
      status: 201,
    });
  } catch (error) {
    console.error(
      "SIGNUP_API_ERROR:: error while creating new account: ",
      error
    );
    return sendApiResponse({
      success: false,
      message: "SIGNUP_API_ERROR:: failed to create new account",
      status: 500,
    });
  }
}
