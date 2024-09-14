import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Box, Heading, Text, VStack, Center, Spinner } from '@chakra-ui/react';
import { db } from "@/src/lib/firebase";
import AttendeeManagement from "@/src/components/AttendeeManagement"; // Ensure correct alias setup

const EventDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            if (id) {
                try {
                    const docRef = doc(db, 'events', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setEvent({ id: docSnap.id, ...docSnap.data() });
                    } else {
                        setError('Event not found');
                    }
                } catch (err) {
                    setError('Failed to fetch event. Please try again later.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (router.isReady) {
            fetchEvent();
        }
    }, [id, router.isReady]);

    if (loading) {
        return (
            <Center height="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (error) {
        return (
            <Center height="100vh">
                <Text color="red.500" fontSize="lg">{error}</Text>
            </Center>
        );
    }

    return (
        <Box>
            <VStack spacing={4} align="stretch">
                <Heading>{event?.title || 'Untitled Event'}</Heading>
                <Text>{event?.description || 'No description available.'}</Text>
                <Text>
                    Date: {event?.date ? new Date(event.date).toLocaleString() : 'No date specified'}
                </Text>
                <Text>Location: {event?.location || 'No location provided.'}</Text>
                <AttendeeManagement eventId={id} />
            </VStack>
        </Box>
    );
};

export default EventDetail;
