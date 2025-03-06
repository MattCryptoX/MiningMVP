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

export const fetchUsers = query({
  args: {
    userIds: v.array(v.id("user")),
  },
  handler: async (ctx, args) => {
    const { userIds } = args;

    const users = await Promise.all(
      userIds.map(async (userId) => {
        const user = await ctx.db.get(userId);
        let photoUrl = null;

        if (user?.photo) {
          photoUrl = await ctx.storage.getUrl(user.photo);
        }

        return user ? { ...user, photoUrl } : null;
      }),
    );

    return { success: true, data: users.filter(Boolean) };
  },
});

export const fetchLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("user")
      .withIndex("by_balance")
      .order("desc")
      .take(50);

    const usersWithPhotos = await Promise.all(
      users.map(async (user) => {
        let photoUrl = null;
        if (user.photo) {
          photoUrl = await ctx.storage.getUrl(user.photo);
        }
        return { ...user, photoUrl };
      }),
    );

    return { success: true, data: usersWithPhotos };
  },
});
