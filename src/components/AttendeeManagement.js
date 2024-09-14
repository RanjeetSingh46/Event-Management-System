import React, { useState, useEffect } from 'react';
import {auth} from "@/src/lib/firebase";
import { Box, Button, Heading, Text, VStack, useToast } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';

const AttendeeManagement = ({ eventId }) => {
    const [attendees, setAttendees] = useState([]);
    const [user] = useAuthState(auth);
    const toast = useToast();

    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const response = await fetch(`/api/attendees/${eventId}`);
                const data = await response.json();
                if (data.success) {
                    setAttendees(data.attendees);
                } else {
                    toast({
                        title: "Error",
                        description: data.message || "Event not found.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                console.error('Error fetching event attendees:', error);
                toast({
                    title: "Error",
                    description: "There was an error fetching attendees.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };
        if (eventId) fetchAttendees();
    }, [eventId, toast]);

    const handleRSVP = async (status) => {
        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to RSVP.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const attendee = {
            userId: user.uid,
            name: user.displayName || user.email,
            status,
        };

        try {
            const response = await fetch(`/api/attendees/${eventId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendee),
            });
            const data = await response.json();

            if (data.success) {
                toast({
                    title: "RSVP Updated",
                    description: `You are now ${status === 'attending' ? 'attending' : 'not attending'} this event.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setAttendees(prev => [...prev, attendee]); // Update local state
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error updating RSVP:', error);
            toast({
                title: "Error",
                description: "There was an error updating your RSVP.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleCancelAttendance = async () => {
        if (!user) return;

        const attendee = { userId: user.uid };

        try {
            const response = await fetch(`/api/attendees/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendee),
            });
            const data = await response.json();

            if (data.success) {
                toast({
                    title: "RSVP Cancelled",
                    description: "You have cancelled your attendance.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setAttendees(prev => prev.filter(a => a.userId !== user.uid)); // Remove from local state
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error canceling RSVP:', error);
            toast({
                title: "Error",
                description: "There was an error canceling your RSVP.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <VStack spacing={4} align="stretch">
            <Heading size="md">Attendees</Heading>
            {attendees.length > 0 ? (
                attendees.map((attendee) => (
                    <Box key={attendee.userId} p={2} borderWidth={1} borderRadius="md">
                        <Text>{attendee.name} - {attendee.status}</Text>
                    </Box>
                ))
            ) : (
                <Text>No attendees yet.</Text>
            )}
            <Button onClick={() => handleRSVP('attending')} colorScheme="green">Attend</Button>
            <Button onClick={handleCancelAttendance} colorScheme="red">Cancel Attendance</Button>
        </VStack>
    );
};

export default AttendeeManagement;
