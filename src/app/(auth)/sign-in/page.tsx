"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import signInSchema from "@/schemas/signInSchema";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const SigninPage = () => {
  const [loginInProgress, setLoginInProgress] = useState(false);
  const router = useRouter();
  const register = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setLoginInProgress(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast(`Login failed: ${result.error}`);
      }

      if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("LOGIN_FAILED:: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast(`Login Failed: ${axiosError.response?.data.message}`);
    } finally {
      setLoginInProgress(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-slate-800 text-slate-300 p-2">
        <div className="bg-slate-900 w-full max-w-lg p-10 rounded-2xl shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl lg:text-5xl mb-4 font-semibold tracking-tight">Join Mystery Message</h1>
            <p className="text-slate-500">signin to start your anonymous journey</p>
          </div>

          <div>
            <Form {...register}>
              <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={register.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username or Email</FormLabel>
                      <FormControl>
                        <Input
                          className="selection:bg-amber-300"
                          placeholder="enter your username or email"
                          {...field}
                          onChange={(e) => field.onChange(e)}
                        />
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
                          type="password"
                          className="selection:bg-amber-300"
                          placeholder="enter your password"
                          {...field}
                          onChange={(e) => field.onChange(e)}
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
                    disabled={loginInProgress}
                  >
                    Sign In
                  </Button>
                  {loginInProgress && (
                    <div className="ml-4 flex items-center text-slate-500">
                      <Loader2 className="animate-spin mr-1" /> <span>please wait...</span>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>

          <div className="mt-3">
            Don't have an account?{" "}
            <Link href={"/sign-up"} className="text-blue-500 hover:text-blue-600 transition">
              SignUp
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SigninPage;
