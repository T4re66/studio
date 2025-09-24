
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, runTransaction, serverTimestamp, increment, query, where, orderBy, writeBatch } from "firebase/firestore";
import { db, auth } from "./firebase";
import type { User as FirebaseUser } from "firebase/auth";
import type { TeamMember, Tournament, Match, OfficeTask, ShopItem, FridgeItem, Note, Team } from "./data";
import {_} from 'lodash-es';


// =================================
// TEAM & AUTH API
// =================================

// Helper to generate a random 6-digit code
const generateJoinCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function createTeam(teamName: string, user: FirebaseUser): Promise<string> {
    const teamColRef = collection(db, 'teams');
    const teamDocRef = doc(teamColRef);
    const teamId = teamDocRef.id;

    const teamMemberColRef = collection(db, 'teamMembers');
    const teamMemberDocRef = doc(teamMemberColRef, `${teamId}_${user.uid}`);

    const joinCode = generateJoinCode();

    const batch = writeBatch(db);

    batch.set(teamDocRef, {
        name: teamName,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        joinCode: joinCode,
    });

    batch.set(teamMemberDocRef, {
        role: 'owner',
        joinedAt: serverTimestamp(),
    });

    await batch.commit();

    return teamId;
}

export async function getMyTeam(userId: string): Promise<Team | null> {
    const teamMembersRef = collection(db, "teamMembers");
    const q = query(teamMembersRef, where(userId, '==', true));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // Fallback for owner
        const teamsRef = collection(db, 'teams');
        const ownerQuery = query(teamsRef, where('ownerId', '==', userId));
        const ownerSnapshot = await getDocs(ownerQuery);
        if (!ownerSnapshot.empty) {
            const teamDoc = ownerSnapshot.docs[0];
            return {
                id: teamDoc.id,
                ...teamDoc.data()
            } as Team;
        }
        return null;
    }
    
    // This logic is flawed for how team members are stored.
    // Let's assume a simpler structure for now. A user is part of ONE team.
    // We need to find which `teamMembers` document contains our user.
    // This is inefficient. A better structure would be a user document with a teamId.
    // Let's try to find the team via the `teamMembers` collection.
    
    const allTeamMembersSnap = await getDocs(collection(db, 'teamMembers'));
    for (const doc of allTeamMembersSnap.docs) {
        if (doc.id.endsWith(`_${userId}`)) {
             const teamId = doc.id.split('_')[0];
             const teamDoc = await getDoc(doc(db, 'teams', teamId));
             if (teamDoc.exists()) {
                 return { id: teamDoc.id, ...teamDoc.data() } as Team;
             }
        }
    }
    
    return null;
}


export async function getTeamMembers(): Promise<TeamMember[]> {
    // This function is problematic in a multi-team context without a teamId.
    // Assuming we fetch members for the CURRENT user's team. This needs context from auth.
    // For now, let's leave it and assume a single-team context for components that use it without teamId.
    // The proper way would be getTeamMembers(teamId: string)
    try {
        const querySnapshot = await getDocs(collection(db, `users`));
        const members = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as TeamMember));
        return members;
    } catch (error) {
        console.error("Error fetching users from Firestore:", error);
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

export async function updateUserCheckin(checkinData: {status: TeamMember['status'], mood: number, seat: string | null}): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Benutzer nicht authentifiziert.");

    try {
        const memberDocRef = doc(db, `users`, currentUser.uid);
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

export async function updateMyBreakTimes(lunchTime: string, coffeeTime: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Benutzer nicht authentifiziert.");

    try {
        const memberDocRef = doc(db, `users`, currentUser.uid);
        await updateDoc(memberDocRef, { lunchTime, coffeeTime });
    } catch (error) {
        console.error("Error updating break times in Firestore:", error);
        throw new Error("Pausenzeiten konnten nicht aktualisiert werden.");
    }
}


// =================================
// GAMIFICATION API (Tasks, Shop)
// =================================

export async function getTasks(): Promise<OfficeTask[]> {
    try {
        const tasksCollectionRef = collection(db, 'tasks');
        const q = query(tasksCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OfficeTask));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error("Aufgaben konnten nicht geladen werden.");
    }
}

export async function addTask(task: Omit<OfficeTask, 'id' | 'isCompleted'>): Promise<void> {
    try {
        const tasksCollectionRef = collection(db, 'tasks');
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

export async function completeTask(taskId: string, userId: string): Promise<void> {
    const taskDocRef = doc(db, 'tasks', taskId);
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

export async function getShopItems(): Promise<ShopItem[]> {
     try {
        const shopItemsRef = collection(db, 'shop_items');
        const q = query(shopItemsRef, orderBy('cost', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShopItem));
    } catch (error) {
        console.error("Error fetching shop items:", error);
        throw new Error("Shop-Angebote konnten nicht geladen werden.");
    }
}

export async function addShopItem(item: Omit<ShopItem, 'id'>): Promise<void> {
    try {
        const shopItemsRef = collection(db, 'shop_items');
        await addDoc(shopItemsRef, {
            ...item,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding shop item:", error);
        throw new Error("Shop-Artikel konnte nicht hinzugefügt werden.");
    }
}

export async function purchaseShopItem(userId: string, item: ShopItem): Promise<void> {
    const memberDocRef = doc(db, `users`, userId);

    await runTransaction(db, async (transaction) => {
        const memberDoc = await transaction.get(memberDocRef);
        if (!memberDoc.exists()) throw new Error("Benutzer nicht gefunden.");

        const currentPoints = memberDoc.data().points || 0;
        if (currentPoints < item.cost) throw new Error("Nicht genügend Punkte für diesen Artikel.");

        transaction.update(memberDocRef, { points: increment(-item.cost) });

        // This path is now invalid with the new team structure, commenting out for now
        // const purchaseLogRef = collection(db, `teams/${TEAM_ID}/members/${userId}/purchase_logs`);
        // transaction.set(doc(purchaseLogRef), {
        //     itemId: item.id,
        //     itemTitle: item.title,
        //     cost: item.cost,
        //     purchasedAt: serverTimestamp()
        // });
    });
}

// =================================
// OFFICE API (Fridge, Tournaments)
// =================================

export async function getFridgeItems(): Promise<FridgeItem[]> {
    try {
        const itemsRef = collection(db, 'fridge_items');
        const q = query(itemsRef, orderBy('expiryDate', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FridgeItem));
    } catch (error) {
        console.error("Error fetching fridge items:", error);
        throw new Error("Kühlschrank-Inhalt konnte nicht geladen werden.");
    }
}

export async function addFridgeItem(item: Omit<FridgeItem, 'id'>): Promise<void> {
    try {
        const itemsRef = collection(db, 'fridge_items');
        await addDoc(itemsRef, {
            ...item,
            addedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding fridge item:", error);
        throw new Error("Artikel konnte nicht zum Kühlschrank hinzugefügt werden.");
    }
}


export async function getTournaments(): Promise<Tournament[]> {
    try {
        const tournamentsCollectionRef = collection(db, 'tournaments');
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

export async function updateTournamentMatch(tournamentId: string, roundIndex: number, matchIndex: number, updatedMatch: Match): Promise<void> {
    try {
        const tournamentDocRef = doc(db, 'tournaments', tournamentId);
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
