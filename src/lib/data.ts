


// THIS FILE CONTAINS MOCK DATA FOR DEMONSTRATION PURPOSES.
// IN A REAL APPLICATION, THIS DATA WOULD COME FROM FIRESTORE.

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


export const teamMembers: User[] = [
  { id: '1', name: 'Tarec', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false, points: 1250, birthday: '1990-07-15', seat: 'A4', online: true, mood: 5 },
  { id: '2', name: 'Bob Williams', avatar: 'https://picsum.photos/seed/user2/200/200', status: 'remote', role: 'Backend Developer', department: 'Engineering', lastSeen: '2h ago', dnd: true, points: 800, birthday: '1988-11-22', online: true, mood: 3 },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', lastSeen: '5m ago', dnd: false, points: 1500, birthday: '1995-03-30', seat: 'B2', online: true, mood: 4 },
  { id: '4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/user4/200/200', status: 'office', role: 'Product Manager', department: 'Product', lastSeen: '15m ago', dnd: false, points: 1100, birthday: '1992-09-05', seat: 'C1', online: true, mood: 2 },
  { id: '5', name: 'Ethan Davis', avatar: 'https://picsum.photos/seed/user5/200/200', status: 'away', role: 'QA Engineer', department: 'Engineering', lastSeen: 'yesterday', dnd: false, points: 600, birthday: '1993-12-10', online: false, mood: 5 },
  { id: '6', name: 'Fiona Garcia', avatar: 'https://picsum.photos/seed/user6/200/200', status: 'remote', role: 'Marketing Specialist', department: 'Marketing', lastSeen: '30m ago', dnd: false, points: 950, birthday: '1991-06-18', online: true, mood: 4 },
  { id: '7', name: 'George Clark', avatar: 'https://picsum.photos/seed/user7/200/200', status: 'office', role: 'DevOps Engineer', department: 'Engineering', lastSeen: 'now', dnd: true, points: 1300, birthday: '1989-08-25', seat: 'A3', online: true, mood: 3 },
  { id: '8', name: 'Hannah Lewis', avatar: 'https://picsum.photos/seed/user8/200/200', status: 'office', role: 'Data Scientist', department: 'Data', lastSeen: '1h ago', dnd: false, points: 1400, birthday: '1994-01-20', seat: 'B4', online: false, mood: 1 },
];

export const fridgeItems: FridgeItem[] = [
  { id: 'f1', name: 'Milch', owner: 'Tarec', ownerId: '1', image: 'https://picsum.photos/seed/milk/400/300', shelf: 'A2', expiryDays: 2 },
  { id: 'f2', name: 'Joghurt', owner: 'Charlie Brown', ownerId: '3', image: 'https://picsum.photos/seed/yogurt/400/300', shelf: 'C1', expiryDays: 1 },
  { id: 'f3', name: 'Sandwich', owner: 'Tarec', ownerId: '1', image: 'https://picsum.photos/seed/sandwich/400/300', shelf: 'B3', expiryDays: 0 },
  { id: 'f4', name: 'Salat', owner: 'Diana Miller', ownerId: '4', image: 'https://picsum.photos/seed/salad/400/300', shelf: 'A1', expiryDays: 5 },
  { id: 'f5', name: 'Orangensaft', owner: 'Team', ownerId: 'team', image: 'https://picsum.photos/seed/juice/400/300', shelf: 'Door', expiryDays: 12 },
  { id: 'f6', name: 'Pizza Reste', owner: 'George Clark', ownerId: '7', image: 'https://picsum.photos/seed/pizza/400/300', shelf: 'D2', expiryDays: 3 },
  { id: 'f7', name: 'Beeren', owner: 'Hannah Lewis', ownerId: '8', image: 'https://picsum.photos/seed/berries/400/300', shelf: 'C2', expiryDays: 4 },
  { id: 'f8', name: 'Kuchen', owner: 'Team', ownerId: 'team', image: 'https://picsum.photos/seed/cake/400/300', shelf: 'B1', expiryDays: -1 },
];

