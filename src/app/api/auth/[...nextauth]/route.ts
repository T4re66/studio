import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { authConfig } from '@/auth';

if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET) {
    throw new Error('Missing Google OAuth environment variables');
}

const { handlers, auth } = NextAuth({
    ...authConfig,
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
    ]
});

export const GET = handlers.GET;
export const POST = handlers.POST;

export { auth };
