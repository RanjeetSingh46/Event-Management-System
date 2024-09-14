import { Box, Heading, VStack } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth, db} from "@/src/lib/firebase";
import {useRealTimeEvents} from "@/src/hooks/useRealTimeEvents";
import EventSearch from "@/src/components/EventSearch";
import EventForm from "@/src/components/EventForm";
import EventList from "@/src/components/EventList";
import NotificationList from "@/src/components/NotificationList";
import {collection, getDocs, query, where} from "firebase/firestore";
import {useState} from "react";
import AnalyticsDashboard from "@/src/pages/analytics";
import Profile from "@/src/pages/profile";
import ReminderForm from "@/src/components/ReminderForm";
import AttendeeManagement from "@/src/components/AttendeeManagement";


export default function Home() {
    const [user] = useAuthState(auth);
    // const events = useRealTimeEvents();
    const [events, setEvents] = useState([]);

    const handleSearch = async (searchParams) => {
        const { searchTerm, dateRange } = searchParams;
        let q = query(collection(db, 'events'));

        if (searchTerm) {
            q = query(q, where('title', '>=', searchTerm), where('title', '<=', searchTerm + '\uf8ff'));
        }

        if (dateRange !== 'all') {
            const now = new Date();
            let endDate;
            switch (dateRange) {
                case 'today':
                    endDate = new Date(now.setHours(23, 59, 59, 999));
                    break;
                case 'week':
                    endDate = new Date(now.setDate(now.getDate() + 7));
                    break;
                case 'month':
                    endDate = new Date(now.setMonth(now.getMonth() + 1));
                    break;
            }
            q = query(q, where('date', '>=', now), where('date', '<=', endDate));
        }

        const querySnapshot = await getDocs(q);
        setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    return (
        <Box p={8}>
            <VStack spacing={8} align="stretch">
                <Heading >Event Management System</Heading>
                {user && <NotificationList userId={user.uid} />}
                <EventSearch onSearch={handleSearch} />
                <EventList events={events} />
                <EventForm />
                <AnalyticsDashboard/>
                <ReminderForm/>
                <AttendeeManagement/>
                <Profile/>

            </VStack>


        </Box>
    );
}



