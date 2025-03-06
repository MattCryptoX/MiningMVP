import { defineSchema, defineTable } from "convex/server";

import { userSchema } from "./schemas/user";
import { userSettingsSchema } from "./schemas/userSettings";
import { workerSchema } from "./schemas/worker";
import { referralSchema } from "./schemas/referral";

export default defineSchema({
  user: defineTable(userSchema)
    .index("by_clerkId", ["clerkId"])
    .index("by_balance", ["balance"]),
  userSettings: defineTable(userSettingsSchema).index("by_userId", ["userId"]),
  worker: defineTable(workerSchema).index("by_userId", ["userId"]),
  referral: defineTable(referralSchema)
    .index("by_referrer", ["referrer"])
    .index("by_referee", ["referee"]),
});