export const parkingStatus = {
  totalSpots: 50,
  freeSpots: 5,
};

export const emails: Email[] = [
  { id: 'e1', sender: 'Projekt Phoenix', subject: 'Weekly Sync Recap & Action Items', snippet: 'Thanks everyone for the productive meeting. Here are the key takeaways and action items...', isRead: false, timestamp: '10:45' },
  { id: 'e2', sender: 'HR Department', subject: 'Reminder: Annual Performance Reviews', snippet: 'This is a friendly reminder to complete your self-assessment for the annual performance review...', isRead: true, timestamp: '09:15' },
  { id: 'e3', sender: 'IT Support', subject: 'Scheduled Maintenance for Network Servers', snippet: 'Please be advised that we will be performing scheduled maintenance on our network servers...', isRead: false, timestamp: 'yesterday' },
];

export const breaks: Break[] = [
    { id: 'b1', userId: '1', type: 'lunch', startTime: '12:30', endTime: '13:00' },
    { id: 'b2', userId: '3', type: 'lunch', startTime: '12:30', endTime: '13:00' },
    { id: 'b3', userId: '4', type: 'coffee', startTime: '15:00', endTime: '15:15' },
];


export const officeTasks: OfficeTask[] = [
  { id: 't1', title: 'Kaffeemaschine entkalken', description: 'Die Kaffeemaschine braucht etwas Liebe. Entkalke sie für das Wohl des ganzen Teams.', points: 100, category: 'Büro' },
  { id: 't2', title: 'Bringe einem Kollegen einen Kaffee', description: 'Frage einen Kollegen, ob er einen Kaffee möchte und bringe ihn ihm an den Platz.', points: 20, category: 'Soziales' },
  { id: 't3', title: 'Organisiere eine 5-Minuten-Dehnpause', description: 'Versammle ein paar Kollegen für eine kurze Dehnpause am Nachmittag.', points: 50, category: 'Soziales' },
  { id: 't4', title: 'Dekoriere deinen Schreibtisch', description: 'Mache deinen Arbeitsplatz zu einem Ort, an dem du dich wohlfühlst. Sei kreativ!', points: 30, category: 'Spass' },
  { id: 't5', title: 'Snack-Attacke', description: 'Bringe heute einen Snack für dein Team mit. Geteilte Freude ist doppelte Freude!', points: 70, category: 'Soziales' },
  { id: 't6', title: 'Pflanzen giessen', description: 'Kümmere dich um die Büropflanzen. Sie werden es dir danken.', points: 40, category: 'Büro' },
  { id: 't7', title: 'Schreibtisch-Challenge', description: 'Wer hat den ordentlichsten (oder kreativsten) Schreibtisch? Starte einen kleinen Wettbewerb.', points: 60, category: 'Spass', isCompleted: true },
  { id: 't8', title: 'Feedback geben', description: 'Gib einem Kollegen konstruktives und positives Feedback zu seiner Arbeit.', points: 50, category: 'Soziales' },
];

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const calendarEvents: CalendarEvent[] = [
  { id: 'evt1', title: 'Project Phoenix Sync', date: formatDate(today), startTime: '10:00', endTime: '11:00', category: 'Meeting', participants: ['1', '2', '3', '4'] },
  { id: 'evt2', title: 'Design Review', date: formatDate(today), startTime: '14:00', endTime: '15:30', category: 'Meeting', participants: ['1', '3', '4'] },
  { id: 'evt3', title: 'Zahnarzt', date: formatDate(today), startTime: '12:00', endTime: '13:00', category: 'Personal', participants: ['1'] },
  { id: 'evt4', title: 'Team Lunch', date: new Date(today.setDate(today.getDate() + 2)).toISOString().split('T')[0], startTime: '12:30', endTime: '13:30', category: 'Team Event', participants: ['1', '2', '3', '4', '5', '6', '7', '8'] },
];

