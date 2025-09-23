
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, writeBatch } from "firebase/firestore";
import { db, auth } from "./firebase";
import type { TeamMember, Tournament, Match } from "./data";

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
        // In a real app, you might want to show a toast or a specific error message.
        return [];
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
