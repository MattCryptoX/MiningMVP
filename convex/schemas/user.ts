import { v } from "convex/values";

export const userSchema = {
  clerkId: v.string(),
  email: v.string(),
  username: v.string(),
  balance: v.number(),
  code: v.string(),
  photo: v.optional(v.string()),
};
