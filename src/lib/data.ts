
// THIS FILE CONTAINS ONLY TYPE DEFINITIONS.
// THE ACTUAL DATA IS FETCHED FROM FIRESTORE.

export type Team = {
    id: string;
    name: string;
    ownerId: string;
    joinCode: string;
    createdAt: any; // Firestore Timestamp
};

export type TeamMembership = {
    id: string; // {teamId}_{userId}
    teamId: string;
    userId: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: any; // Firestore Timestamp
}

export type TeamMember = {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  status: 'office' | 'remote' | 'away';
  role: string;
  department: string;
  dnd: boolean;
  points: number;
  birthday: string; // YYYY-MM-DD
  seat: string | null; // e.g., 'A1', 'B2'
  mood: number; // 1-5 scale
  lunchTime?: string; // HH:mm
  coffeeTime?: string; // HH:mm
};

export type FridgeItem = {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  imageUrl: string;
  shelf: string;
  expiryDate: string; // YYYY-MM-DD
};

export type Email = {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  isRead: boolean;
  timestamp: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD string
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  category: 'Meeting' | 'Personal' | 'Team Event';
  participants: string[]; // user IDs
};

export type Grade = {
  id: string;
  subject: string;
  grade: number;
  date: string; // YYYY-MM-DD
  type: 'Klausur' | 'Mündlich' | 'Projekt';
  weight: number;
  notes?: string;
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
    userId: string;
    title: string;
    content: string;
    date: string; // ISO String
    tags: string[];
}

export type Tournament = {
    id: string;
    name: string;
    game: 'Darts' | 'Ping Pong' | 'Tischfussball';
    points: number;
    rounds: TournamentRound[];
    completed: boolean;
    winner?: TeamRef;
}

export type TournamentRound = {
    name: string;
    matches: Match[];
}

export type Match = {
    name: string;
    teamA: TeamRef;
    teamB: TeamRef;
    winner?: TeamRef;
}

export type TeamRef = {
    name: string;
    members: {id: string, name: string}[];
    score: number;
}


export type Deadline = {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  dueDate: string; // YYYY-MM-DD
};

// Types for Google API responses
export type GoogleEmail = {
    id: string;
    snippet: string;
    labelIds?: string[];
    payload: {
        headers: { name: string; value: string }[];
    }
}

export type GoogleCalendarEvent = {
    id: string;
    summary: string;
    start: { dateTime?: string; date?: string };
    end: { dateTime?: string; date?: string };
}

export type OfficeTask = {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'Soziales' | 'Büro' | 'Spass';
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: any; // Firestore Timestamp
  createdAt: any; // Firestore Timestamp
};

