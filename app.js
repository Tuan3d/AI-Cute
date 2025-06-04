// ================================
// Main Application Logic
// File: app.js
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const deepThinkToggle = document.getElementById('deepThinkToggle');
    const deepThinkSpan = deepThinkToggle ? deepThinkToggle.querySelector('span') : null;
    const apiStatusContainer = document.getElementById('apiStatusContainer');
    const versionDisplay = document.getElementById('versionInfo');
    const tempInput = document.getElementById('tempInput');

    // --- State Variables ---
    let isDeepThinkOn = false;
    let currentApiKeyIndex = 0;
    let validApiKeys = [];
    let conversationHistory = []; // Store conversation history for context
    let isSending = false; // Prevent multiple sends

    // --- Initialization ---
    initializeChat();

    function initializeChat() {
        console.log("Initializing AI Cute Chat...");
        loadVersionInfo();
        setupEventListeners();
        loadApiKeys();
        updateApiStatusDisplay();
        // Add initial AI greeting to history
        const initialAiMessage = chatMessages.querySelector('.message.ai .message-content');
        if (initialAiMessage) {
            conversationHistory.push({ role: "model", parts: [{ text: initialAiMessage.textContent.trim() }] });
        }
        console.log("Initialization complete.");
    }

    function loadVersionInfo() {
        if (versionDisplay && typeof VERSION_INFO !== 'undefined') {
            versionDisplay.textContent = `v${VERSION_INFO.VERSION} (${VERSION_INFO.LAST_UPDATE})`;
        } else if (versionDisplay) {
            versionDisplay.textContent = 'Version N/A';
        }
    }

    function setupEventListeners() {
        if (sendButton && messageInput) {
            sendButton.addEventListener('click', handleSendMessage);
            messageInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                }
            });
        }

        if (deepThinkToggle && deepThinkSpan) {
            deepThinkToggle.addEventListener('click', () => {
                isDeepThinkOn = !isDeepThinkOn;
                deepThinkSpan.textContent = `🧠 Deep Think: ${isDeepThinkOn ? 'ON' : 'OFF'}`;
                deepThinkToggle.classList.toggle('active', isDeepThinkOn);
                console.log('Deep Think Toggled:', isDeepThinkOn);
            });
        }

        if (messageInput) {
             messageInput.addEventListener('input', () => {
                const maxHeight = 100; // Corresponds to max-height in CSS
                messageInput.style.height = 'auto';
                const newHeight = Math.min(messageInput.scrollHeight, maxHeight);
                messageInput.style.height = newHeight + 'px';
            });
        }
    }

    function loadApiKeys() {
        if (typeof API_CONFIG !== 'undefined' && typeof getValidApiKeys === 'function') {
            validApiKeys = getValidApiKeys();
            console.log(`Loaded ${validApiKeys.length} valid API keys.`);
            if (validApiKeys.length === 0) {
                console.error("No valid API keys found in api-config.js");
            }
        } else {
            console.error("API_CONFIG or getValidApiKeys function not found. Ensure api-config.js is loaded correctly.");
        }
    }

    function updateApiStatusDisplay(activeIndex = -1, failedIndex = -1) {
        if (!apiStatusContainer || typeof API_CONFIG === 'undefined') return;

        apiStatusContainer.innerHTML = ''; // Clear previous status
        const allKeys = API_CONFIG.GEMINI_API_KEYS;

        if (allKeys.length === 0) {
            apiStatusContainer.innerHTML = '<div class="api-item"><span>No API Keys Configured</span></div>';
            return;
        }

        allKeys.forEach((key, index) => {
            const item = document.createElement('div');
            item.classList.add('api-item');
            const isValidFormat = typeof validateApiKey === 'function' && validateApiKey(key);
            let statusClass = 'api-unused';
            let statusText = 'Ready';

            if (!isValidFormat) {
                statusClass = 'api-failed';
                statusText = 'Invalid Format';
            } else if (index === activeIndex) {
                statusClass = 'api-active';
                statusText = 'Active';
            } else if (index === failedIndex) {
                statusClass = 'api-failed';
                statusText = 'Failed';
            }

            item.innerHTML = `
                <span>API Key ${index + 1}</span>
                <span><span class="api-status-indicator ${statusClass}"></span>${statusText}</span>
            `;
            apiStatusContainer.appendChild(item);
        });
    }

    function handleSendMessage() {
        if (isSending) return; // Prevent multiple simultaneous requests
        const messageText = messageInput.value.trim();
        if (!messageText) return;

        if (validApiKeys.length === 0) {
            displayErrorMessage("Không có API key hợp lệ nào được cấu hình. Vui lòng kiểm tra tệp api-config.js.");
            return;
        }

        isSending = true;
        sendButton.disabled = true;
        sendButton.innerHTML = '<span class="loading"></span>'; // Show loading indicator

        displayUserMessage(messageText);
        messageInput.value = '';
        messageInput.style.height = 'auto'; // Reset height

        // Add user message to history
        conversationHistory.push({ role: "user", parts: [{ text: messageText }] });

        // Prepare for AI response
        const aiMessageDiv = displayAiMessagePlaceholder();

        // Call the API
        callGeminiApi(messageText, aiMessageDiv);
    }

    function displayUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user');
        const escapedText = escapeHtml(text);
        messageDiv.innerHTML = `
            <div class="message-avatar">U</div>
            <div class="message-content">${escapedText}</div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function displayAiMessagePlaceholder() {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'ai');
        messageDiv.innerHTML = `
            <div class="message-avatar">AI</div>
            <div class="message-content">
                ${isDeepThinkOn ? '<div class="thinking-process"><h4>🧠 Suy nghĩ sâu...</h4><p>Đang phân tích và tổng hợp thông tin...</p></div>' : ''}
                <span class="loading"></span>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        return messageDiv; // Return the div to update it later
    }

    function updateAiMessage(aiMessageDiv, text, thinkingSteps = null) {
        const aiContentDiv = aiMessageDiv.querySelector('.message-content');
        if (!aiContentDiv) return;

        // Process markdown and code blocks
        const formattedText = formatResponse(text);

        let thinkingHtml = '';
        if (isDeepThinkOn && thinkingSteps) {
             thinkingHtml = `<div class="thinking-process"><h4>🧠 Quá trình suy nghĩ:</h4><p>${escapeHtml(thinkingSteps)}</p></div>`;
        }

        aiContentDiv.innerHTML = thinkingHtml + formattedText;

        // Add copy buttons to code blocks
        aiContentDiv.querySelectorAll('.code-block').forEach(block => {
            const copyBtn = block.querySelector('.copy-btn');
            const codeContent = block.querySelector('.code-content');
            if (copyBtn && codeContent) {
                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(codeContent.textContent || codeContent.innerText)
                        .then(() => {
                            copyBtn.textContent = 'Đã sao chép!';
                            setTimeout(() => { copyBtn.textContent = 'Sao chép'; }, 2000);
                        })
                        .catch(err => {
                            console.error('Lỗi sao chép:', err);
                            copyBtn.textContent = 'Lỗi';
                        });
                });
            }
        });
        scrollToBottom();
    }

    function displayErrorMessage(errorText, aiMessageDiv = null) {
        console.error("Error:", errorText);
        const messageToUpdate = aiMessageDiv || displayAiMessagePlaceholder(); // Use placeholder or create new one
        const aiContentDiv = messageToUpdate.querySelector('.message-content');
        if (aiContentDiv) {
             aiContentDiv.innerHTML = `<span style="color: #f44336;">⚠️ Lỗi: ${escapeHtml(errorText)}</span>`;
        }
        scrollToBottom();
    }

    async function callGeminiApi(userMessage, aiMessageDiv, retryCount = 0) {
        const currentApiKey = validApiKeys[currentApiKeyIndex];
        updateApiStatusDisplay(currentApiKeyIndex); // Mark current key as active

        console.log(`Attempting API call with Key ${currentApiKeyIndex + 1}`);

        // --- Prepare Request Data ---
        const requestBody = {
            contents: conversationHistory, // Send entire history
            generationConfig: {
                temperature: parseFloat(tempInput.value) || API_CONFIG.DEFAULT_SETTINGS.temperature,
                maxOutputTokens: API_CONFIG.DEFAULT_SETTINGS.maxOutputTokens,
                topP: API_CONFIG.DEFAULT_SETTINGS.topP,
                topK: API_CONFIG.DEFAULT_SETTINGS.topK
            },
            // Add safety settings if needed
            // safetySettings: [...] 
        };

        // Add knowledge base context if available
        if (typeof KNOWLEDGE_BASE !== 'undefined' && KNOWLEDGE_BASE.CONTENT) {
            // Simple approach: prepend knowledge to the latest user message's context
            // More sophisticated methods could involve vector search or selective injection
            const lastUserContent = requestBody.contents[requestBody.contents.length - 1];
            if (lastUserContent.role === 'user') {
                 lastUserContent.parts[0].text = `${KNOWLEDGE_BASE.CONTENT}\n\n--- Câu hỏi của người dùng ---\n${lastUserContent.parts[0].text}`;
            }
            console.log("Added knowledge base context.");
        }
        
        // Add Deep Think instruction if enabled
        if (isDeepThinkOn) {
             const lastUserContent = requestBody.contents[requestBody.contents.length - 1];
             if (lastUserContent.role === 'user') {
                 lastUserContent.parts[0].text += "\n\n--- Yêu cầu bổ sung ---\nHãy suy nghĩ từng bước (think step-by-step) trước khi đưa ra câu trả lời cuối cùng.";
             }
             console.log("Added Deep Think instruction.");
        }

        try {
            const response = await fetch(`${API_CONFIG.GEMINI_API_URL}?key=${currentApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    // Handle cases where the error response is not JSON
                    errorData = { error: { message: `HTTP error ${response.status} - ${response.statusText}` } };
                }
                const errorMessage = errorData?.error?.message || `Lỗi API không xác định (HTTP ${response.status})`;
                console.error(`API Error (Key ${currentApiKeyIndex + 1}):`, errorMessage, errorData);
                throw new Error(errorMessage); // Throw to trigger retry/fallback
            }

            const data = await response.json();
            console.log(`API Response (Key ${currentApiKeyIndex + 1}):`, data);

            // --- Process Successful Response ---
            let aiResponseText = "";
            let thinkingSteps = null;
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                aiResponseText = data.candidates[0].content.parts[0].text;
                
                // Basic check for step-by-step thinking pattern
                const stepByStepMarker = "\n\nBước"; // Or a more specific marker if the model uses one
                const thinkEndMarker = "\n\nCâu trả lời cuối cùng:"; // Example marker
                const stepIndex = aiResponseText.indexOf(stepByStepMarker);
                const endIndex = aiResponseText.indexOf(thinkEndMarker);
                
                if (isDeepThinkOn && stepIndex !== -1) {
                    if (endIndex !== -1 && endIndex > stepIndex) {
                        thinkingSteps = aiResponseText.substring(stepIndex, endIndex).trim();
                        aiResponseText = aiResponseText.substring(endIndex + thinkEndMarker.length).trim();
                    } else {
                        // If no clear end marker, assume the whole thing might be thinking process + answer
                        // Or just display it all, letting the user see the steps
                        thinkingSteps = "(Hiển thị toàn bộ quá trình suy nghĩ và câu trả lời)"; 
                    }
                }
                
            } else {
                aiResponseText = "Xin lỗi, tôi không thể tạo phản hồi vào lúc này.";
                console.warn("API response format unexpected:", data);
            }

            // Add AI response to history
            conversationHistory.push({ role: "model", parts: [{ text: aiResponseText }] });

            updateAiMessage(aiMessageDiv, aiResponseText, thinkingSteps);
            resetSendButton();
            updateApiStatusDisplay(currentApiKeyIndex); // Keep current key as active

        } catch (error) {
            console.error(`Error with API Key ${currentApiKeyIndex + 1}:`, error);
            updateApiStatusDisplay(-1, currentApiKeyIndex); // Mark current key as failed

            // --- Retry & Fallback Logic ---
            const nextKeyIndex = (currentApiKeyIndex + 1) % validApiKeys.length;
            if (nextKeyIndex !== currentApiKeyIndex && retryCount < API_CONFIG.MAX_RETRIES * validApiKeys.length) {
                // Try next key
                console.warn(`API Key ${currentApiKeyIndex + 1} failed. Trying next key (${nextKeyIndex + 1}).`);
                currentApiKeyIndex = nextKeyIndex;
                // Add a small delay before retrying with the next key
                setTimeout(() => {
                    callGeminiApi(userMessage, aiMessageDiv, retryCount + 1);
                }, API_CONFIG.RETRY_DELAY);
            } else {
                // All keys failed or max retries reached
                displayErrorMessage(`Đã thử tất cả API keys nhưng không thành công. Lỗi cuối cùng: ${error.message}`, aiMessageDiv);
                resetSendButton();
            }
        }
    }

    function resetSendButton() {
        isSending = false;
        sendButton.disabled = false;
        sendButton.innerHTML = '<span>Gửi</span>';
    }

    function scrollToBottom() {
        // Use setTimeout to ensure the DOM has updated before scrolling
        setTimeout(() => {
             chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 0);
    }

    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
     }

    // Basic Markdown and Code Block Formatting
    function formatResponse(text) {
        let html = text;

        // 1. Escape HTML first to prevent injection via markdown
        html = escapeHtml(html);

        // 2. Process Code Blocks (```lang\n code \n```)
        html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'plaintext';
            // Double-escape needed if you render HTML within HTML attribute or JS string later, but here we directly insert
            const escapedCode = code; // Already escaped HTML special chars
            return `<div class="code-block">
                        <div class="code-header">
                            <span class="code-language">${escapeHtml(language)}</span>
                            <button class="copy-btn">Sao chép</button>
                        </div>
                        <pre><code class="language-${escapeHtml(language)} code-content">${escapedCode}</code></pre>
                    </div>`;
        });
        
        // 3. Process Inline Code (`code`)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // 4. Process Bold (**text** or __text__)
        html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([\s\S]+?)__/g, '<strong>$1</strong>');

        // 5. Process Italics (*text* or _text_)
        html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^\_]+)_/g, '<em>$1</em>');
        
        // 6. Process Strikethrough (~~text~~)
        html = html.replace(/~~([\s\S]+?)~~/g, '<del>$1</del>');

        // 7. Process Basic Unordered Lists (* item or - item)
        // Note: This is a simplified version, doesn't handle nested lists well.
        html = html.replace(/^\s*[-*]\s+(.*)/gm, '<ul><li>$1</li></ul>');
        // Collapse multiple <ul> tags into one
        html = html.replace(/<\/ul>\s*<ul>/g, '');

        // 8. Process Basic Ordered Lists (1. item)
        html = html.replace(/^\s*\d+\.\s+(.*)/gm, '<ol><li>$1</li></ol>');
        // Collapse multiple <ol> tags into one
        html = html.replace(/<\/ol>\s*<ol>/g, '');

        // 9. Process Line Breaks (convert newline characters to <br>)
        // Important: Do this last, especially after list processing
        html = html.replace(/\n/g, '<br>');

        return html;
    }

});

