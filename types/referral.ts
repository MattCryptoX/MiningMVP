import { Id } from "@/convex/_generated/dataModel";

export type Referral = {
  _creationTime: number;
  _id: string;
  referee: Id<"user">;
  referrer: Id<"user">;
};

export type ReferralData = {
  referralsAsReferrer: Referral[];
  referralsAsReferee: Referral[];
  success: boolean;
};
