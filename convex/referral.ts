import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

import { referralSchema } from "./schemas/referral";

import { makeSchemaValuesOptional } from "./utils";

export const createReferral = mutation({
  args: referralSchema,
  handler: async (ctx, args) => {
    const referralId = await ctx.db.insert("referral", args);

    return { success: true, data: referralId };
  },
});

export const updateReferral = mutation({
  args: {
    referralId: v.id("referral"),
    updates: v.object(makeSchemaValuesOptional(referralSchema)),
  },
  handler: async (ctx, args) => {
    const { referralId, updates } = args;

    await ctx.db.patch(referralId, updates);
    return { success: true };
  },
});

export const fetchReferrals = query({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    try {
      const referredByUser = await ctx.db
        .query("referral")
        .withIndex("by_referrer", (q) => q.eq("referrer", userId))
        .collect();

      const referredToUser = await ctx.db
        .query("referral")
        .withIndex("by_referee", (q) => q.eq("referee", userId))
        .collect();

      return {
        success: true,
        referralsAsReferrer: referredByUser,
        referralsAsReferee: referredToUser,
      };
    } catch (error) {
      return { success: false, message: error };
    }
  },
});
