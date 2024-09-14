import React, { useEffect, useState } from 'react';
import { db, auth } from "@/src/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [user, loading] = useAuthState(auth); // Manage loading state

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user) {
                try {
                    const q = query(
                        collection(db, 'notifications'),
                        where('userId', '==', user.uid),
                        orderBy('createdAt', 'desc'),
                        limit(10) // Limit the number of notifications fetched
                    );

                    const querySnapshot = await getDocs(q);
                    const notificationsData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setNotifications(notificationsData);
                } catch (error) {
                    console.error('Error fetching notifications: ', error);
                }
            }
        };

        if (!loading && user) {
            fetchNotifications();
        }
    }, [user, loading]);

    return (
        <VStack spacing={4} align="stretch">
            <Heading size="md">Notifications</Heading>
            {notifications.length === 0 ? (
                <Text>No notifications available.</Text>
            ) : (
                notifications.map(notification => (
                    <Box key={notification.id} p={2} borderWidth={1} borderRadius="md">
                        <Text>{notification.message}</Text>
                        <Text fontSize="sm" color="gray.500">
                            {notification.createdAt?.toDate().toLocaleString() || 'Date not available'}
                        </Text>
                    </Box>
                ))
            )}
        </VStack>
    );
};

export default NotificationList;
