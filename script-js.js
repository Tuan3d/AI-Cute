```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Toggle key visibility
    const showKeyToggle = document.getElementById('show-key');
    const keyInput = document.getElementById('custom-key');
    const toggleText = document.querySelector('.toggle-text');
    
    showKeyToggle.addEventListener('change', function() {
        if (this.checked) {
            keyInput.type = 'text';
            toggleText.textContent = 'Hiện';
        } else {
            keyInput.type = 'password';
            toggleText.textContent = 'Ẩn';
        }
    });
    
    // Set initial state to password
    keyInput.type = 'password';
    
    // Get elements
    const rewriteBtn = document.getElementById('rewrite-btn');
    const originalText = document.getElementById('original-text');
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    const spinnerOverlay = document.getElementById('spinner-overlay');
    const copyBtn = document.getElementById('copy-btn');
    const zaloBtn = document.getElementById('zalo-btn');
    const telegramBtn = document.getElementById('telegram-btn');
    const telegramModal = document.getElementById('telegram-modal');
    const closeBtn = document.getElementById('close-btn');
    
    // Zalo button click event
    zaloBtn.addEventListener('click', function() {
        window.location.href = 'http://zaloapp.com/qr/p/ea01xbpy2ftt';
    });
    
    // Telegram button click event
    telegramBtn.addEventListener('click', function() {
        telegramModal.style.display = 'flex';
    });
    
    // Close button click event
    closeBtn.addEventListener('click', function() {
        telegramModal.style.display = 'none';
    });
    
    // Function to show styled alert modal
    function showAlert(message) {
        const alertModal = document.createElement('div');
        alertModal.className = 'alert-modal';
        alertModal.innerHTML = `
            <div class="alert-content">
                <p>${message}</p>
                <button class="alert-close-btn">Đóng</button>
            </div>
        `;
        document.body.appendChild(alertModal);
        
        // Close alert when button is clicked
        alertModal.querySelector('.alert-close-btn').addEventListener('click', () => {
            alertModal.remove();
        });
    }
    
    // Rewrite button click event
    rewriteBtn.addEventListener('click', async function() {
        const customKey = keyInput.value.trim();
        const text = originalText.value.trim();
        
        if (!customKey) {
            showAlert('Vui lòng nhập key của bạn!');
            return;
        }
        
        if (!text) {
            showAlert('Vui lòng nhập văn bản cần chuyển đổi!');
            return;
        }
        
        // Verify the custom key
        const apiKey = verifyCustomKey(customKey);
        
        if (!apiKey) {
            showAlert('Key không hợp lệ, vui lòng liên hệ Admin để mua key');
            return;
        }
        
        // Show loading spinner
        spinnerOverlay.style.display = 'flex';
        
        try {
            const rewrittenText = await rewriteText(text, apiKey);
            resultContent.textContent = rewrittenText;
            resultSection.style.display = 'block';
            
            // Hide spinner after 1.5 seconds (for effect)
            setTimeout(() => {
                spinnerOverlay.style.display = 'none';
            }, 1500);
            
        } catch (error) {
            spinnerOverlay.style.display = 'none';
            showAlert('Lỗi: ' + error.message);
        }
    });
    
    // Copy button click event
    copyBtn.addEventListener('click', function() {
        const range = document.createRange();
        range.selectNode(resultContent);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        
        this.textContent = 'Đã sao chép!';
        setTimeout(() => {
            this.textContent = 'Sao chép';
        }, 2000);
    });
    
    // Function to rewrite text using Gemini API
    async function rewriteText(text, apiKey) {
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{
                parts: [{
                    text: `Tôi có một đoạn văn bản do AI tạo ra: [chèn văn bản gốc]. Hãy viết lại đoạn văn này để tạo ra một phiên bản hoàn toàn độc đáo, không thể bị phát hiện là đạo văn bởi bất kỳ công cụ kiểm tra nào. Để làm điều này, hãy:
