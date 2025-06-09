import resend from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "MYSTERY MESSAGE: Verification Code",
      react: VerificationEmail({ username, otp: verificationCode }),
    });
    return {
      success: true,
      message: "Verification email has been sent successfully.",
    };
  } catch (error) {
    console.error(
      "SEND_VERIFICATION_EMAIL_ERROR:: error while sending verification email",
      error
    );
    return {
      success: false,
      message:
        "SEND_VERIFICATION_EMAIL_ERROR:: failed to send verification email",
    };
  }
}

export default sendVerificationEmail;
