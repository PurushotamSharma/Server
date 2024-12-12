// src/services/api.js
import axios from 'axios';

// Define the base API URL from environment variables or default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'https://server-new-backend.vercel.app/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 seconds timeout
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log('🚀 Request:', {
            method: config.method?.toUpperCase(),
            url: `${config.baseURL}${config.url}`,
            data: config.data
                ? {
                      ...config.data,
                      privateKey: config.data.privateKey ? '[REDACTED]' : undefined,
                  }
                : undefined,
        });
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for logging
api.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
        });
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
        });
        return Promise.reject(error);
    }
);

// Define server-related API methods
export const serverAPI = {
    addServer: async (serverData) => {
        try {
            const response = await api.post('/servers', serverData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Server endpoint not found. Please check your backend connection.');
            }
            throw new Error(error.response?.data?.message || 'Failed to add server');
        }
    },

    getAllServers: async () => {
        try {
            const response = await api.get('/servers');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch servers');
        }
    },

    checkServerStatus: async (serverId) => {
        if (!serverId) {
            throw new Error('Server ID is required');
        }
        try {
            const response = await api.get(`/servers/${serverId}/status`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Server not found');
            }
            throw new Error(error.response?.data?.message || 'Failed to check server status');
        }
    },

    executeCommand: async (serverId, command) => {
        if (!serverId || !command) {
            throw new Error('Server ID and command are required');
        }
        try {
            const response = await api.post(`/servers/${serverId}/execute`, { command });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to execute command');
        }
    },
};

export default serverAPI;
