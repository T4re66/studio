import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
 
export const authConfig = {
  providers: [
    Google({
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        authorization: {
            params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
                scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly"
            }
        }
    })
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // You can add protected routes logic here if needed
      return true;
    },
    async jwt({ token, account }) {
        // Persist the OAuth access_token and refresh_token to the token right after signin
        if (account) {
            if (account.email !== "t4re66@gmail.com") {
                return null; // Block login
            }
            token.accessToken = account.access_token;
            token.refreshToken = account.refresh_token;
            token.expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000;
        }
        
        // Here you would typically add logic to refresh the access token
        // if it has expired, using the refresh token.
        // This requires server-side logic and is crucial for production.

        return token;
    },
    async session({ session, token }) {
        if (token.email !== "t4re66@gmail.com") {
            // This is a double-check to prevent session creation for unauthorized users.
            // `signIn` callback should handle this, but better be safe.
            // In NextAuth v5, returning null from session callback might not log the user out.
            // The primary check should be in `jwt` or `signIn`.
            return { ...session, error: "UnauthorizedUser" };
        }
        // Send properties to the client, like an access_token and user id from a provider.
        (session as any).accessToken = token.accessToken;
        session.user.id = token.sub!;
        
        return session;
    },
    async signIn({ account, profile }) {
        if (account?.provider === "google") {
            // Allow only the specific email address
            return profile?.email === "t4re66@gmail.com";
        }
        return true; // Do different verification for other providers
    }
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
