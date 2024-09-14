import React, { useState } from 'react';
import { db, auth } from "@/src/lib/firebase";
import { collection, addDoc, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    useToast,
    Spinner,
    Heading
} from '@chakra-ui/react';

const EventForm = () => {
    const [event, setEvent] = useState({ title: '', description: '', date: '', location: '' });
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!event.title || !event.description || !event.date || !event.location) {
            toast({
                title: "Error",
                description: "Please fill in all the fields.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated");
            }

            // Add event to the Firestore collection
            const eventRef = await addDoc(collection(db, 'events'), {
                ...event,
                createdAt: new Date(),
                createdBy: user.uid,
                attendees: [user.uid]  // Add the creator as the first attendee
            });

            // Update user's events array
            await updateDoc(doc(db, 'users', user.uid), {
                events: arrayUnion(eventRef.id)
            });

            // Clear form fields
            setEvent({ title: '', description: '', date: '', location: '' });

            // Show success toast
            toast({
                title: "Event created",
                description: "Your event has been successfully created.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error adding event: ', error);
            toast({
                title: "Error",
                description: "There was an error creating your event.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <Heading className={"mt-4 mb-6"} size="lg" >Event Form</Heading>
            <VStack spacing={4}>
                <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                        name="title"
                        value={event.title}
                        onChange={handleChange}
                        placeholder="Enter event title"
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        name="description"
                        value={event.description}
                        onChange={handleChange}
                        placeholder="Enter event description"
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Date</FormLabel>
                    <Input
                        name="date"
                        type="datetime-local"
                        value={event.date}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Location</FormLabel>
                    <Input
                        name="location"
                        value={event.location}
                        onChange={handleChange}
                        placeholder="Enter event location"
                    />
                </FormControl>
                <Button
                    onClick={handleSubmit}
                    colorScheme="blue"
                    isLoading={loading}
                    isDisabled={loading || !event.title || !event.description || !event.date || !event.location}
                >
                    {loading ? <Spinner size="sm" /> : 'Create Event'}
                </Button>
            </VStack>
        </Box>
    );
};

export default EventForm;