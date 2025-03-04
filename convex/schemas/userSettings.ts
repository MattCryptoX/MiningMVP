import { v } from "convex/values";

export const userSettingsSchema = {
  userId: v.id("user"),
  language: v.string(),
  theme: v.union(v.literal("System"), v.literal("Light"), v.literal("Dark")),
};
