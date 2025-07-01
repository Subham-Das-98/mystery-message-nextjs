"use client";
import Link from "next/link";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "../ui/button";

function Navbar() {
  const { data: session, status } = useSession();
  const user: User = session?.user as User;

  return (
    <>
      <div className="flex items-center justify-between py-4 px-3 shadow-xl">
        <div>
          <Link href="/">
            <h1 className="text-slate-200 font-semibold text-xl">Mystery Message</h1>
          </Link>
        </div>
        {status === "authenticated" ? (
          <div>
            <Button
              type="button"
              className="w-max px-2 py-1 rounded-sm block border border-slate-200 text-slate-200 hover:border-amber-500 hover:text-amber-500 transition cursor-pointer"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-blue-400 hover:underline block transition">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="bg-amber-500 w-max px-2 py-1 rounded-sm block border border-amber-500 hover:border-slate-200 hover:text-slate-200 transition"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
