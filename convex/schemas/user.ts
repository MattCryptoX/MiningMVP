import { v } from "convex/values";

export const userSchema = {
  clerkId: v.string(),
  email: v.string(),
  username: v.string(),
  balance: v.number(),
  photo: v.optional(v.string()),
};