export const grades: Grade[] = [
    { id: 'g1', subject: 'Mathematik', grade: 1.3, date: '2024-03-10', type: 'Klausur', weight: 2, notes: 'Analysis' },
    { id: 'g2', subject: 'Mathematik', grade: 2.0, date: '2024-04-22', type: 'Mündlich', weight: 1, notes: 'Lineare Algebra' },
    { id: 'g3', subject: 'Deutsch', grade: 2.3, date: '2024-03-15', type: 'Klausur', weight: 2, notes: 'Gedichtanalyse' },
    { id: 'g4', subject: 'Englisch', grade: 1.7, date: '2024-03-20', type: 'Klausur', weight: 2, notes: 'Vokabeltest' },
    { id: 'g5', subject: 'Englisch', grade: 1.0, date: '2024-04-28', type: 'Projekt', weight: 1, notes: 'Präsentation über Shakespeare' },
    { id: 'g6', subject: 'Physik', grade: 3.0, date: '2024-02-25', type: 'Klausur', weight: 2, notes: 'Mechanik' },
    { id: 'g7', subject: 'Physik', grade: 2.3, date: '2024-05-30', type: 'Mündlich', weight: 1, notes: 'Thermodynamik' },
    { id: 'g8', subject: 'Chemie', grade: 1.0, date: '2024-03-12', type: 'Klausur', weight: 2, notes: 'Organische Chemie' },
    { id: 'g9', subject: 'Deutsch', grade: 1.7, date: '2024-05-02', type: 'Mündlich', weight: 1, notes: 'Diskussion' },
    { id: 'g10', subject: 'Mathematik', grade: 1.0, date: '2024-05-18', type: 'Klausur', weight: 2, notes: 'Stochastik' },
    { id: 'g11', subject: 'Biologie', grade: 2.7, date: '2024-03-05', type: 'Klausur', weight: 2, notes: 'Genetik' },
    { id: 'g12', subject: 'Biologie', grade: 2.0, date: '2024-04-15', type: 'Projekt', weight: 1, notes: 'Ökosystem-Modell' },
    { id: 'g13', subject: 'Geschichte', grade: 1.7, date: '2024-02-10', type: 'Klausur', weight: 2, notes: 'Französische Revolution' },
    { id: 'g14', subject: 'Geschichte', grade: 2.3, date: '2024-04-05', type: 'Mündlich', weight: 1, notes: 'Weimarer Republik' },
    { id: 'g15', subject: 'Kunst', grade: 1.0, date: '2024-05-20', type: 'Projekt', weight: 1, notes: 'Porträtmalerei' },
    { id: 'g16', subject: 'Sport', grade: 1.3, date: '2024-06-01', type: 'Mündlich', weight: 1, notes: 'Leichtathletik-Bewertung' },
    { id: 'g17', subject: 'Informatik', grade: 1.7, date: '2024-03-25', type: 'Klausur', weight: 2, notes: 'Datenbanken' },
    { id: 'g18', subject: 'Informatik', grade: 1.0, date: '2024-05-15', type: 'Projekt', weight: 1, notes: 'Web-Anwendung' },
    { id: 'g19', subject: 'Mathematik', grade: 2.7, date: '2024-06-05', type: 'Klausur', weight: 2, notes: 'Geometrie' },
    { id: 'g20', subject: 'Deutsch', grade: 3.0, date: '2024-06-10', type: 'Klausur', weight: 2, notes: 'Epochenvergleich' },
    { id: 'g21', subject: 'Englisch', grade: 2.3, date: '2024-06-12', type: 'Mündlich', weight: 1, notes: 'Debatte' },
    { id: 'g22', subject: 'Physik', grade: 2.0, date: '2024-06-15', type: 'Klausur', weight: 2, notes: 'Optik' },
    { id: 'g23', subject: 'Chemie', grade: 1.7, date: '2024-06-18', type: 'Mündlich', weight: 1, notes: 'Periodensystem' },
    { id: 'g24', subject: 'Biologie', grade: 1.3, date: '2024-06-20', type: 'Klausur', weight: 2, notes: 'Evolution' },
    { id: 'g25', subject: 'Geschichte', grade: 2.0, date: '2024-06-22', type: 'Projekt', weight: 1, notes: 'Kalter Krieg' },
    { id: 'g26', subject: 'Latein', grade: 3.3, date: '2024-03-18', type: 'Klausur', weight: 2, notes: 'Übersetzung Cäsar' },
    { id: 'g27', subject: 'Latein', grade: 2.7, date: '2024-05-22', type: 'Mündlich', weight: 1, notes: 'Vokabeltest' },
    { id: 'g28', subject: 'Ethik', grade: 1.0, date: '2024-06-11', type: 'Mündlich', weight: 1, notes: 'Diskussion über Kant' },
    { id: 'g29', subject: 'Musik', grade: 2.0, date: '2024-04-30', type: 'Projekt', weight: 1, notes: 'Komposition' },
    { id: 'g30', subject: 'Geographie', grade: 2.3, date: '2024-05-14', type: 'Klausur', weight: 2, notes: 'Klimazonen' },
];

