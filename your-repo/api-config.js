// ================================
// API Configuration File
// File: api-config.js
// ================================
// Hướng dẫn sử dụng:
// 1. Thêm API keys vào mảng GEMINI_API_KEYS
// 2. Hệ thống sẽ tự động chuyển đổi khi API key bị lỗi
// 3. Có thể thêm nhiều API key tùy thích
// ================================

const API_CONFIG = {
    // Danh sách các Gemini API Keys
    // Thêm API key mới vào cuối mảng này
    GEMINI_API_KEYS: [
        "AIzaSyClbg_DdnIiKHdpHiPoQD7Q5Qn3G3b47D8",
        "YOUR_GEMINI_API_KEY_2_HERE", 
        "YOUR_GEMINI_API_KEY_3_HERE",
        // Thêm API keys mới ở đây
        // "YOUR_NEW_API_KEY_HERE",
    ],
    
    // Cấu hình API endpoint
    GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    
    // Cấu hình retry
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // milliseconds
    
    // Cấu hình mặc định
    DEFAULT_SETTINGS: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.9,
        topK: 40
    }
};

// Hàm kiểm tra API key hợp lệ
function validateApiKey(apiKey) {
    return apiKey && 
           typeof apiKey === 'string' && 
           apiKey.length > 10 && 
           !apiKey.includes('YOUR_') && 
           !apiKey.includes('_HERE');
}

// Hàm lấy danh sách API keys hợp lệ
function getValidApiKeys() {
    return API_CONFIG.GEMINI_API_KEYS.filter(validateApiKey);
}

// Export để sử dụng ở nơi khác
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
    window.validateApiKey = validateApiKey;
    window.getValidApiKeys = getValidApiKeys;
}
