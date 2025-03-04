import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

import { workerSchema } from "./schemas/worker";

import { makeSchemaValuesOptional } from "./utils";

export const createWorker = mutation({
  args: workerSchema,
  handler: async (ctx, args) => {
    const workerId = await ctx.db.insert("worker", args);

    return { success: true, data: workerId };
  },
});

export const updateWorker = mutation({
  args: {
    workerId: v.id("worker"),
    updates: v.object(makeSchemaValuesOptional(workerSchema)),
  },
  handler: async (ctx, args) => {
    const { workerId, updates } = args;

    await ctx.db.patch(workerId, updates);
    return { success: true };
  },
});

export const fetchWorker = query({
  args: {
    userId: v.optional(v.id("user")),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    try {
      const data = await ctx.db
        .query("worker")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      return { success: true, data };
    } catch (error) {
      return { success: false, message: error };
    }
  },
});

export const deleteWorker = mutation({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    const worker = await ctx.db
      .query("worker")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    await ctx.db.delete(worker?._id as Id<"worker">);
    return { success: true };
  },
});