export const shopItems: ShopItem[] = [
    { id: 's1', title: 'Kaffee für eine Woche', description: 'Eine Woche lang kostenloser Kaffee aus der Büro-Barista-Maschine.', cost: 500, category: 'Essen & Trinken', icon: 'Coffee' },
    { id: 's2', title: 'Team-Pizza', description: 'Eine Pizza-Session für dich und dein unmittelbares Team.', cost: 2000, category: 'Essen & Trinken', icon: 'Pizza' },
    { id: 's3', title: 'Fokus-Kopfhörer', description: 'Hochwertige Noise-Cancelling-Kopfhörer für einen Tag ausleihen.', cost: 300, category: 'Büro-Vorteile', icon: 'Headphones' },
    { id: 's4', title: 'Ein Tag frei', description: 'Ein zusätzlicher bezahlter Urlaubstag. Muss mit dem Management abgestimmt werden.', cost: 10000, category: 'Freizeit', icon: 'CalendarOff' },
    { id: 's5', title: 'Ergonomischer Stuhl-Upgrade', description: 'Upgrade deinen Bürostuhl für eine Woche auf ein Premium-Modell.', cost: 1500, category: 'Büro-Vorteile', icon: 'Armchair' },
    { id: 's6', title: 'Wunsch-Snack', description: 'Wünsche dir einen Snack, der für eine Woche in der Küche bereitgestellt wird.', cost: 750, category: 'Essen & Trinken', icon: 'Cookie' },
];

export const officeLayout = {
  grid: {
    rows: 12,
    cols: 20,
  },
  elements: [
    // Walls
    { id: 'wall-top', type: 'wall', gridArea: '1 / 1 / 2 / -1' },
    { id: 'wall-bottom', type: 'wall', gridArea: '-2 / 1 / -1 / -1' },
    { id: 'wall-left', type: 'wall', gridArea: '1 / 1 / -1 / 2' },
    { id: 'wall-right', type: 'wall', gridArea: '1 / -2 / -1 / -1' },
    { id: 'wall-meeting-room', type: 'wall', gridArea: '2 / 14 / 6 / 15' },

    // Areas
    { id: 'area-entrance', type: 'area', name: 'Eingang', gridArea: '12 / 9 / 13 / 13' },
    { id: 'area-lounge', type: 'area', name: 'Lounge', icon: 'Coffee', gridArea: '2 / 15 / 6 / 20' },
    { id: 'area-meeting-room', type: 'area', name: 'Meetingraum', icon: 'Tv', gridArea: '2 / 8 / 6 / 14' },

    // Desks - Block A
    { id: 'desk-a1', type: 'desk', seatId: 'A1', gridArea: '3 / 2 / 5 / 4' },
    { id: 'desk-a2', type: 'desk', seatId: 'A2', gridArea: '3 / 4 / 5 / 6' },
    { id: 'desk-a3', type: 'desk', seatId: 'A3', gridArea: '6 / 2 / 8 / 4' },
    { id: 'desk-a4', type: 'desk', seatId: 'A4', gridArea: '6 / 4 / 8 / 6' },
    
    // Desks - Block B
    { id: 'desk-b1', type: 'desk', seatId: 'B1', gridArea: '9 / 2 / 11 / 4' },
    { id: 'desk-b2', type: 'desk', seatId: 'B2', gridArea: '9 / 4 / 11 / 6' },
    { id: 'desk-b3', type: 'desk', seatId: 'B3', gridArea: '9 / 8 / 11 / 10' },
    { id: 'desk-b4', type: 'desk', seatId: 'B4', gridArea: '9 / 10 / 11 / 12' },

    // Desks - Block C
    { id: 'desk-c1', type: 'desk', seatId: 'C1', gridArea: '7 / 15 / 9 / 17', rotation: 90 },
    { id: 'desk-c2', type: 'desk', seatId: 'C2', gridArea: '7 / 17 / 9 / 19', rotation: 90 },
    { id: 'desk-c3', type: 'desk', seatId: 'C3', gridArea: '10 / 15 / 12 / 17', rotation: 90 },
    { id: 'desk-c4', type: 'desk', seatId: 'C4', gridArea: '10 / 17 / 12 / 19', rotation: 90 },
  ],
}

