
import type { GoogleEmail, GoogleCalendarEvent, Email, CalendarEvent } from './data';
import { format, parseISO } from 'date-fns';

const GMAIL_API_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=-category:promotions -category:social';
const CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&singleEvents=true&orderBy=startTime';

/**
 * Fetches the last 10 emails from the user's Gmail account.
 */
export async function fetchGmail(accessToken: string): Promise<Email[]> {
    const response = await fetch(GMAIL_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Failed to fetch email list", response.status, errorBody);
        throw new Error(`Failed to fetch email list: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.messages) {
        return [];
    }

    const messageDetails = await Promise.all(
        data.messages.map(async (message: { id: string }) => {
            const msgResponse = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!msgResponse.ok) {
                console.error(`Failed to fetch details for message ${message.id}`, await msgResponse.text());
                return null; // Skip this email if it fails
            }
            return msgResponse.json();
        })
    );

    return messageDetails
        .filter((gEmail): gEmail is GoogleEmail => gEmail !== null)
        .map((gEmail: GoogleEmail) => {
            const fromHeader = gEmail.payload.headers.find(h => h.name === 'From');
            const subjectHeader = gEmail.payload.headers.find(h => h.name === 'Subject');
            const sender = fromHeader ? fromHeader.value.replace(/<.*>/, '').trim() : 'Unknown Sender';
            
            return {
                id: gEmail.id,
                sender: sender,
                subject: subjectHeader ? subjectHeader.value : 'No Subject',
                snippet: gEmail.snippet,
                isRead: !gEmail.labelIds?.includes('UNREAD'),
                timestamp: '', // Gmail API for list doesn't provide this easily
            };
    });
}

/**
 * Fetches the next 10 events from the user's primary Google Calendar.
 */
export async function fetchCalendar(accessToken: string): Promise<CalendarEvent[]> {
    const url = `${CALENDAR_API_URL}&timeMin=${new Date().toISOString()}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Failed to fetch calendar events", response.status, errorBody);
        throw new Error(`Failed to fetch calendar events: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.items) {
        return [];
    }

    return data.items.map((gEvent: GoogleCalendarEvent) => {
        const startDateTime = gEvent.start?.dateTime || gEvent.start?.date;
        const endDateTime = gEvent.end?.dateTime || gEvent.end?.date;
        
        if (!startDateTime || !endDateTime) {
            return null;
        }

        const parsedStartDate = parseISO(startDateTime);
        const parsedEndDate = parseISO(endDateTime);

        return {
            id: gEvent.id,
            title: gEvent.summary || "Unbenannter Termin",
            date: format(parsedStartDate, 'yyyy-MM-dd'),
            startTime: format(parsedStartDate, 'HH:mm'),
            endTime: format(parsedEndDate, 'HH:mm'),
            category: 'Meeting', // Placeholder category
            participants: [],
        };
    }).filter((event): event is CalendarEvent => event !== null);
}
