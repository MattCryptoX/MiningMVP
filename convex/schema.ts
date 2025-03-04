import { defineSchema, defineTable } from "convex/server";

import { userSchema } from "./schemas/user";
import { userSettingsSchema } from "./schemas/userSettings";
import { workerSchema } from "./schemas/worker";

export default defineSchema({
  user: defineTable(userSchema).index("by_clerkId", ["clerkId"]),
  userSettings: defineTable(userSettingsSchema).index("by_userId", ["userId"]),
  worker: defineTable(workerSchema).index("by_userId", ["userId"]),
});
