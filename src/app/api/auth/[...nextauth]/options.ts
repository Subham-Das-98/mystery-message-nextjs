import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import UserModel, { User } from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { Credentials } from "@/types/Credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { username: credentials.identifier },
              { email: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("AUTH_ERROR:: User not found");
          }

          if (!user.isVerified) {
            throw new Error("AUTH_ERROR:: User not verified");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("AUTH_ERROR:: incorrect password");
          }

          return user;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString() as string;
        token.username = user.username as string;
        token.isVerified = user.isVerified as boolean;
        token.isAcceptingMessages = user.isAcceptingMessages as boolean;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.username = token.username as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
