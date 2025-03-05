import { Id } from "@/convex/_generated/dataModel";
import { ReferralData } from "@/types/referral";

export const flattenReferralIds = (
  data: ReferralData,
  userId: Id<"user">,
): Id<"user">[] => {
  const { referralsAsReferrer, referralsAsReferee } = data;

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
