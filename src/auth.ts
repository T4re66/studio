
'use server';

import type { NextAuthConfig, Session, Account, User as NextAuthUser } from 'next-auth';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

// Define a custom user type if you need to add properties
interface CustomUser extends NextAuthUser {
    id: string;
}

async function refreshAccessToken(token: any) {
    try {
        const url = "https://oauth2.googleapis.com/token";
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authConfig: NextAuthConfig = {
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
    async signIn({ account, profile }) {
        if (account?.provider === "google") {
            if (profile?.email === "t4re66@gmail.com") {
                return true;
            }
            console.log(`Login blocked for email: ${profile?.email}`);
            return false; // Block login for any other email
        }
        return false; // Block all other providers
    },
    async jwt({ token, user, account }) {
        // Initial sign in
        if (account && user) {
            return {
                accessToken: account.access_token,
                accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
                refreshToken: account.refresh_token,
                user: user as CustomUser,
            };
        }

        // Return previous token if the access token has not expired yet
        if (Date.now() < (token.accessTokenExpires as number)) {
            return token;
        }

        // Access token has expired, try to update it
        return refreshAccessToken(token);
    },
    async session({ session, token }) {
        if (token.user) {
            session.user = token.user as CustomUser;
        }
        (session as any).accessToken = token.accessToken;
        (session as any).error = token.error;
        
        return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
