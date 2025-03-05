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

export const fetchReferral = query({
  args: {
    referrer: v.id("user"),
    referee: v.id("user"),
  },
  handler: async (ctx, args) => {
    const { referrer, referee } = args;

    try {
      const data = await ctx.db
        .query("referral")
        .filter((q) =>
          q.or(
            q.and(
              q.eq(q.field("referrer"), referrer),
              q.eq(q.field("referee"), referee),
            ),
            q.and(
              q.eq(q.field("referrer"), referee),
              q.eq(q.field("referee"), referrer),
            ),
          ),
        )
        .first();

      return { success: true, data };
    } catch (error) {
      return { success: false, message: error };
    }
  },
});

export const fetchReferralsByReferrer = query({
  args: {
    referrer: v.id("user"),
  },
  handler: async (ctx, args) => {
    const { referrer } = args;

    try {
      const data = await ctx.db
        .query("referral")
        .withIndex("by_referrer", (q) => q.eq("referrer", referrer))
        .collect();

      return { success: true, data };
    } catch (error) {
      return { success: false, message: error };
    }
  },
});