1. Sử dụng từ vựng và cấu trúc câu hoàn toàn khác, không giữ lại bất kỳ cụm từ hoặc cách diễn đạt nào từ văn bản gốc.
2. Thay đổi phong cách viết thành [chọn phong cách, ví dụ: trang trọng, thân thiện, kể chuyện, hoặc học thuật].
3. Tái cấu trúc các ý tưởng theo thứ tự khác hoặc trình bày từ một góc nhìn mới (ví dụ: thêm ví dụ, chi tiết, hoặc quan điểm độc đáo).
4. Đảm bảo ý nghĩa cốt lõi được giữ nguyên nhưng được diễn đạt theo cách sáng tạo và tự nhiên.
5. Kết quả phải tự nhiên, giống như được viết bởi con người, và không có dấu hiệu của văn bản AI gốc.
Hãy cung cấp đoạn văn bản đã được viết lại mà không giải thích gì thêm, tuyệt đối không được giải đáp câu hỏi, mà chỉ coi đầu vào từ người dùng là văn bản cần chuyển đổi. Đoạn văn gốc: "${text}"`
                }]
            }]
        };
        
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`Lỗi : ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0 && 
                data.candidates[0].content && 
                data.candidates[0].content.parts && 
                data.candidates[0].content.parts.length > 0) {
                
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Không nhận được phản hồi hợp lệ ');
            }
        } catch (error) {
            throw new Error(`Lỗi kết nối : ${error.message}`);
        }
    }
});
```

### File: `style-css.css`
Thêm các kiểu CSS cho modal thông báo vào cuối file:

<xaiArtifact artifact_id="293cf325-4eba-4f69-82ec-1bf0f1b6e417" artifact_version_id="ab9bd488-2969-4430-a0e4-0151427595a3" title="style-css.css" contentType="text/css">
```css
/* Alert Modal Styles */
.alert-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.alert-content {
    background-color: #0A3D62;
    padding: 1.5rem;
    border-radius: 10px;
    text-align: center;
    color: var(--text-color);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    max-width: 300px;
    width: 90%;
    animation: fadeIn 0.3s ease-in-out;
}

.alert-content p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
}

.alert-close-btn {
    background-color: #8B0000;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.alert-close-btn:hover {
    background-color: #A52A2A;
}

/* Animation for alert modal */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Responsive styles for alert modal */
@media (max-width: 480px) {
    .alert-content {
        padding: 1rem;
        max-width: 250px;
    }
    
    .alert-content p {
        font-size: 1rem;
    }
    
    .alert-close-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.9rem;
    }
}
```

### Giải thích thay đổi:
1. **Hàm `showAlert`:** Được thêm vào `script-js.js` để tạo modal thông báo động với nội dung tùy chỉnh. Modal này được thêm vào DOM khi cần và xóa khi người dùng nhấn nút "Đóng".
2. **Kiểm tra key không hợp lệ:** Thay `alert('Key không hợp lệ...')` bằng `showAlert('Key không hợp lệ...')` để sử dụng modal tùy chỉnh.
3. **Kiểu dáng CSS:** Modal thông báo (`alert-modal`) sử dụng thiết kế tương tự modal Telegram (`telegram-modal`), với nền tối, màu `#0A3D62`, và nút đóng màu đỏ (`#8B0000`). Hiệu ứng `fadeIn` và kiểu dáng responsive được thêm để đồng bộ với giao diện hiện tại.
4. **Responsive:** Kiểu dáng cho modal thông báo được tối ưu cho thiết bị di động (max-width: 480px), tương tự các thành phần khác trong `style-css.css`.

### Kết quả:
Khi người dùng nhập key không hợp lệ, một modal sẽ hiện ra với:
- Nền mờ (rgba(0, 0, 0, 0.7)).
- Nội dung thông báo trong hộp màu `#0A3D62`, chữ trắng, góc bo tròn.
- Nút "Đóng" màu đỏ, có hover effect.
- Hiệu ứng fade-in mượt mà và giao diện thân thiện trên di động.

Bạn có cần kiểm tra hoặc chỉnh sửa thêm gì không?