export const notes: Note[] = [
    { id: 'n1', title: 'Meeting-Notizen: Project Phoenix', content: '<p>Wichtige Punkte aus dem Meeting: Das Backend-Team hat Probleme mit der Datenbank-Migration. Wir müssen das bis Freitag klären. <strong>Action Item:</strong> Tarec soll sich mit Bob abstimmen.</p>', date: '2024-07-22', tags: ['meeting', 'project-phoenix'] },
    { id: 'n2', title: 'Ideen für Q3', content: '<p>Brainstorming für das nächste Quartal:</p><ul><li>Gamification weiter ausbauen (z.B. Team-Challenges)</li><li>Performance der App verbessern</li><li>Neues Feature: "Pausen-Roulette"</li></ul>', date: '2024-07-20', tags: ['ideen', 'planung'] },
];

export const deadlines: Deadline[] = [
  { id: 'd1', title: 'Frontend-Implementierung abschliessen', projectId: 'p1', projectName: 'Projekt Phoenix', dueDate: '2024-08-15' },
  { id: 'd2', title: 'Q3-Marketingbericht erstellen', projectId: 'p2', projectName: 'Marketing-Kampagne', dueDate: '2024-07-30' },
  { id: 'd3', title: 'Datenbank-Migration planen', projectId: 'p1', projectName: 'Projekt Phoenix', dueDate: '2024-09-01' },
  { id: 'd4', title: 'User-Testing durchführen', projectId: 'p3', projectName: 'Neue App-Funktion', dueDate: '2024-08-05' },
];

const [tarec, bob, charlie, diana, ethan, fiona, george, hannah] = teamMembers;

