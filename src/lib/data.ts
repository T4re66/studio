

// THIS FILE IS INTENTIONALLY LEFT EMPTY TO CREATE A PURE UI SHELL.

// All data types are defined directly in the components that use them
// to make them self-contained UI previews.

export type User = {
  id: string;
  name: string;
  avatar: string;
  status: 'office' | 'remote' | 'away';
  role: string;
  department: string;
  lastSeen: string;
  dnd: boolean;
  points: number;
  birthday: string; // YYYY-MM-DD
  seat?: string; // e.g., 'A1', 'B2'
  online?: boolean;
  mood?: number; // 1-5 scale
};

export type FridgeItem = {
  id: string;
  name: string;
  owner: string;
  ownerId: string;
  image: string;
  shelf: string;
  expiryDays: number;
};

export type Email = {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  isRead: boolean;
  timestamp: string;
};

export type Break = {
  id: string;
  userId: string;
  type: 'coffee' | 'lunch';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};

export type OfficeTask = {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'Soziales' | 'Büro' | 'Spass';
  isCompleted?: boolean;
};

export type CalendarEvent = {
  id:string;
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
  date: string; // Y_YY-MM-DD
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
    title: string;
    content: string;
    date: string; // YYYY-MM-DD
    tags: string[];
}

export type Team = {
    name: string;
    members: User[];
    score: number;
}

export type Match = {
    name: string;
    teamA: Team;
    teamB: Team;
    winner?: Team;
}

export type TournamentRound = {
    name: string;
    matches: Match[];
}

export type Tournament = {
    id: string;
    name: string;
    game: 'Darts' | 'Ping Pong' | 'Tischfussball';
    points: number;
    rounds: TournamentRound[];
    completed: boolean;
    winner?: Team;
}

export type Deadline = {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  dueDate: string; // YYYY-MM-DD
};


// All mock data has been removed.
// Components now use hardcoded placeholder data for UI preview purposes.

export const teamMembers: User[] = [];
export const fridgeItems: FridgeItem[] = [];
export const emails: Email[] = [];
export const breaks: Break[] = [];
export const officeTasks: OfficeTask[] = [];
export const calendarEvents: CalendarEvent[] = [];
export const grades: Grade[] = [];
export const shopItems: ShopItem[] = [];
export const notes: Note[] = [];
export const deadlines: Deadline[] = [];
export const tournaments: Tournament[] = [];
export const officeLayout = { grid: { rows: 0, cols: 0 }, elements: [] };
export const liveEmails: Email[] = [];
export const liveCalendarEvents: CalendarEvent[] = [];
export const liveNotes: Note[] = [];
