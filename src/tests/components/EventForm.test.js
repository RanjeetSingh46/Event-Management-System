
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import EventForm from "@/src/components/EventForm";
import * as jest from "node/test";
import * as test from "node:test";
import {describe} from "node:test";

jest.mock('@/lib/firebase', () => ({
    db: {
        collection: jest.fn().mockReturnValue({
            add: jest.fn().mockResolvedValue({ id: 'testEventId' }),
        }),
    },
}));

describe('EventForm', () => {
    test('renders EventForm component', () => {
        render(<EventForm />);

        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create event/i })).toBeInTheDocument();
    });

    test('submits the form and creates an event', async () => {
        render(<EventForm />);

        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Event' } });
        fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2024-10-01' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /create event/i }));
        });

        expect(screen.getByText(/event created successfully/i)).toBeInTheDocument();
    });

    test('shows error message if title is empty', async () => {
        render(<EventForm />);

        fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2024-10-01' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /create event/i }));
        });

        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    test('shows error message if date is empty', async () => {
        render(<EventForm />);

        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Event' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /create event/i }));
        });

        expect(screen.getByText(/date is required/i)).toBeInTheDocument();
    });
});
