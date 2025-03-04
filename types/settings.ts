import { Id } from "@/convex/_generated/dataModel";

export type UserSettings = {
  _id: Id<"userSettings">;
  userId: Id<"user">;
  language: string;
  theme: Theme;
};

export type Theme = "System" | "Light" | "Dark";