export const tournaments: Tournament[] = [
    {
        id: 'tour-darts-1',
        name: 'Dart-Meisterschaft Q3',
        game: 'Darts',
        points: 500,
        completed: false,
        rounds: [
            {
                name: 'Halbfinale',
                matches: [
                    { name: 'Match 1', teamA: { name: 'Tarec', members: [tarec], score: 0 }, teamB: { name: 'Diana', members: [diana], score: 0 } },
                    { name: 'Match 2', teamA: { name: 'Charlie', members: [charlie], score: 0 }, teamB: { name: 'George', members: [george], score: 0 } },
                ]
            },
            {
                name: 'Finale',
                matches: [
                    { name: 'Final-Match', teamA: { name: 'TBD', members: [], score: 0 }, teamB: { name: 'TBD', members: [], score: 0 } },
                ]
            }
        ]
    },
    {
        id: 'tour-pingpong-1',
        name: 'Ping Pong Turnier',
        game: 'Ping Pong',
        points: 400,
        completed: true,
        winner: { name: 'Fiona', members: [fiona], score: 21 },
        rounds: [
            {
                name: 'Finale',
                matches: [
                    { name: 'Final-Match', teamA: { name: 'Fiona', members: [fiona], score: 21 }, teamB: { name: 'Bob', members: [bob], score: 18 }, winner: { name: 'Fiona', members: [fiona], score: 21 } },
                ]
            }
        ]
    },
    {
        id: 'tour-tf-1',
        name: 'Tischfussball Cup',
        game: 'Tischfussball',
        points: 750,
        completed: false,
        rounds: [
            {
                name: 'Halbfinale',
                matches: [
                    { name: 'Match 1', teamA: { name: 'Devs', members: [tarec, bob], score: 0 }, teamB: { name: 'Design & PM', members: [charlie, diana], score: 0 } },
                    { name: 'Match 2', teamA: { name: 'QA & Marketing', members: [ethan, fiona], score: 0 }, teamB: { name: 'Data & DevOps', members: [hannah, george], score: 0 } },
                ]
            },
             {
                name: 'Finale',
                matches: [
                    { name: 'Final-Match', teamA: { name: 'TBD', members: [], score: 0 }, teamB: { name: 'TBD', members: [], score: 0 } },
                ]
            }
        ]
    }
]


// --- LIVE DATA (MOCKED) FOR GOOGLE CONNECTION ---
// This data is used to simulate what would be fetched from Google APIs
// after a user connects their account.
export const liveEmails: Email[] = [
  { id: 'live-e1', sender: 'Sundar Pichai', subject: 'Next-Gen AI & The Future of Search', snippet: 'Team, I want to share our forward-looking strategy for the upcoming year, focusing on Gemini and Search...', isRead: false, timestamp: '09:30' },
  { id: 'live-e2', sender: 'Google Calendar', subject: 'Invitation: Project Meeting @ 11am', snippet: 'You have been invited to a project meeting.', isRead: true, timestamp: '08:15' },
  { id: 'live-e3', sender: 'Google Alerts', subject: 'Your weekly digest on "AI in production"', snippet: 'New results for your Google Alert...', isRead: false, timestamp: 'yesterday' },
  { id: 'live-e4', sender: 'gcloud-noreply', subject: 'Your latest bill is now available', snippet: 'Your bill for June 2024 is ready to be viewed and paid.', isRead: false, timestamp: '11:50' },
];

const liveToday = new Date();
const formatLiveDate = (date: Date) => date.toISOString().split('T')[0];

export const liveCalendarEvents: CalendarEvent[] = [
  { id: 'live-evt1', title: 'Product Strategy Sync', date: formatLiveDate(liveToday), startTime: '09:00', endTime: '11:00', category: 'Meeting', participants: ['1', '2', '3'] },
  { id: 'live-evt2', title: 'Lunch with Android Team', date: formatLiveDate(liveToday), startTime: '12:30', endTime: '13:30', category: 'Team Event', participants: ['1', '6'] },
  { id: 'live-evt3', title: 'Dokumentation schreiben', date: formatLiveDate(liveToday), startTime: '14:00', endTime: '16:00', category: 'Personal', participants: ['1'] },
];

export const liveNotes: Note[] = [
    { id: 'live-n1', title: 'Google Keep: Product-Sync', content: '<p>Wichtige Punkte für das morgige Meeting:</p><ul><li>Wachstumsmetriken zeigen.</li><li>Erfolg von Projekt Gemini hervorheben.</li><li>Budget für die neue KI-Initiative vorschlagen.</li></ul>', date: '2024-07-21', tags: ['meeting', 'google'] },
    { id: 'live-n2', title: 'Google Keep: KI-Initiative Ideen', content: '<p>Wir könnten die neue <strong>Gmail API</strong> nutzen, um E-Mail-Zusammenfassungen zu automatisieren. Muss mit dem Backend-Team besprochen werden.</p>', date: '2024-07-20', tags: ['ai', 'gmail', 'planung'] },
];
    
// --- Google API Data Types ---

export interface GoogleEmail {
  id: string;
  snippet: string;
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
