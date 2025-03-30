// This will be your API base URL when you add FastAPI
// Example: export const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = '';  // Empty for now since backend is not ready

// User registration service
export const userService = {
    // When you add FastAPI, this will be replaced with actual API call
    register: async (userData) => {
        // Simulating API call
        console.log('Simulated API call to register user:', userData);

        // For now, return a success response
        return {
            success: true,
            message: 'User registered successfully',
            data: userData
        };
    },

    // Get all users
    getUsers: async () => {
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
        return {
            success: true,
            token: 'mock_token'
        };
    },

    logout: async () => {
        return {
            success: true
        };
    }
};

export const uploadCSV = async (file) => {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock response for now
        return {
            status: "success",
            predictions: {
                fraud_detected: Math.random() > 0.5,  // Random boolean
                confidence_score: Math.random() * 0.5 + 0.5,  // Random score between 0.5 and 1.0
                suspicious_transactions: [
                    {
                        transaction_id: "TX" + Math.floor(Math.random() * 1000),
                        risk_score: Math.random() * 0.5 + 0.5,
                        reason: "Unusual transaction pattern detected"
                    }
                ]
            }
        };
    } catch (error) {
        console.error('Error uploading CSV:', error);
        throw error;
    }
};

export const checkHealth = async () => {
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            status: "healthy",
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
}; 