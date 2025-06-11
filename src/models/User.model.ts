import mongoose, { Schema, Document } from "mongoose";
import { Message } from "@/models/Message.model";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
  verificationCodeExpiary: Date;
  isAcceptingMessages: boolean;
  isVerified: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  verificationCodeExpiary: {
    type: Date,
    required: true,
  },
  isAcceptingMessages: {
    type: Boolean,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// UserModel = If user already exists in db || if not exists
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
