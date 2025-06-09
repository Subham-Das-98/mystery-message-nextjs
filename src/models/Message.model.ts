import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now, // note: Date.now() will invoked immediately, results all document have the same timestamp
  },
});

// MessageModel = If message already exists in db || if not exists
const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", MessageSchema);

export default MessageModel;
