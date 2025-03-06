import { Id } from "@/convex/_generated/dataModel";

export type Referee = {
  _id: Id<"user">;
  _creationTime: number;
  clerkId: string;
  email: string;
  username: string;
  balance: number;
  photo: string;
  code: string;
  status: string;
};
