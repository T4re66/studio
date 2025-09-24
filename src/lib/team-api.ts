
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, runTransaction, serverTimestamp, increment, query, where, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import type { User as FirebaseUser } from "firebase/auth";
import type { TeamMember, Tournament, Match, OfficeTask, ShopItem, FridgeItem, Note, Team, TeamMembership } from "./data";

// =================================
// TEAM & AUTH API
// =================================

// Helper to generate a random 6-digit code
const generateJoinCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function createTeam(teamName: string, user: FirebaseUser): Promise<string> {
    const teamColRef = collection(db, 'teams');
    const teamDocRef = doc(teamColRef); // Create a new document reference with a random ID
    const teamId = teamDocRef.id;

    const teamMemberDocRef = doc(db, 'teamMembers', `${teamId}_${user.uid}`);
    const joinCode = generateJoinCode();

    const batch = writeBatch(db);

    batch.set(teamDocRef, {
        name: teamName,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        joinCode: joinCode,
    });

    batch.set(teamMemberDocRef, {
        teamId: teamId,
        userId: user.uid,
        role: 'owner',
        joinedAt: serverTimestamp(),
    });

    await batch.commit();
    return teamId;
}

export async function joinTeamWithCode(joinCode: string, user: FirebaseUser): Promise<string | null> {
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, where("joinCode", "==", joinCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error("Ungültiger Beitritts-Code.");
    }

    const teamDoc = querySnapshot.docs[0];
    const teamId = teamDoc.id;

    const teamMemberDocRef = doc(db, 'teamMembers', `${teamId}_${user.uid}`);
    const docSnap = await getDoc(teamMemberDocRef);

    if (docSnap.exists()) {
        // User is already a member
        return teamId;
    }

    await setDoc(teamMemberDocRef, {
        teamId: teamId,
        userId: user.uid,
        role: 'member',
        joinedAt: serverTimestamp(),
    });

    return teamId;
}


export async function getTeamForUser(userId: string): Promise<{ team: Team, membership: TeamMembership } | null> {
    const teamMembersRef = collection(db, "teamMembers");
    const q = query(teamMembersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    // Assume user is part of one team for now
    const membershipDoc = querySnapshot.docs[0];
    const membershipData = { id: membershipDoc.id, ...membershipDoc.data() } as TeamMembership;
    const teamId = membershipData.teamId;

    const teamDocRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamDocRef);

    if (!teamDoc.exists()) {
        return null;
    }

    const teamData = { id: teamDoc.id, ...teamDoc.data() } as Team;

    return { team: teamData, membership: membershipData };
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
    if (!teamId) return [];
    try {
        const teamMembersRef = collection(db, "teamMembers");
        const q = query(teamMembersRef, where("teamId", "==", teamId));
        const membershipSnapshot = await getDocs(q);
        
        if (membershipSnapshot.empty) return [];

        const userIds = membershipSnapshot.docs.map(doc => doc.data().userId);
        
        const usersRef = collection(db, "users");
        const usersQuery = query(usersRef, where('id', 'in', userIds));
        const usersSnapshot = await getDocs(usersQuery);

        return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));

    } catch (error) {
        console.error("Error fetching team members from Firestore:", error);
        throw new Error("Teammitglieder konnten nicht geladen werden.");
    }
}

export async function getTeamMember(userId: string): Promise<TeamMember | null> {
    try {
        const memberDocRef = doc(db, `users`, userId);
        const docSnap = await getDoc(memberDocRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as TeamMember;
        }
        return null;
    } catch (error) {
         console.error("Error fetching team member from Firestore:", error);
        throw new Error("Teammitglied konnte nicht geladen werden.");
    }
}

