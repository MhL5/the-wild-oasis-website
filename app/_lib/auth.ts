import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "./env";

//
type NextAuthConfig = Parameters<typeof NextAuth>[0];

const nextAuthConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(nextAuthConfig);
