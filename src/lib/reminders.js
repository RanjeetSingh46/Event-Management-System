import { db } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { sendNotification } from './notifications';

export const scheduleReminder = async (eventId, userId, reminderTime) => {
    try {
        await addDoc(collection(db, 'reminders'), {
            eventId,
            userId,
            reminderTime: reminderTime.toISOString(), // Store as an ISO string
            sent: false,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error scheduling reminder:', error);
    }
};

export const sendReminders = async () => {
    try {
        const now = new Date();
        const remindersRef = collection(db, 'reminders');
        const q = query(
            remindersRef,
            where('reminderTime', '<=', now.toISOString()), // Compare ISO string
            where('sent', '==', false)
        );

        const remindersSnapshot = await getDocs(q);

        remindersSnapshot.forEach(async (doc) => {
            const reminder = doc.data();
            const eventDoc = await db.collection('events').doc(reminder.eventId).get();
            const event = eventDoc.data();

            if (event) {
                await sendNotification(reminder.userId, `Reminder: "${event.title}" is starting soon!`, 'email');
                await doc.ref.update({ sent: true });
            } else {
                console.warn(`Event with ID ${reminder.eventId} not found.`);
            }
        });
    } catch (error) {
        console.error('Error sending reminders:', error);
    }
};
