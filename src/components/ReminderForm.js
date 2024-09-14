import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, Button, FormControl, FormLabel, Select, useToast } from '@chakra-ui/react';
import { auth } from "@/src/lib/firebase";
import {scheduleReminder} from "@/src/lib/reminders";

const ReminderForm = ({ eventId, eventDate }) => {
    const [reminderTime, setReminderTime] = useState('30');
    const [user, loading] = useAuthState(auth);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            toast({
                title: "Loading...",
                description: "Please wait while we check your authentication status.",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!user) {
            toast({
                title: "Error",
                description: "You must be logged in to set a reminder.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const reminderDate = new Date(eventDate);
        reminderDate.setMinutes(reminderDate.getMinutes() - parseInt(reminderTime, 10));

        try {

            await scheduleReminder(eventId, user.uid, reminderDate);
            toast({
                title: "Reminder set",
                description: `You will be reminded ${reminderTime} minutes before the event.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setReminderTime('30');
        } catch (error) {
            console.error("Error setting reminder:", error);
            toast({
                title: "Error",
                description: "Failed to set reminder.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <FormControl isRequired>
                <FormLabel>Set Reminder</FormLabel>
                <Select value={reminderTime} onChange={(e) => setReminderTime(e.target.value)}>
                    <option value="15">15 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                    <option value="1440">1 day before</option>
                </Select>
            </FormControl>
            <Button type="submit" mt={2} colorScheme="blue">Set Reminder</Button>
        </Box>
    );
};

export default ReminderForm;
