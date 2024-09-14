
import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, Text, VStack, Link, Spinner, Center } from '@chakra-ui/react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from "@/src/lib/firebase";

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const eventsPerPage = 10;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const q = query(collection(db, 'events'), orderBy('date'));
                const querySnapshot = await getDocs(q);
                setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (err) {
                setError('Failed to fetch events');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

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
                <Text color="red.500">{error}</Text>
            </Center>
        );
    }

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <VStack spacing={4} align="stretch">
            <Heading size="lg">Upcoming Events</Heading>

            {events.length === 0 && <Text>No Events available.</Text>}
            {currentEvents.map(event => (
                <Box key={event.id} p={4} borderWidth={1} borderRadius="md">
                    <Heading size="md">{event.title}</Heading>
                    <Text>{event.description}</Text>
                    <Text>Date: {new Date(event.date.seconds * 1000).toLocaleString()}</Text>
                    <Text>Location: {event.location}</Text>
                    <Link href={`/events/${event.id}`} passHref>
                        <Button as="a" mt={2} colorScheme="blue">View Details</Button>
                    </Link>
                </Box>
            ))}

            {/* Pagination */}
            <Flex justifyContent="center" mt={4}>
                {Array.from({ length: Math.ceil(events.length / eventsPerPage) }).map((_, index) => (
                    <Button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        mx={1}
                        colorScheme={currentPage === index + 1 ? "blue" : "gray"}
                    >
                        {index + 1}
                    </Button>
                ))}
            </Flex>
        </VStack>
    );
};

export default EventList;