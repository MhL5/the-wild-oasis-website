import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's postal address. */
      guestId: number;
    } & DefaultSession["user"];
  }
}
