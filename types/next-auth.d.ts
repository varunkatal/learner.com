import type { DefaultSession } from "next-auth";
import type { Role } from "@/models/User";

// Adds our own fields to the session so TypeScript knows about them.
declare module "next-auth" {
  interface Session {
    user: { id: string; role: Role } & DefaultSession["user"];
  }
}
