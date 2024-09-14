
import { useState, useEffect } from 'react';
import { db } from "@/src/lib/firebase";
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

export const useRealTimeEvents = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {

        const eventsQuery = query(collection(db, 'events'), orderBy('date'));
        const unsubscribe = onSnapshot(eventsQuery, (querySnapshot) => {

            const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventsData);
        }, (error) => {
            console.error("Error fetching events: ", error);
        });

        return () => unsubscribe();
    }, []);

    return events;
};
