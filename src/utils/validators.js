
export const validateEvent = (event) => {
    const errors = [];

    if (!event.title || typeof event.title !== 'string' || event.title.trim() === '') {
        errors.push('Title is required and must be a non-empty string.');
    }

    if (!event.date || !isValidDate(event.date)) {
        errors.push('A valid date is required.');
    }

    if (event.description && typeof event.description !== 'string') {
        errors.push('Description must be a string.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};


const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};


export const validateRSVP = (status) => {
    const validStatuses = ['attending', 'not attending'];
    if (!validStatuses.includes(status)) {
        return {
            isValid: false,
            errors: ['Invalid RSVP status.'],
        };
    }
    return {
        isValid: true,
        errors: [],
    };
};


export const validateNotification = (notification) => {
    const errors = [];

    if (!notification.userId || typeof notification.userId !== 'string') {
        errors.push('User ID is required and must be a string.');
    }

    if (!notification.message || typeof notification.message !== 'string' || notification.message.trim() === '') {
        errors.push('Message is required and must be a non-empty string.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export default {
    validateEvent,
    validateRSVP,
    validateNotification,
};
