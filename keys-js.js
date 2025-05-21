// This file maps custom keys to actual Gemini API keys
// You can update this file without modifying other files

// Format: 'custom-key': 'actual-gemini-api-key'
const keyMappings = {
    'key123': 'AIzaSyBJi5Gj5fHODjMgPMGI84doMS7jUFiueo8',
    'key456': 'AIzaSyBtC9RmO2tSMmDvLcNnHxbeBQRZB-w1a5M',
    'tuankey': 'AIzaSyCnHbPzCFnGv8OVkwfv_XhL0W1Z1XUvN80',
    'admin2025': 'AIzaSyDcZJGxON7PTUaMNGmJB5zUXYJapbSvaw4'
    // Add more key mappings as needed
};

// Function to verify a custom key and return the real API key
function verifyCustomKey(customKey) {
    return keyMappings[customKey] || null;
}