import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const newToken = {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: profile.login,
          accessTokenExpires: account.expires_at
        }
        return newToken;
      }

      if (Date.now() < (token.accessTokenExpires as number) * 1000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.error = token.error as "RefreshAccessTokenError";
      session.accessToken = token.accessToken as string;
      session.user.username = token.username as string;
      return session;
    },
  },
});

async function refreshAccessToken(token: unknown) {
  const tokenJWT = token as JWT;
  const refreshToken = tokenJWT.refreshToken;

  if (!refreshToken) throw new TypeError("Missing refresh_token")

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        client_id: process.env.GITHUB_ID,
        client_secret: process.env.GITHUB_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    const tokensOrError = await response.json();

    if (!response.ok) throw tokensOrError;

    const newTokens = tokensOrError as {
      access_token: string
      expires_in: number
      refresh_token?: string
    }

    tokenJWT.accessToken = newTokens.access_token;
    tokenJWT.refreshToken = newTokens.refresh_token ?? refreshToken;
    tokenJWT.accessTokenExpires = Math.floor(
      Date.now() / 1000 + newTokens.expires_in
    )
    if (newTokens.refresh_token) {
      tokenJWT.refreshToken = newTokens.refresh_token;
    }

    return tokenJWT;
  } catch (error) {
    console.error("Error refreshing access_token", error);
    tokenJWT.error = "RefreshAccessTokenError";
    return tokenJWT;
  }
}