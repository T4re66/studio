
// --- DATA MODELS ---
// These types define the structure of data used throughout the application,
// sourced from Firestore and Google APIs.

export type User = {
  id: string; // Firebase Auth UID
  name: string | null;
  email: string | null;
  avatar: string | null;
  joinedAt: string; // ISO date string
  status: 'office' | 'remote' | 'away';
  seat?: string;
  dnd: boolean;
  mood?: number;
};

export type TeamMember = Pick<User, 'id' | 'name' | 'email' | 'avatar'> & {
    online: boolean;
    status: User['status'];
    dnd: boolean;
    mood?: number;
    seat?: string;
    points: number;
    birthday: string;
    lunchTime?: string; // e.g. "12:30"
    coffeeTime?: string; // e.g. "15:00"
}


export type FridgeItem = {
  id: string; // Firestore document ID
  name: string;
  ownerId: string;
  ownerName: string;
  imageUrl: string;
  shelf: string;
  expiryDate: string; // ISO date string
};

export type Email = {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  isRead: boolean;
  timestamp: string; // This might be a relative string like '10:45' or 'yesterday'
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD string
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  category: 'Meeting' | 'Personal' | 'Team Event'; // This is a placeholder, as Google Calendar has its own categorization
  participants: string[]; // user IDs or emails
};

export type OfficeTask = {
  id: string; // Firestore document ID
  title: string;
  description: string;
  points: number;
  category: 'Soziales' | 'Büro' | 'Spass';
  isCompleted?: boolean;
  completedBy?: string; // UID of user who completed it
};

export type ShopItem = {
    id: string;
    title: string;
    description: string;
    cost: number;
    category: 'Essen & Trinken' | 'Büro-Vorteile' | 'Freizeit';
    icon: string;
};

export type Note = {
    id: string;
    title: string;
    content: string;
    date: string; // ISO date string
    tags: string[];
    userId: string;
};

export type Deadline = {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  dueDate: string; // YYYY-MM-DD
};


// --- Google API Data Types ---
// Raw types from the Google API responses.

export interface GoogleEmail {
  id: string;
  snippet: string;
  labelIds?: string[];
  payload: {
    headers: { name: string; value: string }[];
  };
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}
