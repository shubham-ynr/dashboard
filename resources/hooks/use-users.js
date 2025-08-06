import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

// Base API URL
const API_BASE_URL = '/api/admin/users';

// Custom hook for user management
export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
    });
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        role: '',
        verified: '',
        sort_by: 'created_at',
        sort_order: 'asc',
    });

    // Use ref to track if this is the initial load
    const isInitialLoad = useRef(true);

    // Fetch users with filters and pagination
    const fetchUsers = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                ...filters,
                ...params,
                page: params.page || pagination.current_page,
            });

            const response = await axios.get(`${API_BASE_URL}?${queryParams}`);
            
            if (response.data.success) {
                setUsers(response.data.data);
                setPagination(response.data.pagination);
                // Don't update filters from response to avoid loops
                // setFilters(response.data.filters);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while fetching users');
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.current_page]);

    // Get user statistics
    const fetchUserStats = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/stats`);
            return response.data.success ? response.data.data : null;
        } catch (err) {
            console.error('Error fetching user stats:', err);
            return null;
        }
    }, []);

    // Create a new user
    const createUser = async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(API_BASE_URL, userData);
            
            if (response.data.success) {
                // Refresh the users list
                await fetchUsers();
                return { success: true, data: response.data.data };
            } else {
                setError(response.data.message || 'Failed to create user');
                return { success: false, message: response.data.message };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred while creating user';
            setError(errorMessage);
            return { 
                success: false, 
                message: errorMessage,
                errors: err.response?.data?.errors 
            };
        } finally {
            setLoading(false);
        }
    };

    // Update a user
    const updateUser = async (id, userData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, userData);
            
            if (response.data.success) {
                // Update the user in the local state
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user.id === id ? response.data.data : user
                    )
                );
                return { success: true, data: response.data.data };
            } else {
                setError(response.data.message || 'Failed to update user');
                return { success: false, message: response.data.message };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred while updating user';
            setError(errorMessage);
            return { 
                success: false, 
                message: errorMessage,
                errors: err.response?.data?.errors 
            };
        } finally {
            setLoading(false);
        }
    };

    // Delete a user
    const deleteUser = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.delete(`${API_BASE_URL}/${id}`);
            
            if (response.data.success) {
                // Remove the user from the local state
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
                return { success: true };
            } else {
                setError(response.data.message || 'Failed to delete user');
                return { success: false, message: response.data.message };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred while deleting user';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Update user status
    const updateUserStatus = async (id, status) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.patch(`${API_BASE_URL}/${id}/status`, { status });
            
            if (response.data.success) {
                // Update the user in the local state
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user.id === id ? response.data.data : user
                    )
                );
                return { success: true, data: response.data.data };
            } else {
                setError(response.data.message || 'Failed to update user status');
                return { success: false, message: response.data.message };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred while updating user status';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Verify/unverify a user
    const verifyUser = async (id, isVerified) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.patch(`${API_BASE_URL}/${id}/verify`, { isVerified });
            
            if (response.data.success) {
                // Update the user in the local state
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user.id === id ? response.data.data : user
                    )
                );
                return { success: true, data: response.data.data };
            } else {
                setError(response.data.message || 'Failed to update user verification status');
                return { success: false, message: response.data.message };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred while updating user verification status';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Get a specific user
    const getUser = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data.success ? response.data.data : null;
        } catch (err) {
            console.error('Error fetching user:', err);
            return null;
        }
    };

    // Update filters
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    // Update pagination
    const updatePagination = useCallback((newPagination) => {
        setPagination(prev => ({ ...prev, ...newPagination }));
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Initial fetch - only run once on mount
    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            fetchUsers();
        }
    }, []); // Empty dependency array

    // Fetch users when filters change
    useEffect(() => {
        if (!isInitialLoad.current) {
            fetchUsers();
        }
    }, [filters, fetchUsers]);

    return {
        // State
        users,
        loading,
        error,
        pagination,
        filters,
        
        // Actions
        fetchUsers,
        fetchUserStats,
        createUser,
        updateUser,
        deleteUser,
        updateUserStatus,
        verifyUser,
        getUser,
        updateFilters,
        updatePagination,
        clearError,
    };
};

// Utility functions for user management
export const userUtils = {
    // Get status badge color
    getStatusColor: (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'inactive':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'banned':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    },

    // Get role badge color
    getRoleColor: (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'user':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    },

    // Format user name
    formatUserName: (user) => {
        if (user.first_name && user.last_name) {
            return `${user.first_name} ${user.last_name}`;
        } else if (user.first_name) {
            return user.first_name;
        } else {
            return user.username || 'Unknown User';
        }
    },

    // Get verification status text
    getVerificationText: (isVerified) => {
        return isVerified ? 'Verified' : 'Unverified';
    },

    // Get verification status color
    getVerificationColor: (isVerified) => {
        return isVerified 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-red-100 text-red-800 border-red-200';
    },

    // Format date
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    },
};
