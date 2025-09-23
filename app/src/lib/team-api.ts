
import { collection, getDocs, doc, getDoc, updateDoc, writeBatch, addDoc, runTransaction, serverTimestamp, increment } from "firebase/firestore";
import { db, auth } from "./firebase";
import type { TeamMember, Tournament, Match, OfficeTask, ShopItem } from "./data";

// For now, we assume a single team. In a multi-team app, this would be dynamic.
const TEAM_ID = "main_team"; 

export async function getTeamMembers(): Promise<TeamMember[]> {
    try {
        const membersCollectionRef = collection(db, `teams/${TEAM_ID}/members`);
        const querySnapshot = await getDocs(membersCollectionRef);
        
        if (querySnapshot.empty) {
            console.log("No team members found in Firestore.");
            return [];
        }
        
        const members = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as TeamMember));
        
        return members;

    } catch (error) {
        console.error("Error fetching team members from Firestore:", error);
        return [];
    }
}

export async function getTeamMember(userId: string): Promise<TeamMember | null> {
    try {
        const memberDocRef = doc(db, `teams/${TEAM_ID}/members`, userId);
        const docSnap = await getDoc(memberDocRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as TeamMember;
        }
        return null;
    } catch (error) {
         console.error("Error fetching team member from Firestore:", error);
        return null;
    }
}


export async function getTournaments(): Promise<Tournament[]> {
    try {
        const tournamentsCollectionRef = collection(db, 'tournaments');
        const querySnapshot = await getDocs(tournamentsCollectionRef);

        if (querySnapshot.empty) {
            console.log("No tournaments found in Firestore.");
            return [];
        }

        const tournaments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Tournament));
        
        return tournaments;

    } catch (error) {
        console.error("Error fetching tournaments from Firestore:", error);
        return [];
    }
}

export async function createTournament(tournament: Omit<Tournament, 'id' | 'completed' | 'winner'>): Promise<void> {
    try {
        const tournamentsCollectionRef = collection(db, 'tournaments');
        await addDoc(tournamentsCollectionRef, {
            ...tournament,
            completed: false,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error creating tournament:", error);
        throw new Error("Turnier konnte nicht erstellt werden.");
    }
}

export async function updateTournamentMatch(tournamentId: string, roundIndex: number, matchIndex: number, updatedMatch: Match): Promise<void> {
    try {
        const tournamentDocRef = doc(db, 'tournaments', tournamentId);
        const tournamentDoc = await getDoc(tournamentDocRef);

        if (!tournamentDoc.exists()) {
            throw new Error("Tournament not found");
        }

        const tournamentData = tournamentDoc.data() as Tournament;
        const newRounds = [...tournamentData.rounds];
        newRounds[roundIndex].matches[matchIndex] = updatedMatch;

        await updateDoc(tournamentDocRef, {
            rounds: newRounds
        });

    } catch (error) {
        console.error("Error updating match in Firestore:", error);
        throw new Error("Match konnte nicht aktualisiert werden.");
    }
}


export async function updateTeamMemberBirthday(userId: string, birthday: string): Promise<void> {
    try {
        const memberDocRef = doc(db, `teams/${TEAM_ID}/members`, userId);
        await updateDoc(memberDocRef, {
            birthday: birthday
        });
    } catch (error) {
        console.error("Error updating birthday in Firestore:", error);
        throw new Error("Geburtstag konnte nicht aktualisiert werden.");
    }
}

export async function updateMyBreakTimes(lunchTime: string, coffeeTime: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error("User not authenticated.");
    }

    try {
        const memberDocRef = doc(db, `teams/${TEAM_ID}/members`, currentUser.uid);
        await updateDoc(memberDocRef, {
            lunchTime,
            coffeeTime,
        });
    } catch (error) {
        console.error("Error updating break times in Firestore:", error);
        throw new Error("Pausenzeiten konnten nicht aktualisiert werden.");
    }
}


// --- Gamification API Functions ---

export async function getTasks(): Promise<OfficeTask[]> {
    try {
        const tasksCollectionRef = collection(db, 'tasks');
        const querySnapshot = await getDocs(tasksCollectionRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OfficeTask));
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
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
    const memberDocRef = doc(db, `teams/${TEAM_ID}/members`, userId);

    await runTransaction(db, async (transaction) => {
        const taskDoc = await transaction.get(taskDocRef);
        if (!taskDoc.exists()) {
            throw new Error("Aufgabe nicht gefunden.");
        }
        if (taskDoc.data().isCompleted) {
             throw new Error("Diese Aufgabe wurde bereits erledigt.");
        }
        
        const points = taskDoc.data().points;
        transaction.update(taskDocRef, { isCompleted: true, completedBy: userId, completedAt: serverTimestamp() });
        transaction.update(memberDocRef, { points: increment(points) });
    });
}

export async function getShopItems(): Promise<ShopItem[]> {
     try {
        const shopItemsRef = collection(db, 'shop_items');
        const querySnapshot = await getDocs(shopItemsRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShopItem));
    } catch (error) {
        console.error("Error fetching shop items:", error);
        return [];
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
    const memberDocRef = doc(db, `teams/${TEAM_ID}/members`, userId);

    await runTransaction(db, async (transaction) => {
        const memberDoc = await transaction.get(memberDocRef);
        if (!memberDoc.exists()) {
            throw new Error("Benutzer nicht gefunden.");
        }

        const currentPoints = memberDoc.data().points || 0;
        if (currentPoints < item.cost) {
            throw new Error("Nicht genügend Punkte für diesen Artikel.");
        }

        transaction.update(memberDocRef, { points: increment(-item.cost) });

        // Optional: Log the purchase
        const purchaseLogRef = collection(db, `users/${userId}/purchase_logs`);
        transaction.set(doc(purchaseLogRef), {
            itemId: item.id,
            itemTitle: item.title,
            cost: item.cost,
            purchasedAt: serverTimestamp()
        });
    });
}
