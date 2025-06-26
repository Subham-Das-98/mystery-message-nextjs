"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import verifySchema from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function VerifyPage() {
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();

  // zod implementation
  const register = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setVerificationInProgress(true);
    try {
      const response = await axios.post("/api/verify-user", {
        username: params.username,
        code: data.code,
      });
      if (response.data.success) {
        toast(`Success: ${response.data.message}`);
      }
      router.replace("/sign-in");
    } catch (error) {
      console.log("VERIFICATION_ERROR:: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast(`Failed: ${axiosError.response?.data.message}`);
    } finally {
      setVerificationInProgress(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-slate-800 text-slate-300 p-2">
        <div className="bg-slate-900 w-full max-w-lg p-10 rounded-2xl shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl lg:text-5xl mb-4 font-semibold tracking-tight">Code verification</h1>
            <p className="text-slate-500">Enter the verification code sent to your Email</p>
          </div>

          <div>
            <Form {...register}>
              <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={register.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input
                          className="selection:bg-amber-300"
                          placeholder="enter your verification code"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
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
                    disabled={verificationInProgress}
                  >
                    Verify
                  </Button>
                  {verificationInProgress && (
                    <div className="ml-4 flex items-center text-slate-500">
                      <Loader2 className="animate-spin mr-1" /> <span>please wait...</span>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyPage;
