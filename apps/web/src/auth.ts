import NextAuth from "next-auth";
import { persistOidcIdentity } from "@/auth/identity-store";
import {
  OIDC_PROVIDER_ID,
  readOidcConfiguration,
  toVerifiedOidcIdentity,
} from "@/auth/oidc";

const oidcConfiguration = readOidcConfiguration(process.env);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: oidcConfiguration
    ? [
        {
          id: OIDC_PROVIDER_ID,
          name: oidcConfiguration.providerName,
          type: "oidc",
          issuer: oidcConfiguration.issuer,
          clientId: oidcConfiguration.clientId,
          clientSecret: oidcConfiguration.clientSecret,
          authorization: {
            params: { scope: "openid email profile" },
          },
        },
      ]
    : [],
  secret: process.env.AUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === "true",
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (
        !oidcConfiguration ||
        account?.provider !== OIDC_PROVIDER_ID ||
        !account.providerAccountId
      ) {
        return false;
      }

      const identity = toVerifiedOidcIdentity(
        profile,
        oidcConfiguration.issuer,
        account.providerAccountId,
      );
      if (!identity) {
        return false;
      }

      const minecertUser = await persistOidcIdentity(identity);
      user.id = minecertUser.id;
      user.email = minecertUser.email;
      user.name = minecertUser.name;

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
