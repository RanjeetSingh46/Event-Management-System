// Profile.js
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "@/src/lib/firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Box, Heading, Text, VStack, Button, useToast } from '@chakra-ui/react';

const Profile = () => {
    const [user] = useAuthState(auth);
    const [profile, setProfile] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchProfileAndEvents = async () => {
            if (user) {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setProfile(docSnap.data());
                    } else {
                        const newProfile = { name: user.displayName || 'New User', email: user.email, events: [] };
                        await setDoc(docRef, newProfile);
                        setProfile(newProfile);
                    }

                    const eventsQuery = query(
                        collection(db, 'events'),
                        where('attendees', 'array-contains', user.uid),
                        orderBy('date', 'desc'),
                        limit(10)
                    );
                    const querySnapshot = await getDocs(eventsQuery);
                    setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                } catch (error) {
                    toast({
                        title: "Error fetching data",
                        description: error.message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchProfileAndEvents();
    }, [user, toast]);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            toast({
                title: "Signed out successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error signing out",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!user || !profile) return <div>User not found</div>;

    return (
        <Box>
            <VStack spacing={4} align="stretch">
                <Heading>User Profile</Heading>
                {/*<Text>Name: {profile.name}</Text>*/}
                <Text>Email: {profile.email}</Text>
                <Button onClick={handleSignOut} colorScheme="red">Sign Out</Button>

                <Heading size="md" mt={6}>Your Events</Heading>
                {events.length > 0 ? (
                    events.map(event => (
                        <Box key={event.id} p={2} borderWidth={1} borderRadius="md">
                            <Text fontWeight="bold">{event.title}</Text>
                            <Text>{event.description}</Text>
                            <Text fontSize="sm" color="gray.500">
                                {new Date(event.date).toLocaleString()}
                            </Text>
                            <Text fontSize="sm">Location: {event.location}</Text>
                        </Box>
                    ))
                ) : (
                    <Text>No events found.</Text>
                )}
            </VStack>
        </Box>
    );
};

export default Profile;