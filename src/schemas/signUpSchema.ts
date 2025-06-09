import { z } from "zod";

const usernameValidation = z
  .string()
  .min(2, "username is too short, must be atleast 2 character long")
  .max(30, "username is too long, must be less than 30 characters")
  .regex(/^[a-zA-Z0-9_]/, "username must not contain any special character");

const emailValidation = z.string().email({ message: "invalid email address" });

const passwordValidation = z.string().min(6, {
  message: "password is too shord, must be at least 6 character long",
});

const signUpSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});

export { usernameValidation, emailValidation, passwordValidation };
export default signUpSchema;
