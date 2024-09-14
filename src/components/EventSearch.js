import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Input, Select, Button, VStack, FormControl, FormLabel } from '@chakra-ui/react';

const EventSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('all');

    const handleSearch = () => {
        onSearch({ searchTerm, dateRange });

        setSearchTerm('');
        setDateRange('all');
    };

    return (
        <Box>
            <VStack spacing={4}>
                <FormControl>
                    <FormLabel htmlFor="search">Search Events</FormLabel>
                    <Input
                        id="search"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="dateRange">Date Range</FormLabel>
                    <Select
                        id="dateRange"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="all">All Dates</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </Select>
                </FormControl>
                <Button onClick={handleSearch} colorScheme="blue">Search</Button>
            </VStack>
        </Box>
    );
};


EventSearch.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default EventSearch;
