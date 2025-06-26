"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import signUpSchema from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameResMessage, setUsernameResMessage] = useState("");
  const [usernameCheckingInProgress, setUsernameCheckingInProgress] = useState(false);
  const [formSubmissionInProgress, setFormSubmissionInProgress] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();

  // zod implementation
  const register = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (username) {
        setUsernameCheckingInProgress(true);
        setUsernameResMessage("");
        try {
          const response = await axios.get(`/api/check-unique-username?username=${username}`);
          setUsernameResMessage(response.data.message);
        } catch (error) {
          // console.error("CHECK_USERNAME_AVAILABILITY_ERROR:: ", error);
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameResMessage(axiosError.response?.data.message ?? "Error while checking username availability");
        } finally {
          setUsernameCheckingInProgress(false);
        }
      }
    };

    checkUsernameAvailability();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setFormSubmissionInProgress(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      if (response.data.success) {
        toast(`Success: ${response.data.message}`);
      }
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("SIGNUP_ERROR:: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast(`Failed: ${axiosError.response?.data.message}`);
    } finally {
      setFormSubmissionInProgress(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-slate-800 text-slate-300 p-2">
        <div className="bg-slate-900 w-full max-w-lg p-10 rounded-2xl shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl lg:text-5xl mb-4 font-semibold tracking-tight">Join Mystery Message</h1>
            <p className="text-slate-500">signup to start your anonymous journey</p>
          </div>

          <div>
            <Form {...register}>
              <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={register.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          className="selection:bg-amber-300"
                          placeholder="enter your username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                      </FormControl>
                      {usernameCheckingInProgress && (
                        <div className="flex items-center text-slate-500">
                          <Loader2 className="animate-spin mr-1" /> <span>please wait...</span>
                        </div>
                      )}
                      <p
                        className={`text-xs ${usernameResMessage === "Username is available" ? "text-green-600" : "text-red-600"}`}
                      >
                        {usernameResMessage}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={register.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input className="selection:bg-amber-300" placeholder="enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={register.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          className="selection:bg-amber-300"
                          type="password"
                          placeholder="enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center">
                  <Button
                    type="submit"
                    className="bg-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer disabled:cursor-not-allowed"
                    disabled={formSubmissionInProgress}
                  >
                    Sign Up
                  </Button>
                  {formSubmissionInProgress && (
                    <div className="ml-4 flex items-center text-slate-500">
                      <Loader2 className="animate-spin mr-1" /> <span>please wait...</span>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>

          <div className="mt-3">
            Already a member?{" "}
            <Link href={"/sign-in"} className="text-blue-500 hover:text-blue-600 transition">
              SignIn
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