export async function createTeamMember(user: FirebaseUser): Promise<void> {
    try {
        const memberDocRef = doc(db, `users`, user.uid);
        const docSnap = await getDoc(memberDocRef);

        if (!docSnap.exists()) {
             await setDoc(memberDocRef, {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                status: 'remote',
                role: 'Team Member',
                department: 'Allgemein',
                dnd: false,
                points: 0,
                birthday: '',
                seat: null,
                mood: 3,
            });
        }
    } catch (error) {
        console.error("Error creating team member in Firestore:", error);
        throw new Error("Teammitglied konnte nicht erstellt werden.");
    }
}

export async function updateUserCheckin(userId: string, teamId: string, checkinData: {status: TeamMember['status'], mood: number, seat: string | null}): Promise<void> {
    try {
        const memberDocRef = doc(db, `users`, userId);
        await updateDoc(memberDocRef, {
            status: checkinData.status,
            mood: checkinData.mood,
            seat: checkinData.seat,
        });
    } catch (error) {
        console.error("Error updating check-in in Firestore:", error);
        throw new Error("Check-in konnte nicht gespeichert werden.");
    }
}

export async function updateTeamMemberBirthday(userId: string, birthday: string): Promise<void> {
    try {
        const memberDocRef = doc(db, `users`, userId);
        await updateDoc(memberDocRef, { birthday });
    } catch (error) {
        console.error("Error updating birthday in Firestore:", error);
        throw new Error("Geburtstag konnte nicht aktualisiert werden.");
    }
}

export async function updateMyBreakTimes(userId: string, lunchTime: string, coffeeTime: string): Promise<void> {
    try {
        const memberDocRef = doc(db, `users`, userId);
        await updateDoc(memberDocRef, { lunchTime, coffeeTime });
    } catch (error) {
        console.error("Error updating break times in Firestore:", error);
        throw new Error("Pausenzeiten konnten nicht aktualisiert werden.");
    }
}


// =================================
// GAMIFICATION API (Tasks, Shop)
// =================================

export async function getTasks(teamId: string): Promise<OfficeTask[]> {
    if (!teamId) return [];
    try {
        const tasksCollectionRef = collection(db, 'teams', teamId, 'tasks');
        const q = query(tasksCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OfficeTask));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error("Aufgaben konnten nicht geladen werden.");
    }
}

