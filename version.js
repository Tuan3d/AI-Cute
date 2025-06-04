// ================================
// Version Management File  
// File: version.js
// ================================
// Hướng dẫn sử dụng:
// 1. Cập nhật VERSION khi có thay đổi
// 2. Cập nhật LAST_UPDATE với ngày hiện tại
// 3. Thêm thông tin vào CHANGELOG
// 4. Người dùng sẽ thấy thông báo cập nhật tự động
// ================================

const VERSION_INFO = {
    // Phiên bản hiện tại (Semantic Versioning)
    VERSION: "1.2.0",
    
    // Ngày cập nhật cuối (DD/MM/YYYY)
    LAST_UPDATE: "05/06/2025",
    
    // Thông tin build
    BUILD_NUMBER: "20250605001",
    BUILD_DATE: "2025-06-05T10:30:00Z",
    
    // Tính năng mới trong phiên bản này
    NEW_FEATURES: [
        "✨ Multi-API support với fallback tự động",
        "🧠 Deep Think mode với quá trình suy luận",
        "📚 Knowledge base tích hợp từ file riêng",
        "🎨 Giao diện tối chuyên nghiệp",
        "📋 Copy code với một click",
        "🔄 Auto-retry khi API thất bại"
    ],
    
    // Lịch sử thay đổi
    CHANGELOG: {
        "1.2.0": {
            date: "05/06/2025",
            changes: [
                "Thêm hệ thống multi-API với fallback",
                "Tích hợp Deep Think mode",
                "Thêm knowledge base từ file riêng", 
                "Cải thiện UI/UX với dark theme",
                "Thêm tính năng copy code"
            ]
        },
        "1.1.0": {
            date: "04/06/2025", 
            changes: [
                "Thêm Deep Think reasoning",
                "Cải thiện hiển thị code blocks",
                "Tối ưu hóa giao diện responsive"
            ]
        },
        "1.0.0": {
            date: "03/06/2025",
            changes: [
                "Phiên bản đầu tiên",
                "Tích hợp Gemini API",
                "Giao diện chat cơ bản",
                "Hỗ trợ markdown và code highlighting"
            ]
        }
    },
    
    // Thông tin tác giả và dự án
    PROJECT_INFO: {
        name: "AI Cute Chatbot",
        author: "Your Name", // Thay đổi tên của bạn ở đây
        description: "Chatbot thông minh với Gemini API và Deep Think",
        repository: "https://github.com/yourusername/ai-cute", // Thay đổi link repo
        website: "https://your-website.com", // Thay đổi website
        license: "MIT"
    },
    
    // Cấu hình kiểm tra update
    UPDATE_CONFIG: {
        check_interval: 3600000, // 1 hour in milliseconds
        update_url: "https://raw.githubusercontent.com/yourusername/your-repo/main/version.js",
        force_refresh: false // Set true để buộc refresh cache
    }
};

// Hàm so sánh phiên bản
function compareVersions(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1Part = v1Parts[i] || 0;
        const v2Part = v2Parts[i] || 0;
        
        if (v1Part > v2Part) return 1;
        if (v1Part < v2Part) return -1;
    }
    
    return 0;
}

// Hàm kiểm tra có phiên bản mới không
function hasNewVersion(currentVersion, latestVersion) {
    return compareVersions(latestVersion, currentVersion) > 0;
}

// Hàm lấy changelog của phiên bản
function getVersionChangelog(version) {
    return VERSION_INFO.CHANGELOG[version] || null;
}

// Hàm format thời gian update
function getFormattedUpdateTime() {
    const date = new Date(VERSION_INFO.BUILD_DATE);
    return date.toLocaleString('vi-VN');
}

// Hàm kiểm tra cập nhật từ server
async function checkForUpdates() {
    try {
        const response = await fetch(VERSION_INFO.UPDATE_CONFIG.update_url + '?t=' + Date.now());
        const text = await response.text();
        
        // Parse version từ response
        const versionMatch = text.match(/VERSION:\s*"([^"]+)"/);
        if (versionMatch) {
            const latestVersion = versionMatch[1];
            return {
                hasUpdate: hasNewVersion(VERSION_INFO.VERSION, latestVersion),
                latestVersion: latestVersion,
                currentVersion: VERSION_INFO.VERSION
            };
        }
    } catch (error) {
        console.warn('Không thể kiểm tra cập nhật:', error);
    }
    
    return {
        hasUpdate: false,
        latestVersion: VERSION_INFO.VERSION,
        currentVersion: VERSION_INFO.VERSION
    };
}

// Hàm hiển thị thông báo cập nhật
function showUpdateNotification(updateInfo) {
    if (updateInfo.hasUpdate) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #4caf50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">🎉 Có phiên bản mới!</div>
            <div style="font-size: 14px;">v${updateInfo.latestVersion} đã có sẵn</div>
            <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">Click để refresh</div>
        `;
        
        notification.onclick = () => {
            location.reload(true);
        };
        
        document.body.appendChild(notification);
        
        // Auto hide after 10 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 10000);
    }
}

// Auto check for updates when loaded
if (typeof window !== 'undefined') {
    window.VERSION_INFO = VERSION_INFO;
    window.compareVersions = compareVersions;
    window.hasNewVersion = hasNewVersion;
    window.getVersionChangelog = getVersionChangelog;
    window.checkForUpdates = checkForUpdates;
    window.showUpdateNotification = showUpdateNotification;
    
    // Tự động kiểm tra cập nhật sau 5 giây
    setTimeout(async () => {
        const updateInfo = await checkForUpdates();
        showUpdateNotification(updateInfo);
    }, 5000);
    
    // Kiểm tra định kỳ
    setInterval(async () => {
        const updateInfo = await checkForUpdates();
        showUpdateNotification(updateInfo);
    }, VERSION_INFO.UPDATE_CONFIG.check_interval);
}
