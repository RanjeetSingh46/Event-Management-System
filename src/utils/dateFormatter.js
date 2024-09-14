
export const formatDate = (date, locale = 'en-US', options = {}) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date provided');
    }

    return dateObj.toLocaleDateString(locale, options);
};


export const formatDateTime = (date, locale = 'en-US', options = {}) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date provided');
    }

    return dateObj.toLocaleString(locale, options);
};


export const formatRelativeTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date provided');
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    if (diffInSeconds < 60) {
        return diffInSeconds === 1 ? '1 second ago' : `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return days === 1 ? '1 day ago' : `${days} days ago`;
    }
};

export default {
    formatDate,
    formatDateTime,
    formatRelativeTime,
};
