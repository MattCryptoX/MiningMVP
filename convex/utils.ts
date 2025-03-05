import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

import { ReferralData } from "./types";

export const makeSchemaValuesOptional = (schema: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(schema).map(([key, value]) => [key, v.optional(value)]),
  );
};

export const flattenReferralIds = (
  data: ReferralData,
  userId: Id<"user">,
): Id<"user">[] => {
  const { referralsAsReferrer = [], referralsAsReferee = [] } = data;

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
