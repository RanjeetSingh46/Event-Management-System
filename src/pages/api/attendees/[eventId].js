import { db } from "@/src/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default async function handler(req, res) {
    const {
        query: { eventId },
        method,
    } = req;

    switch (method) {
        case 'GET':
            try {
                const eventDoc = await getDoc(doc(db, 'events', eventId));
                if (eventDoc.exists()) {
                    const attendees = eventDoc.data().attendees || [];
                    res.status(200).json({ success: true, attendees });
                } else {
                    res.status(404).json({ success: false, message: 'Event not found' });
                }
            } catch (error) {
                console.error('Error fetching attendees:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch attendees' });
            }
            break;

        case 'POST':
            try {
                const { userId, name, status } = req.body;
                if (!userId || !name || !status) {
                    return res.status(400).json({ success: false, message: 'User ID, name, and status are required' });
                }

                const eventRef = doc(db, 'events', eventId);
                const attendee = { userId, name, status };

                await updateDoc(eventRef, {
                    attendees: arrayUnion(attendee),
                });

                res.status(201).json({ success: true, message: 'RSVP added successfully' });
            } catch (error) {
                console.error('Error adding RSVP:', error);
                res.status(500).json({ success: false, message: 'Failed to add RSVP' });
            }
            break;

        case 'DELETE':
            try {
                const { userId } = req.body;
                if (!userId) {
                    return res.status(400).json({ success: false, message: 'User ID is required' });
                }

                const eventRef = doc(db, 'events', eventId);
                const existingAttendee = { userId };

                await updateDoc(eventRef, {
                    attendees: arrayRemove(existingAttendee),
                });

                res.status(200).json({ success: true, message: 'RSVP removed successfully' });
            } catch (error) {
                console.error('Error removing RSVP:', error);
                res.status(500).json({ success: false, message: 'Failed to remove RSVP' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }
}
