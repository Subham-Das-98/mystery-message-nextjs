import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import { sendApiResponse } from "@/types/ApiResponse";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = { username: searchParams.get("username") };

    // validate username with zod
    const result = UsernameQuerySchema.safeParse(queryParams);
    // console.log(result) // todo
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return sendApiResponse({
        success: false,
        status: 400,
        message:
          usernameErrors.length > 0
            ? usernameErrors.join(", ")
            : "Invalid query params",
      });
    }

    const { username } = result.data;
    const verifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (verifiedUser) {
      return sendApiResponse({
        success: false,
        message: "Username is already exists",
        status: 400,
      });
    }

    return sendApiResponse({
      success: true,
      message: "Username is available",
      status: 200,
    });
  } catch (error) {
    console.error(
      "CHECK_UNIQUE_USERNAME_ERROR:: something went wrong while checking username",
      error
    );
    return sendApiResponse({
      success: false,
      message: "Error while checking username",
      status: 500,
    });
  }
}
