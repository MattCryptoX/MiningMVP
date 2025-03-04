import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

import { userSchema } from "./schemas/user";

import { makeSchemaValuesOptional } from "./utils";

export const createUser = mutation({
  args: userSchema,
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("user", args);

    return { success: true, data: userId };
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("user"),
    updates: v.object(makeSchemaValuesOptional(userSchema)),
  },
  handler: async (ctx, args) => {
    const { userId, updates } = args;

    await ctx.db.patch(userId, updates);
    return { success: true };
  },
});

export const fetchUser = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const { clerkId } = args;

    let photoUrl;

    const data = await ctx.db
      .query("user")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (data?.photo) {
      photoUrl = await ctx.storage.getUrl(data.photo);
    }

    return { success: true, data: { ...data, photoUrl } };
  },
});
