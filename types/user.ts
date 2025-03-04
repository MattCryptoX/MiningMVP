import { Id } from "@/convex/_generated/dataModel";

export type User = {
  _id: Id<"user">;
  _creationTime: number;
  clerkId: string;
  username: string;
  balance: number;
  photos?: string;
};
