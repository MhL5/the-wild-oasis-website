import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "./env";
import { createGuest, getGuest } from "./data-service";

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
    authorized({ auth }) {
      return !!auth?.user;
    },
    async signIn({ user }) {
      try {
        if (!user?.email || !user?.name) return false;

        const foundGuest = await getGuest(user.email);

        if (!foundGuest)
          await createGuest({ email: user.email, fullName: user.name });

        return true;
      } catch {
        return false;
      }
    },
    async session({ session }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session;
    },
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
