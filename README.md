# 🤖 AI Cute Chatbot - Hướng dẫn cài đặt

## 📁 Cấu trúc file

```
your-repo/
├── index.html          # File chính của chatbot
├── api-config.js       # Quản lý API keys
├── knowledge-base.js   # Kiến thức bổ sung  
├── version.js          # Quản lý phiên bản
└── README.md          # Hướng dẫn này
```

## 🚀 Cách cài đặt

### Bước 1: Tạo GitHub Repository
1. Tạo repository mới trên GitHub
2. Upload tất cả các file vào repo
3. Lưu ý URL của repo để cấu hình

### Bước 2: Cấu hình API Keys
Mở file `api-config.js` và thay đổi:

```javascript
GEMINI_API_KEYS: [
    "YOUR_ACTUAL_GEMINI_API_KEY_1",
    "YOUR_ACTUAL_GEMINI_API_KEY_2", 
    "YOUR_ACTUAL_GEMINI_API_KEY_3",
    // Thêm nhiều API keys tùy thích
],
```

**Lấy Gemini API Key:**
1. Truy cập: https://makersuite.google.com/app/apikey
2. Tạo API key mới
3. Copy và paste vào file config

### Bước 3: Tùy chỉnh Knowledge Base
Mở file `knowledge-base.js` và chỉnh sửa:

```javascript
CONTENT: `
    === KIẾN THỨC BỔ SUNG CHO AI CUTE ===
    
    // Thêm kiến thức chuyên môn của bạn ở đây
    // Ví dụ: thông tin công ty, sản phẩm, dịch vụ
    // AI sẽ sử dụng thông tin này để trả lời
`,
```

### Bước 4: Cập nhật thông tin dự án
Mở file `version.js` và thay đổi:

```javascript
PROJECT_INFO: {
    name: "AI Cute Chatbot",
    author: "Tên của bạn",
    repository: "https://github.com/username/repo-name",
    website: "https://your-website.com",
}
```

### Bước 5: Cấu hình URLs trong HTML
Mở file `index.html` và cập nhật các đường dẫn:

```html
<script src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/api-config.js"></script>
<script src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/knowledge-base.js"></script>  
<script src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/version.js"></script>
```

## 🔧 Tính năng chính

### ✨ Multi-API Support
- Tự động chuyển đổi API khi có lỗi
- Hiển thị trạng thái từng API key
- Thêm API key mới chỉ cần edit file `api-config.js`

### 🧠 Deep Think Mode  
- Bật/tắt chế độ suy luận sâu
- Hiển thị quá trình thinking của AI
- Kết quả chính xác và logic hơn

### 📚 Knowledge Base
- Tích hợp kiến thức từ file riêng
- Không làm chậm tốc độ loading
- Dễ dàng cập nhật mà không sửa code chính

### 🎨 Giao diện đẹp
- Dark theme chuyên nghiệp  
- Responsive trên mọi thiết bị
- Hiệu ứng smooth và hiện đại

### 📋 Code Features
- Syntax highlighting cho code
- Nút copy code tiện lợi
- Hỗ trợ nhiều ngôn ngữ lập trình

## 🔄 Cách cập nhật

### Cập nhật phiên bản:
1. Sửa file `version.js`:
   ```javascript
   VERSION: "1.3.0",
   LAST_UPDATE: "06/06/2025",
   ```

2. Commit và push lên GitHub

3. Người dùng sẽ nhận thông báo cập nhật tự động

### Thêm API key mới:
1. Mở `api-config.js`
2. Thêm API key vào mảng:
   ```javascript
   GEMINI_API_KEYS: [
       "existing_key_1",
       "existing_key_2", 
       "new_api_key_here", // ← Thêm ở đây
   ],
   ```
3. Save và push lên GitHub

### Cập nhật kiến thức:
1. Mở `knowledge-base.js`
2. Thêm thông tin vào phần `CONTENT`
3. Save và push lên GitHub

## 🛠️ Troubleshooting

### Lỗi API không hoạt động:
- Kiểm tra API key có đúng không
- Đảm bảo API key chưa hết quota
- Kiểm tra URL của GitHub files

### Lỗi không load được files:
- Đảm bảo files đã public trên GitHub
- Kiểm tra đường dẫn raw GitHub đúng format
- Xóa cache browser (Ctrl+F5)

### Lỗi CORS:
- GitHub raw files đã hỗ trợ CORS
- Nếu vẫn lỗi, sử dụng jsDelivr:
  ```html
  <script src="https://cdn.jsdelivr.net/gh/username/repo@main/api-config.js"></script>
  ```

## 📞 Hỗ trợ

- **GitHub Issues**: Tạo issue trong repo của bạn
- **Documentation**: Xem thêm trong các file .js
- **Community**: Chia sẻ và thảo luận với cộng đồng

## 📄 License

MIT License - Tự do sử dụng và phát triển

---

**Chúc bạn thành công với AI Cute Chatbot! 🎉**
