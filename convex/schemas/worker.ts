import { v } from "convex/values";

export const workerSchema = {
  userId: v.id("user"),
  rate: v.number(),
};
