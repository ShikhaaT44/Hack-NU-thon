// This will be your API base URL when you add FastAPI
// Example: export const API_BASE_URL = 'http://localhost:8000';
export const API_BASE_URL = '';

// User registration service
export const userService = {
    // When you add FastAPI, this will be replaced with actual API call
    register: async (userData) => {
        // Simulating API call
        console.log('Simulated API call to register user:', userData);

        // This is where you'll add the FastAPI endpoint call later
        // Example with FastAPI:
        // const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(userData)
        // });
        // return await response.json();

        // For now, return a success response
        return {
            success: true,
            message: 'User registered successfully',
            data: userData
        };
    },

    // Get all users
    getUsers: async () => {
        // This will be replaced with FastAPI endpoint
        // Example:
        // const response = await fetch(`${API_BASE_URL}/api/users`);
        // return await response.json();

        // For now, return mock data
        return {
            success: true,
            data: [
                { id: 1, name: 'Folno Reelv', role: 'user' },
                { id: 2, name: 'Aebnvcat', role: 'admin' },
                // ... other users
            ]
        };
    },

    // Get user by ID
    getUserById: async (userId) => {
        // Will be replaced with:
        // const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
        // return await response.json();

        return {
            success: true,
            data: {
                id: userId,
                name: 'Test User',
                role: 'user'
            }
        };
    }
};

// Authentication service
export const authService = {
    login: async (credentials) => {
        // Will be replaced with FastAPI endpoint
        // Example:
        // const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(credentials)
        // });
        // return await response.json();

        return {
            success: true,
            token: 'mock_token'
        };
    },

    logout: async () => {
        // Will be replaced with FastAPI endpoint
        // const response = await fetch(`${API_BASE_URL}/api/auth/logout`);
        // return await response.json();

        return {
            success: true
        };
    }
}; 