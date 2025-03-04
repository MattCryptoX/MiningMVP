import { Id } from "@/convex/_generated/dataModel";

export type Worker = {
  _id: Id<"worker">;
  _creationTime: number;
  userId: Id<"user">;
  rate: number;
};
