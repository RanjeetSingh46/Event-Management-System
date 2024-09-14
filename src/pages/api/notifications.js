import { db } from "@/src/lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { userId } = req.query;

                if (!userId) {
                    return res.status(400).json({ success: false, message: 'User ID is required' });
                }

                const q = query(
                    collection(db, 'notifications'),
                    where('userId', '==', userId),
                    orderBy('createdAt', 'desc')
                );

                const querySnapshot = await getDocs(q);
                const notifications = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                res.status(200).json({ success: true, notifications });
            } catch (error) {
                console.error('Error fetching notifications:', error);
                res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
            }
            break;

        case 'POST':
            try {
                const { userId, message } = req.body;

                if (!userId || !message) {
                    return res.status(400).json({ success: false, message: 'User ID and message are required' });
                }

                const notificationData = {
                    userId,
                    message,
                    createdAt: new Date(),
                };

                const docRef = await addDoc(collection(db, 'notifications'), notificationData);
                res.status(201).json({ success: true, id: docRef.id, message: 'Notification created successfully' });
            } catch (error) {
                console.error('Error creating notification:', error);
                res.status(500).json({ success: false, message: 'Failed to create notification' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }
}
