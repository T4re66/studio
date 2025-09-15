export type User = {
  id: string;
  name: string;
  avatar: string;
  status: 'office' | 'remote' | 'away';
  role: string;
  department: string;
  lastSeen: string;
  dnd: boolean;
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

export const teamMembers: User[] = [
  { id: '1', name: 'Alice Johnson', avatar: 'https://picsum.photos/seed/user1/200/200', status: 'office', role: 'Frontend Developer', department: 'Engineering', lastSeen: 'now', dnd: false },
  { id: '2', name: 'Bob Williams', avatar: 'https://picsum.photos/seed/user2/200/200', status: 'remote', role: 'Backend Developer', department: 'Engineering', lastSeen: '2h ago', dnd: true },
  { id: '3', name: 'Charlie Brown', avatar: 'https://picsum.photos/seed/user3/200/200', status: 'office', role: 'UI/UX Designer', department: 'Design', lastSeen: '5m ago', dnd: false },
  { id: '4', name: 'Diana Miller', avatar: 'https://picsum.photos/seed/user4/200/200', status: 'office', role: 'Product Manager', department: 'Product', lastSeen: '15m ago', dnd: false },
  { id: '5', name: 'Ethan Davis', avatar: 'https://picsum.photos/seed/user5/200/200', status: 'away', role: 'QA Engineer', department: 'Engineering', lastSeen: 'yesterday', dnd: false },
  { id: '6', name: 'Fiona Garcia', avatar: 'https://picsum.photos/seed/user6/200/200', status: 'remote', role: 'Marketing Specialist', department: 'Marketing', lastSeen: '30m ago', dnd: false },
  { id: '7', name: 'George Clark', avatar: 'https://picsum.photos/seed/user7/200/200', status: 'office', role: 'DevOps Engineer', department: 'Engineering', lastSeen: 'now', dnd: true },
  { id: '8', name: 'Hannah Lewis', avatar: 'https://picsum.photos/seed/user8/200/200', status: 'office', role: 'Data Scientist', department: 'Data', lastSeen: '1h ago', dnd: false },
];

export const fridgeItems: FridgeItem[] = [
  { id: 'f1', name: 'Milch', owner: 'Alice Johnson', ownerId: '1', image: 'https://picsum.photos/seed/milk/400/300', shelf: 'A2', expiryDays: 2 },
  { id: 'f2', name: 'Joghurt', owner: 'Charlie Brown', ownerId: '3', image: 'https://picsum.photos/seed/yogurt/400/300', shelf: 'C1', expiryDays: 1 },
  { id: 'f3', name: 'Sandwich', owner: 'Alice Johnson', ownerId: '1', image: 'https://picsum.photos/seed/sandwich/400/300', shelf: 'B3', expiryDays: 0 },
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
