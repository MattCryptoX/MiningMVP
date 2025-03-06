import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { ReferralData, Referral } from "./types";

import { referralSchema } from "./schemas/referral";

import { makeSchemaValuesOptional } from "./utils";

export const createReferral = mutation({
  args: {
    referrerId: v.id("user"),
    refereeCode: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const referee = await ctx.db
        .query("user")
        .filter((q) => q.eq(q.field("code"), args.refereeCode))
        .unique();

      const existingReferral = await ctx.db
        .query("referral")
        .filter((q) =>
          q.and(
            q.eq(q.field("referrer"), args.referrerId),
            q.eq(q.field("referee"), referee?._id),
          ),
        )
        .unique();

      if (existingReferral) return { success: false };

      const referralId = await ctx.db.insert("referral", {
        referrer: args.referrerId,
        referee: referee?._id as Id<"user">,
      });

      return { success: true, data: referralId };
    } catch (error) {
      return { success: false };
    }
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
    userId: v.optional(v.id("user")),
  },
  handler: async (
    ctx,
    args,
  ): Promise<ReferralData & { flattenedIds?: Id<"user">[] }> => {
    const { userId } = args;

    try {
      const referredByUser: Referral[] = await ctx.db
        .query("referral")
        .withIndex("by_referrer", (q) => q.eq("referrer", userId as Id<"user">))
        .collect();

      const referredToUser: Referral[] = await ctx.db
        .query("referral")
        .withIndex("by_referee", (q) => q.eq("referee", userId as Id<"user">))
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
          userId as Id<"user">,
        ),
      };
    } catch (error) {
      return { success: false };
    }
  },
});
