

// THIS FILE CONTAINS MOCK DATA AND TYPE DEFINITIONS.
// IN A REAL APPLICATION, THIS DATA WOULD COME FROM FIRESTORE AND GOOGLE APIS.

export type Team = {
    id: string;
    name: string;
    ownerId: string;
    joinCode: string;
    createdAt: any; // Firestore Timestamp
};

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


// --- MOCK DATA FOR PREVIEW MODE ---

export const teamMembers: TeamMember[] = [
  { id: 'preview-user', name: 'Du (Gast)', avatar: 'https://picsum.photos/seed/guest/200/200', status: 'office', role: 'App-Tester', department: 'Vorschau', dnd: false, points: 1337, birthday: '1998-04-01', seat: 'A4', mood: 5, lunchTime: '12:30', coffeeTime: '15:00' },
  { id: '2', name: 'Bob Williams', avatar: 'https://picsum.photos/seed/user2/200/200', status: 'remote', role: 'Backend Developer', department: 'Engineering', dnd: true, points: 800, birthday: '1988-11-22', seat: null, mood: 3 },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', dnd: false, points: 1500, birthday: '1995-03-30', seat: 'B2', mood: 4, lunchTime: '12:30' },
  { id: '4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/user4/200/200', status: 'office', role: 'Product Manager', department: 'Product', dnd: false, points: 1100, birthday: '1992-09-05', seat: 'C1', mood: 2 },
  { id: '5', name: 'Ethan Davis', avatar: 'https://picsum.photos/seed/user5/200/200', status: 'away', role: 'QA Engineer', department: 'Engineering', dnd: false, points: 600, birthday: '1993-12-10', seat: null, mood: 5 },
  { id: '6', name: 'Fiona Garcia', avatar: 'https://picsum.photos/seed/user6/200/200', status: 'remote', role: 'Marketing Specialist', department: 'Marketing', dnd: false, points: 950, birthday: '1991-06-18', seat: null, mood: 4 },
  { id: '7', name: 'George Clark', avatar: 'https://picsum.photos/seed/user7/200/200', status: 'office', role: 'DevOps Engineer', department: 'Engineering', dnd: true, points: 1300, birthday: '1989-08-25', seat: 'A3', mood: 3 },
  { id: '8', name: 'Hannah Lewis', avatar: 'https://picsum.photos/seed/user8/200/200', status: 'office', role: 'Data Scientist', department: 'Data', dnd: false, points: 1400, birthday: '1994-01-20', seat: 'B4', mood: 1 },
];


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
