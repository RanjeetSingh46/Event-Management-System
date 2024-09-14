
import { db } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const sendNotification = async (userId, message, type = 'in-app') => {
    try {

        await addDoc(collection(db, 'notifications'), {
            userId,
            message,
            type,
            createdAt: serverTimestamp(),
            read: false,
        });

        if (type === 'email') {
            console.log(`Sending email to user ${userId}: ${message}`);
        }
    } catch (error) {
        console.error('Error sending notification:', error);
        throw new Error('Failed to send notification');
    }
};
