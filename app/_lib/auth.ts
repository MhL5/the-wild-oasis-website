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
  callbacks: {
    authorized: ({ auth }) => !!auth?.user,
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(nextAuthConfig);
