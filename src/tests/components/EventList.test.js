import React from 'react';
import { render, screen } from '@testing-library/react';
import { db } from "@/src/lib/firebase";
import EventList from "@/src/components/EventList";
import * as jest from "node/test";
import * as test from "node:test";
import {describe} from "node:test";

jest.mock('@/lib/firebase', () => ({
    db: {
        collection: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({
                docs: [
                    { id: '1', data: () => ({ title: 'Event One', date: '2024-10-01' }) },
                    { id: '2', data: () => ({ title: 'Event Two', date: '2024-10-02' }) },
                ],
            }),
        }),
    },
}));

describe('EventList', () => {
    test('renders EventList component', async () => {
        render(<EventList />);

        const eventOne = await screen.findByText(/event one/i);
        const eventTwo = await screen.findByText(/event two/i);

        expect(eventOne).toBeInTheDocument();
        expect(eventTwo).toBeInTheDocument();
    });

    test('displays message if no events are available', async () => {
        jest.clearAllMocks(); // Clear mock implementation

        // Mock to return empty docs
        db.collection.mockReturnValueOnce({
            get: jest.fn().mockResolvedValue({ docs: [] }),
        });

        render(<EventList />);

        // Check if the message is displayed
        expect(await screen.findByText(/no events available/i)).toBeInTheDocument();
    });

    test('displays error message if fetching events fails', async () => {
        jest.clearAllMocks(); // Clear mock implementation

        // Mock to throw an error
        db.collection.mockReturnValueOnce({
            get: jest.fn().mockRejectedValue(new Error('Failed to fetch events')),
        });

        render(<EventList />);

        expect(await screen.findByText(/failed to fetch events/i)).toBeInTheDocument();
    });
});