export async function addTask(teamId: string, task: Omit<OfficeTask, 'id' | 'isCompleted'>): Promise<void> {
    if (!teamId) return;
    try {
        const tasksCollectionRef = collection(db, 'teams', teamId, 'tasks');
        await addDoc(tasksCollectionRef, {
            ...task,
            isCompleted: false,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding task:", error);
        throw new Error("Aufgabe konnte nicht hinzugefügt werden.");
    }
}

export async function completeTask(teamId: string, taskId: string, userId: string): Promise<void> {
    if (!teamId) return;
    const taskDocRef = doc(db, 'teams', teamId, 'tasks', taskId);
    const memberDocRef = doc(db, `users`, userId);

    await runTransaction(db, async (transaction) => {
        const taskDoc = await transaction.get(taskDocRef);
        if (!taskDoc.exists()) throw new Error("Aufgabe nicht gefunden.");
        if (taskDoc.data().isCompleted) throw new Error("Diese Aufgabe wurde bereits erledigt.");
        
        const points = taskDoc.data().points;
        transaction.update(taskDocRef, { isCompleted: true, completedBy: userId, completedAt: serverTimestamp() });
        transaction.update(memberDocRef, { points: increment(points) });
    });
}

export async function getShopItems(teamId: string): Promise<ShopItem[]> {
    if (!teamId) return [];
     try {
        const shopItemsRef = collection(db, 'teams', teamId, 'shop_items');
        const q = query(shopItemsRef, orderBy('cost', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShopItem));
    } catch (error) {
        console.error("Error fetching shop items:", error);
        throw new Error("Shop-Angebote konnten nicht geladen werden.");
    }
}

export async function addShopItem(teamId: string, item: Omit<ShopItem, 'id'>): Promise<void> {
    if (!teamId) return;
    try {
        const shopItemsRef = collection(db, 'teams', teamId, 'shop_items');
        await addDoc(shopItemsRef, {
            ...item,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding shop item:", error);
        throw new Error("Shop-Artikel konnte nicht hinzugefügt werden.");
    }
}

export async function purchaseShopItem(userId: string, teamId: string, item: ShopItem): Promise<void> {
    const memberDocRef = doc(db, `users`, userId);

    await runTransaction(db, async (transaction) => {
        const memberDoc = await transaction.get(memberDocRef);
        if (!memberDoc.exists()) throw new Error("Benutzer nicht gefunden.");

        const currentPoints = memberDoc.data().points || 0;
        if (currentPoints < item.cost) throw new Error("Nicht genügend Punkte für diesen Artikel.");

        transaction.update(memberDocRef, { points: increment(-item.cost) });

        const purchaseLogRef = collection(db, `teams/${teamId}/purchase_logs`);
        transaction.set(doc(purchaseLogRef), {
            userId,
            itemId: item.id,
            itemTitle: item.title,
            cost: item.cost,
            purchasedAt: serverTimestamp()
        });
    });
}

// =================================
// OFFICE API (Fridge, Tournaments)
// =================================

export async function getFridgeItems(teamId: string): Promise<FridgeItem[]> {
    if (!teamId) return [];
    try {
        const itemsRef = collection(db, 'teams', teamId, 'fridge_items');
        const q = query(itemsRef, orderBy('expiryDate', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FridgeItem));
    } catch (error) {
        console.error("Error fetching fridge items:", error);
        throw new Error("Kühlschrank-Inhalt konnte nicht geladen werden.");
    }
}

export async function addFridgeItem(teamId: string, item: Omit<FridgeItem, 'id'>): Promise<void> {
    if (!teamId) return;
    try {
        const itemsRef = collection(db, 'teams', teamId, 'fridge_items');
        await addDoc(itemsRef, {
            ...item,
            addedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding fridge item:", error);
        throw new Error("Artikel konnte nicht zum Kühlschrank hinzugefügt werden.");
    }
}


export async function getTournaments(teamId: string): Promise<Tournament[]> {
    if (!teamId) return [];
    try {
        const tournamentsCollectionRef = collection(db, 'teams', teamId, 'tournaments');
        const q = query(tournamentsCollectionRef, orderBy('completed'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Tournament));
    } catch (error) {
        console.error("Error fetching tournaments from Firestore:", error);
        return [];
    }
}

export async function updateTournamentMatch(teamId: string, tournamentId: string, roundIndex: number, matchIndex: number, updatedMatch: Match): Promise<void> {
    if (!teamId) return;
    try {
        const tournamentDocRef = doc(db, 'teams', teamId, 'tournaments', tournamentId);
        const tournamentDoc = await getDoc(tournamentDocRef);

        if (!tournamentDoc.exists()) throw new Error("Turnier nicht gefunden");

        const tournamentData = tournamentDoc.data() as Tournament;
        const newRounds = [...tournamentData.rounds];
        newRounds[roundIndex].matches[matchIndex] = updatedMatch;

        await updateDoc(tournamentDocRef, { rounds: newRounds });

    } catch (error) {
        console.error("Error updating match in Firestore:", error);
        throw new Error("Match konnte nicht aktualisiert werden.");
    }
}

// =================================
// NOTES API
// =================================

export async function getNotes(userId: string): Promise<Note[]> {
    try {
        const notesRef = collection(db, `users/${userId}/notes`);
        const q = query(notesRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
    } catch (error) {
        console.error("Error fetching notes:", error);
        return [];
    }
}

export async function addNote(userId: string, note: Omit<Note, 'id' | 'userId' | 'date'>): Promise<void> {
    try {
        const notesRef = collection(db, `users/${userId}/notes`);
        await addDoc(notesRef, {
            ...note,
            userId,
            date: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error adding note:", error);
        throw new Error("Notiz konnte nicht gespeichert werden.");
    }
}
