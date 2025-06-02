// API Configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3000'
  },
  production: {
    API_BASE_URL: 'https://user-backend-73ah.onrender.com'
  }
};

// Determine environment
const environment = import.meta.env.MODE || 'development';

// Get API base URL based on environment
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || config[environment as keyof typeof config].API_BASE_URL;

// Helper function to create full API URLs
export const createApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Export for easy access
export default {
  API_BASE_URL,
  createApiUrl
}; 