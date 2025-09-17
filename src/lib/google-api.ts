
'use server'

import { auth } from "@/auth";
import type { Email, CalendarEvent } from "./data";
import { format, formatISO, startOfDay, endOfDay } from "date-fns";

async function getAccessToken() {
    const session = await auth();
    if (!session || !(session as any).accessToken) {
        return { error: 'Not authenticated or access token not found.' };
    }
    return { accessToken: (session as any).accessToken as string };
}

// Helper to parse sender from headers
function getHeader(headers: { name: string; value: string }[], name: string) {
    const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
}

function parseSender(senderValue: string) {
    const match = senderValue.match(/(.*)<.*>/);
    return match ? match[1].trim() : senderValue;
}

export async function getGoogleEmails(): Promise<{ emails?: Email[], error?: string }> {
    const tokenResult = await getAccessToken();
    if (tokenResult.error) {
        return { error: tokenResult.error };
    }
    const { accessToken } = tokenResult;

    try {
        // 1. Fetch list of unread message IDs
        const messagesResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=10', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!messagesResponse.ok) {
            const errorData = await messagesResponse.json();
            console.error('Gmail API error (messages):', errorData);
            return { error: `Failed to fetch email list: ${errorData.error.message}` };
        }

        const messagesData = await messagesResponse.json();
        if (!messagesData.messages) {
            return { emails: [] };
        }

        // 2. Fetch details for each message
        const emailPromises = messagesData.messages.map(async (msg: { id: string }) => {
            const detailResponse = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject,From,Date`, {
                 headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (!detailResponse.ok) return null;
            const detailData = await detailResponse.json();
            
            const headers = detailData.payload.headers;
            const subject = getHeader(headers, 'Subject');
            const sender = parseSender(getHeader(headers, 'From'));
            const dateStr = getHeader(headers, 'Date');
            const date = new Date(dateStr);
            const timestamp = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            return {
                id: detailData.id,
                sender: sender,
                subject: subject,
                snippet: detailData.snippet,
                isRead: !detailData.labelIds.includes('UNREAD'),
                timestamp: timestamp
            };
        });

        const emails = (await Promise.all(emailPromises)).filter(Boolean) as Email[];
        return { emails };

    } catch (error) {
        console.error('Error fetching Google Emails:', error);
        return { error: 'An unexpected error occurred while fetching emails.' };
    }
}


export async function getGoogleCalendarEvents(): Promise<{ events?: CalendarEvent[], error?: string }> {
    const tokenResult = await getAccessToken();
    if (tokenResult.error) {
        return { error: tokenResult.error };
    }
    const { accessToken } = tokenResult;

    const today = new Date();
    const timeMin = startOfDay(today).toISOString();
    const timeMax = endOfDay(today).toISOString();
    
    try {
        const eventsResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!eventsResponse.ok) {
            const errorData = await eventsResponse.json();
            console.error('Calendar API error:', errorData);
            return { error: `Failed to fetch calendar events: ${errorData.error.message}` };
        }

        const eventsData = await eventsResponse.json();
        const events: CalendarEvent[] = eventsData.items.map((item: any) => {
            const startTime = item.start.dateTime ? format(new Date(item.start.dateTime), 'HH:mm') : 'All-day';
            const endTime = item.end.dateTime ? format(new Date(item.end.dateTime), 'HH:mm') : '';
            const date = item.start.dateTime ? format(new Date(item.start.dateTime), 'yyyy-MM-dd') : item.start.date;

            return {
                id: item.id,
                title: item.summary,
                date: date,
                startTime: startTime,
                endTime: endTime,
                category: 'default', // Calendar API does not have the same categories
                participants: item.attendees ? item.attendees.map((a: any) => a.email) : [],
            };
        });

        return { events };
    } catch (error) {
        console.error('Error fetching Google Calendar Events:', error);
        return { error: 'An unexpected error occurred while fetching calendar events.' };
    }
}
