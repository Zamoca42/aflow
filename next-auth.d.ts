import type { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: "RefreshAccessTokenError";
    user: {
      username?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username?: string;
  }

  interface Profile {
    login?: string;
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    username?: string;
    accessTokenExpires?: number;
    error?: "RefreshAccessTokenError"
  }
}