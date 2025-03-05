import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { ReferralData, Referral } from "./types";

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
  handler: async (
    ctx,
    args,
  ): Promise<ReferralData & { flattenedIds?: Id<"user">[] }> => {
    const { userId } = args;

    try {
      const referredByUser: Referral[] = await ctx.db
        .query("referral")
        .withIndex("by_referrer", (q) => q.eq("referrer", userId))
        .collect();

      const referredToUser: Referral[] = await ctx.db
        .query("referral")
        .withIndex("by_referee", (q) => q.eq("referee", userId))
        .collect();

      const flattenReferralIds = (
        referralsAsReferrer: Referral[],
        referralsAsReferee: Referral[],
        userId: Id<"user">,
      ): Id<"user">[] => {
        const referrerIds: Id<"user">[] = referralsAsReferrer.map(
          (ref) => ref.referee,
        );
        const refereeIds: Id<"user">[] = referralsAsReferee.map(
          (ref) => ref.referrer,
        );

        return [...new Set([...referrerIds, ...refereeIds])].filter(
          (id) => id !== userId,
        );
      };

      return {
        success: true,
        flattenedIds: flattenReferralIds(
          referredByUser,
          referredToUser,
          userId,
        ),
      };
    } catch (error) {
      return { success: false };
    }
  },
});
