import { db } from "@/src/lib/firebase";
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const eventsSnapshot = await getDocs(collection(db, 'events'));
                const events = eventsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date.toDate().toISOString() // Convert Timestamp to ISO string
                }));
                res.status(200).json({ success: true, events });
            } catch (error) {
                console.error('Error fetching events:', error);
                res.status(500).json({ success: false, error: 'Failed to fetch events.' });
            }
            break;

        case 'POST':
            try {
                const { title, description, date, location } = req.body;
                if (!title || !description || !date || !location) {
                    return res.status(400).json({ success: false, error: 'Title, description, date, and location are required.' });
                }

                const docRef = await addDoc(collection(db, 'events'), {
                    title,
                    description,
                    date: Timestamp.fromDate(new Date(date)),
                    location,
                    createdAt: Timestamp.now(),
                    attendees: []
                });

                res.status(201).json({ success: true, id: docRef.id });
            } catch (error) {
                console.error('Error adding event:', error);
                res.status(500).json({ success: false, error: 'Failed to add event.' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }
}