

<<<<<<< HEAD
// THIS FILE CONTAINS MOCK DATA AND TYPE DEFINITIONS.
// IN A REAL APPLICATION, THIS DATA WOULD COME FROM FIRESTORE AND GOOGLE APIS.

export type Team = {
    id: string;
    name: string;
    ownerId: string;
    joinCode: string;
    createdAt: any; // Firestore Timestamp
};

export type TeamMembership = {
    id: string;
    teamId: string;
    userId: string;
    role: 'owner' | 'member';
    joinedAt: any; // Firestore Timestamp
};


export type TeamMember = {
=======
// THIS FILE IS INTENTIONALLY LEFT EMPTY TO CREATE A PURE UI SHELL.

// All data types are defined directly in the components that use them
// to make them self-contained UI previews.

export type User = {
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
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
    createdAt?: any;
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

<<<<<<< HEAD
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
  { id: '2', name: 'Bob Williams', avatar: 'https://picsum.photos/seed/user2/200/200', status: 'remote', role: 'Backend Developer', department: 'Engineering', dnd: true, points: 800, birthday: '1988-11-22', seat: null, mood: 3, lunchTime: '13:00' },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', dnd: false, points: 1500, birthday: '1995-03-30', seat: 'B2', mood: 4, lunchTime: '12:30' },
  { id: '4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/user4/200/200', status: 'office', role: 'Product Manager', department: 'Product', dnd: false, points: 1100, birthday: '1992-09-05', seat: 'C1', mood: 2, lunchTime: '12:00' },
  { id: '5', name: 'Ethan Davis', avatar: 'https://picsum.photos/seed/user5/200/200', status: 'away', role: 'QA Engineer', department: 'Engineering', dnd: false, points: 600, birthday: '1993-12-10', seat: null, mood: 5 },
  { id: '6', name: 'Fiona Garcia', avatar: 'https://picsum.photos/seed/user6/200/200', status: 'remote', role: 'Marketing Specialist', department: 'Marketing', dnd: false, points: 950, birthday: '1991-06-18', seat: null, mood: 4, coffeeTime: '15:00' },
  { id: '7', name: 'George Clark', avatar: 'https://picsum.photos/seed/user7/200/200', status: 'office', role: 'DevOps Engineer', department: 'Engineering', dnd: true, points: 1300, birthday: '1989-08-25', seat: 'A3', mood: 3, coffeeTime: '15:00' },
  { id: '8', name: 'Hannah Lewis', avatar: 'https://picsum.photos/seed/user8/200/200', status: 'office', role: 'Data Scientist', department: 'Data', dnd: false, points: 1400, birthday: '1994-01-20', seat: 'B4', mood: 1, lunchTime: '13:00' },
];

export const shopItems: ShopItem[] = [
    { id: 's1', title: 'Kaffee für eine Woche', description: 'Eine Woche lang kostenloser Kaffee aus der Büro-Barista-Maschine.', cost: 500, category: 'Essen & Trinken', icon: 'Coffee' },
    { id: 's2', title: 'Team-Pizza', description: 'Eine Pizza-Session für dich und dein unmittelbares Team.', cost: 2000, category: 'Essen & Trinken', icon: 'Pizza' },
    { id: 's3', title: 'Fokus-Kopfhörer', description: 'Hochwertige Noise-Cancelling-Kopfhörer für einen Tag ausleihen.', cost: 300, category: 'Büro-Vorteile', icon: 'Headphones' },
    { id: 's4', title: 'Ein Tag frei', description: 'Ein zusätzlicher bezahlter Urlaubstag. Muss mit dem Management abgestimmt werden.', cost: 10000, category: 'Freizeit', icon: 'CalendarOff' },
    { id: 's5', title: 'Ergonomischer Stuhl-Upgrade', description: 'Upgrade deinen Bürostuhl für eine Woche auf ein Premium-Modell.', cost: 1500, category: 'Büro-Vorteile', icon: 'Armchair' },
    { id: 's6', title: 'Wunsch-Snack', description: 'Wünsche dir einen Snack, der für eine Woche in der Küche bereitgestellt wird.', cost: 750, category: 'Essen & Trinken', icon: 'Cookie' },
];

export const officeTasks: OfficeTask[] = [
  { id: 't1', title: 'Kaffeemaschine entkalken', description: 'Die Kaffeemaschine braucht etwas Liebe. Entkalke sie für das Wohl des ganzen Teams.', points: 100, category: 'Büro', isCompleted: false, createdAt: new Date() },
  { id: 't2', title: 'Bringe einem Kollegen einen Kaffee', description: 'Frage einen Kollegen, ob er einen Kaffee möchte und bringe ihn ihm an den Platz.', points: 20, category: 'Soziales', isCompleted: false, createdAt: new Date() },
  { id: 't3', title: 'Organisiere eine 5-Minuten-Dehnpause', description: 'Versammle ein paar Kollegen für eine kurze Dehnpause am Nachmittag.', points: 50, category: 'Soziales', isCompleted: false, createdAt: new Date() },
  { id: 't4', title: 'Dekoriere deinen Schreibtisch', description: 'Mache deinen Arbeitsplatz zu einem Ort, an dem du dich wohlfühlst. Sei kreativ!', points: 30, category: 'Spass', isCompleted: false, createdAt: new Date() },
  { id: 't5', title: 'Snack-Attacke', description: 'Bringe heute einen Snack für dein Team mit. Geteilte Freude ist doppelte Freude!', points: 70, category: 'Soziales', isCompleted: false, createdAt: new Date() },
  { id: 't6', title: 'Pflanzen giessen', description: 'Kümmere dich um die Büropflanzen. Sie werden es dir danken.', points: 40, category: 'Büro', isCompleted: false, createdAt: new Date() },
  { id: 't7', title: 'Schreibtisch-Challenge', description: 'Wer hat den ordentlichsten (oder kreativsten) Schreibtisch? Starte einen kleinen Wettbewerb.', points: 60, category: 'Spass', isCompleted: true, createdAt: new Date() },
  { id: 't8', title: 'Feedback geben', description: 'Gib einem Kollegen konstruktives und positives Feedback zu seiner Arbeit.', points: 50, category: 'Soziales', isCompleted: false, createdAt: new Date() },
];


export const liveEmails: Email[] = [
  { id: 'live-e1', sender: 'Sundar Pichai', subject: 'Next-Gen AI & The Future of Search', snippet: 'Team, I want to share our forward-looking strategy for the upcoming year, focusing on Gemini and Search...', isRead: false, timestamp: '09:30' },
  { id: 'live-e2', sender: 'Google Calendar', subject: 'Invitation: Project Meeting @ 11am', snippet: 'You have been invited to a project meeting.', isRead: true, timestamp: '08:15' },
];

const liveToday = new Date();
const formatLiveDate = (date: Date) => date.toISOString().split('T')[0];

export const liveCalendarEvents: CalendarEvent[] = [
  { id: 'live-evt1', title: 'Product Strategy Sync', date: formatLiveDate(liveToday), startTime: '09:00', endTime: '11:00', category: 'Meeting', participants: ['preview-user', '2', '3'] },
  { id: 'live-evt2', title: 'Lunch with Android Team', date: formatLiveDate(liveToday), startTime: '12:30', endTime: '13:30', category: 'Team Event', participants: ['preview-user', '6'] },
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
=======

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
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
