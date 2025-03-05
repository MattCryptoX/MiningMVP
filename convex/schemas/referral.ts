import { v } from "convex/values";

export const referralSchema = {
  referrer: v.id("user"),
  referee: v.id("user"),
};
