
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {db} from "@/src/lib/firebase";

export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    switch (method) {
        case 'GET':
            try {
                const docRef = doc(db, 'events', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    res.status(200).json({ success: true, id: docSnap.id, ...docSnap.data() });
                } else {
                    res.status(404).json({ success: false, message: 'Event not found' });
                }
            } catch (error) {
                console.error('Error fetching event:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch event' });
            }
            break;

        case 'PUT':
            try {
                const docRef = doc(db, 'events', id);
                await updateDoc(docRef, req.body);
                res.status(200).json({ success: true, message: 'Event updated successfully' });
            } catch (error) {
                console.error('Error updating event:', error);
                res.status(400).json({ success: false, message: error.message });
            }
            break;

        case 'DELETE':
            try {
                await deleteDoc(doc(db, 'events', id));
                res.status(200).json({ success: true, message: 'Event deleted successfully' });
            } catch (error) {
                console.error('Error deleting event:', error);
                res.status(400).json({ success: false, message: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }
}
