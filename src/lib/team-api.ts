
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { TeamMember } from "./data";

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
