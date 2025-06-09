import { z } from "zod";

const messageSchema = z.object({
  content: z
    .string()
    .max(255, "message is too long, must be less than 255 characters"),
});

export default messageSchema;
