import { db } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const logActivity = async (userId, description) => {
    if (!userId || !description) {
        console.error('Invalid input: userId and description are required');
        return;
    }
    try {
        await addDoc(collection(db, 'activities'), {
            userId,
            description,
            timestamp: serverTimestamp(),
        });
        console.log('Activity logged successfully');
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};
