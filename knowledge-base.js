// ================================
// Knowledge Base File
// File: knowledge-base.js
// ================================
// Hướng dẫn sử dụng:
// 1. Thêm kiến thức bổ sung vào phần CONTENT
// 2. Có thể thêm nhiều chủ đề khác nhau
// 3. AI sẽ sử dụng thông tin này để trả lời chính xác hơn
// ================================

const KNOWLEDGE_BASE = {
    // Kiến thức chính - sẽ được thêm vào mọi câu hỏi
    CONTENT: `
    === KIẾN THỨC BỔ SUNG CHO AI CUTE ===
    
    🤖 THÔNG TIN CƠ BAN:
    - Tên: AI Cute
    - Phiên bản: Được cập nhật tự động từ version.js
    - Tạo bởi: [Tên của bạn]
    - Chức năng: Chatbot thông minh với Gemini API
    
    🌟 TÍNH NĂNG ĐặC BIỆT:
    - Deep Think Mode: Suy luận kỹ lưỡng trước khi trả lời
    - Multi-API Support: Tự động chuyển đổi API khi gặp lỗi  
    - Code Display: Hiển thị code đẹp với nút sao chép
    - Knowledge Base: Tích hợp kiến thức bổ sung từ file này
    
    💡 CÁCH TRUY CẬP:
    - Website: [URL website của bạn]
    - GitHub: [Link GitHub repo của bạn]
    - Contact: [Thông tin liên hệ]
    
    📚 KIẾN THỨC CHUYÊN MÔN:
    
    == Lập trình ==
    - Hỗ trợ đa ngôn ngữ: JavaScript, Python, Java, C++, etc.
    - Framework phổ biến: React, Vue, Angular, Django, Flask
    - Database: MySQL, PostgreSQL, MongoDB, Redis
    - DevOps: Docker, Kubernetes, CI/CD, AWS, GCP
    
    == AI & Machine Learning ==
    - Deep Learning frameworks: TensorFlow, PyTorch, Keras
    - NLP libraries: spaCy, NLTK, Transformers
    - Computer Vision: OpenCV, PIL, scikit-image  
    - MLOps: MLflow, Kubeflow, Weights & Biases
    
    == Web Development ==
    - Frontend: HTML5, CSS3, JavaScript ES6+, TypeScript
    - CSS Frameworks: Tailwind CSS, Bootstrap, Material-UI
    - Backend: Node.js, Express, Fastify, Nest.js
    - API: REST, GraphQL, WebSocket, gRPC
    
    == Mobile Development ==
    - React Native, Flutter, Ionic
    - Native: Swift (iOS), Kotlin/Java (Android)
    - Cross-platform tools và best practices
    
    == Data Science ==
    - Python libraries: Pandas, NumPy, Matplotlib, Seaborn
    - Statistical analysis: SciPy, Statsmodels
    - Visualization: Plotly, Bokeh, D3.js
    - Big Data: Spark, Hadoop, Kafka
    
    ⚡ QUY TẮC TRẢ LỜI:
    1. Luôn thân thiện và hữu ích
    2. Trả lời bằng tiếng Việt trừ khi được yêu cầu khác
    3. Cung cấp ví dụ thực tế khi có thể
    4. Giải thích rõ ràng, dễ hiểu
    5. Thừa nhận khi không biết và đề xuất tìm hiểu thêm
    
    🔄 CẬP NHẬT:
    - File này được cập nhật thường xuyên
    - Kiểm tra version để biết thông tin mới nhất
    - Đóng góp ý kiến để cải thiện AI Cute
    `,
    
    // Kiến thức theo chủ đề cụ thể
    TOPICS: {
        programming: {
            languages: ["JavaScript", "Python", "Java", "C++", "Go", "Rust"],
            frameworks: ["React", "Vue", "Angular", "Django", "Flask", "Spring"],
            tools: ["Git", "Docker", "Kubernetes", "Jenkins", "VS Code"]
        },
        
        ai_ml: {
            frameworks: ["TensorFlow", "PyTorch", "Keras", "Scikit-learn"],
            concepts: ["Neural Networks", "Deep Learning", "NLP", "Computer Vision"],
            tools: ["Jupyter", "Google Colab", "Weights & Biases", "MLflow"]
        },
        
        web_dev: {
            frontend: ["HTML5", "CSS3", "JavaScript", "TypeScript", "Sass"],
            backend: ["Node.js", "Express", "FastAPI", "Django", "Ruby on Rails"],
            databases: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite"]
        }
    },
    
    // Prompt templates cho các tình huống khác nhau
    PROMPTS: {
        coding_help: "Tôi sẽ giúp bạn với vấn đề lập trình này. Hãy để tôi phân tích và đưa ra giải pháp tốt nhất:",
        explain_concept: "Để giải thích khái niệm này một cách dễ hiểu, tôi sẽ:",
        troubleshoot: "Để khắc phục sự cố này, chúng ta cần kiểm tra:",
        best_practices: "Dựa trên kinh nghiệm và best practices, tôi khuyên bạn:"
    }
};

// Hàm lấy kiến thức theo chủ đề
function getTopicKnowledge(topic) {
    return KNOWLEDGE_BASE.TOPICS[topic] || null;
}

// Hàm lấy prompt template
function getPromptTemplate(type) {
    return KNOWLEDGE_BASE.PROMPTS[type] || "";
}

// Hàm tìm kiếm trong knowledge base
function searchKnowledge(query) {
    const content = KNOWLEDGE_BASE.CONTENT.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Tìm kiếm đơn giản
    if (content.includes(queryLower)) {
        return "Tôi tìm thấy thông tin liên quan trong knowledge base của tôi.";
    }
    
    return null;
}

// Export để sử dụng
if (typeof window !== 'undefined') {
    window.KNOWLEDGE_BASE = KNOWLEDGE_BASE;
    window.getTopicKnowledge = getTopicKnowledge;
    window.getPromptTemplate = getPromptTemplate;
    window.searchKnowledge = searchKnowledge;
}
