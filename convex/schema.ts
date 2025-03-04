import { defineSchema, defineTable } from "convex/server";

import { userSchema } from "./schemas/user";
import { userSettingsSchema } from "./schemas/userSettings";

export default defineSchema({
  user: defineTable(userSchema).index("by_clerkId", ["clerkId"]),
  userSettings: defineTable(userSettingsSchema).index("by_userId", ["userId"]),
});
