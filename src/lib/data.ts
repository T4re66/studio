
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
  date: string; // YYYY-MM-DD
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
  notes?: string;
};


export const teamMembers: User[] = [
  { id: '1', name: 'Tarec', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false, points: 1250, birthday: '1990-07-15' },
  { id: '2', name: 'Bob Williams', avatar: 'https://picsum.photos/seed/user2/200/200', status: 'remote', role: 'Backend Developer', department: 'Engineering', lastSeen: '2h ago', dnd: true, points: 800, birthday: '1988-11-22' },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', lastSeen: '5m ago', dnd: false, points: 1500, birthday: '1995-03-30' },
  { id: '4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/user4/200/200', status: 'office', role: 'Product Manager', department: 'Product', lastSeen: '15m ago', dnd: false, points: 1100, birthday: '1992-09-05' },
  { id: '5', name: 'Ethan Davis', avatar: 'https://picsum.photos/seed/user5/200/200', status: 'away', role: 'QA Engineer', department: 'Engineering', lastSeen: 'yesterday', dnd: false, points: 600, birthday: '1993-12-10' },
  { id: '6', name: 'Fiona Garcia', avatar: 'https://picsum.photos/seed/user6/200/200', status: 'remote', role: 'Marketing Specialist', department: 'Marketing', lastSeen: '30m ago', dnd: false, points: 950, birthday: '1991-06-18' },
  { id: '7', name: 'George Clark', avatar: 'https://picsum.photos/seed/user7/200/200', status: 'office', role: 'DevOps Engineer', department: 'Engineering', lastSeen: 'now', dnd: true, points: 1300, birthday: '1989-08-25' },
  { id: '8', name: 'Hannah Lewis', avatar: 'https://picsum.photos/seed/user8/200/200', status: 'office', role: 'Data Scientist', department: 'Data', lastSeen: '1h ago', dnd: false, points: 1400, birthday: '1994-01-20' },
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
    { id: 'g1', subject: 'Mathematik', grade: 1.3, date: '2024-03-10', type: 'Klausur', notes: 'Analysis' },
    { id: 'g2', subject: 'Mathematik', grade: 2.0, date: '2024-04-22', type: 'Mündlich', notes: 'Lineare Algebra' },
    { id: 'g3', subject: 'Deutsch', grade: 2.3, date: '2024-03-15', type: 'Klausur', notes: 'Gedichtanalyse' },
    { id: 'g4', subject: 'Englisch', grade: 1.7, date: '2024-03-20', type: 'Klausur', notes: 'Vokabeltest' },
    { id: 'g5', subject: 'Englisch', grade: 1.0, date: '2024-04-28', type: 'Projekt', notes: 'Präsentation über Shakespeare' },
    { id: 'g6', subject: 'Physik', grade: 3.0, date: '2024-02-25', type: 'Klausur', notes: 'Mechanik' },
    { id: 'g7', subject: 'Physik', grade: 2.3, date: '2024-05-30', type: 'Mündlich', notes: 'Thermodynamik' },
    { id: 'g8', subject: 'Chemie', grade: 1.0, date: '2024-03-12', type: 'Klausur', notes: 'Organische Chemie' },
    { id: 'g9', subject: 'Deutsch', grade: 1.7, date: '2024-05-02', type: 'Mündlich', notes: 'Diskussion' },
    { id: 'g10', subject: 'Mathematik', grade: 1.0, date: '2024-05-18', type: 'Klausur', notes: 'Stochastik' },
    { id: 'g11', subject: 'Biologie', grade: 2.7, date: '2024-03-05', type: 'Klausur', notes: 'Genetik' },
    { id: 'g12', subject: 'Biologie', grade: 2.0, date: '2024-04-15', type: 'Projekt', notes: 'Ökosystem-Modell' },
    { id: 'g13', subject: 'Geschichte', grade: 1.7, date: '2024-02-10', type: 'Klausur', notes: 'Französische Revolution' },
    { id: 'g14', subject: 'Geschichte', grade: 2.3, date: '2024-04-05', type: 'Mündlich', notes: 'Weimarer Republik' },
    { id: 'g15', subject: 'Kunst', grade: 1.0, date: '2024-05-20', type: 'Projekt', notes: 'Porträtmalerei' },
    { id: 'g16', subject: 'Sport', grade: 1.3, date: '2024-06-01', type: 'Mündlich', notes: 'Leichtathletik-Bewertung' },
    { id: 'g17', subject: 'Informatik', grade: 1.7, date: '2024-03-25', type: 'Klausur', notes: 'Datenbanken' },
    { id: 'g18', subject: 'Informatik', grade: 1.0, date: '2024-05-15', type: 'Projekt', notes: 'Web-Anwendung' },
    { id: 'g19', subject: 'Mathematik', grade: 2.7, date: '2024-06-05', type: 'Klausur', notes: 'Geometrie' },
    { id: 'g20', subject: 'Deutsch', grade: 3.0, date: '2024-06-10', type: 'Klausur', notes: 'Epochenvergleich' },
    { id: 'g21', subject: 'Englisch', grade: 2.3, date: '2024-06-12', type: 'Mündlich', notes: 'Debatte' },
    { id: 'g22', subject: 'Physik', grade: 2.0, date: '2024-06-15', type: 'Klausur', notes: 'Optik' },
    { id: 'g23', subject: 'Chemie', grade: 1.7, date: '2024-06-18', type: 'Mündlich', notes: 'Periodensystem' },
    { id: 'g24', subject: 'Biologie', grade: 1.3, date: '2024-06-20', type: 'Klausur', notes: 'Evolution' },
    { id: 'g25', subject: 'Geschichte', grade: 2.0, date: '2024-06-22', type: 'Projekt', notes: 'Kalter Krieg' },
    { id: 'g26', subject: 'Latein', grade: 3.3, date: '2024-03-18', type: 'Klausur', notes: 'Übersetzung Cäsar' },
    { id: 'g27', subject: 'Latein', grade: 2.7, date: '2024-05-22', type: 'Mündlich', notes: 'Vokabeltest' },
    { id: 'g28', subject: 'Ethik', grade: 1.0, date: '2024-06-11', type: 'Mündlich', notes: 'Diskussion über Kant' },
    { id: 'g29', subject: 'Musik', grade: 2.0, date: '2024-04-30', type: 'Projekt', notes: 'Komposition' },
    { id: 'g30', subject: 'Geographie', grade: 2.3, date: '2024-05-14', type: 'Klausur', notes: 'Klimazonen' },
];

