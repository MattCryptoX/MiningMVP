import { Id } from "./_generated/dataModel";

export type Referral = {
  _creationTime: number;
  _id: string;
  referee: Id<"user">;
  referrer: Id<"user">;
};

export type ReferralData = {
  success: boolean;
  referralsAsReferrer?: Referral[];
  referralsAsReferee?: Referral[];
};
