import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/react';

import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {db} from "@/src/lib/firebase";

const AnalyticsDashboard = () => {
    const [eventStats, setEventStats] = useState([]);
    const [userStats, setUserStats] = useState({ total: 0, active: 0 });
    const [topEvents, setTopEvents] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track error messages

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const eventsRef = collection(db, 'events');
                const eventsSnapshot = await getDocs(eventsRef);
                const eventsByCategory = eventsSnapshot.docs.reduce((acc, doc) => {
                    const { category } = doc.data();
                    acc[category] = (acc[category] || 0) + 1;
                    return acc;
                }, {});
                setEventStats(Object.entries(eventsByCategory).map(([name, value]) => ({ name, value })));

                const usersRef = collection(db, 'users');
                const usersSnapshot = await getDocs(usersRef);
                const totalUsers = usersSnapshot.size;
                const activeUsersSnapshot = await getDocs(query(usersRef, where('lastActive', '>=', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))));
                setUserStats({ total: totalUsers, active: activeUsersSnapshot.size });

                const topEventsQuery = query(eventsRef, orderBy('attendees', 'desc'), limit(5));
                const topEventsSnapshot = await getDocs(topEventsQuery);
                setTopEvents(topEventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                setError('Failed to fetch analytics data.');
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <Text>Loading analytics...</Text>;
    if (error) return <Text color="red.500">{error}</Text>;

    return (
        <Box p={5}>
            <Heading mb={5}>Analytics Dashboard</Heading>

            <SimpleGrid columns={2} spacing={10}>
                <Box>
                    <Heading size="md" mb={3}>Event Categories</Heading>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={eventStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                <Box>
                    <Heading size="md" mb={3}>User Statistics</Heading>
                    <Text>Total Users: {userStats.total}</Text>
                    <Text>Active Users (last 30 days): {userStats.active}</Text>
                </Box>
            </SimpleGrid>

            <Box mt={10}>
                <Heading size="md" mb={3}>Top 5 Events</Heading>
                {topEvents.map((event, index) => (
                    <Text key={event.id}>{index + 1}. {event.title} - {event.attendees.length} attendees</Text>
                ))}
            </Box>
        </Box>
    );
};

export default AnalyticsDashboard;
