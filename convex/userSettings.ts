import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

import { userSettingsSchema } from "./schemas/userSettings";

import { makeSchemaValuesOptional } from "./utils";

export const createUserSettings = mutation({
  args: userSettingsSchema,
  handler: async (ctx, args) => {
    const userSettingsId = await ctx.db.insert("userSettings", args);

    return { success: true, data: userSettingsId };
  },
});

export const updateUserSettings = mutation({
  args: {
    userSettingsId: v.id("userSettings"),
    updates: v.object(makeSchemaValuesOptional(userSettingsSchema)),
  },
  handler: async (ctx, args) => {
    const { userSettingsId, updates } = args;

    await ctx.db.patch(userSettingsId, updates);
    return { success: true };
  },
});

export const fetchUserSettings = query({
  args: {
    userId: v.optional(v.id("user")),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    try {
      const data = await ctx.db
        .query("userSettings")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      return { success: true, data };
    } catch (error) {
      return { success: false, message: error };
    }
  },
});
