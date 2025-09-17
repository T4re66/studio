
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
 
export const authConfig = {
  providers: [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
    async jwt({ token, account, user }) {
        // Initial sign in
        if (account && user) {
            return {
                accessToken: account.access_token,
                accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
                refreshToken: account.refresh_token,
                user,
            }
        }

        // Return previous token if the access token has not expired yet
        if (Date.now() < (token.accessTokenExpires as number)) {
            return token
        }

        // Access token has expired, try to update it
        // NOTE: In a production app, you would implement refresh token logic here.
        // For this demo, we'll rely on re-authentication.
        console.log("Access token has expired. Re-authentication is needed.");
        
        return token;
    },
    async session({ session, token }) {
        if (token.user) {
            session.user = token.user as any; // Pass user info to session
        }
        (session as any).accessToken = token.accessToken;
        (session as any).error = token.error;
        
        return session;
    },
    async signIn({ account, profile }) {
        if (account?.provider === "google") {
            // Allow only the specific email address
            if (profile?.email === "t4re66@gmail.com") {
                return true;
            } else {
                 console.log(`Login blocked for email: ${profile?.email}`);
                 return false;
            }
        }
        return false; // Block other providers
    }
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
