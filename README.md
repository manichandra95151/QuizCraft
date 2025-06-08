# 🧠 QuizCraft

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/AI_Powered-FF6B6B?style=for-the-badge&logo=brain&logoColor=white" alt="AI Powered" />
</div>



<div align="center">
  <h3>🚀 AI-Powered Summary, Mcq & Fill in the blanks Generator</h3>
  <p>Transform any context/article into summaries, MCQs, and fill-in-the-blanks exercises</p>
</div>


## ✨ Features

### 🎯 **Core Functionality**
- **📝 Smart Summarization** - Generate concise, meaningful summaries from any text
- **❓ MCQ Generation** - Create exactly 4 multiple-choice questions with smart difficulty distribution
- **📋 Fill-in-the-Blanks** - Generate 4 strategic fill-in-the-blank exercises for active learning
- **📄 Export Options** - Download results as PDF or Word documents

### 🎨 **User Experience**
- **🌓 Dark/Light Theme** - Toggle between themes for comfortable studying
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Generation** - Live progress indicators during content generation
- **📁 File Upload** - Support for .txt file uploads
- **🎭 Beautiful UI** - Modern, clean interface with smooth animations

### 🤖 **AI Technology**
- **🧠 In-Browser AI** - Powered by Transformers.js for privacy and speed
- **🔄 Advanced Algorithms** - Intelligent content analysis and question generation
- **📊 Context-Aware** - Generates relevant questions based on text content

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manichandra95151/QuizCraft.git
   cd QuizCraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

---

## 🎮 How to Use

### 1. **Input Your Content**
- 📝 Paste text directly into the input area
- 📁 Upload a `.txt` file using the upload button
- ✅ Minimum 100 characters recommended for best results

### 2. **Generate Study Materials**
- 🚀 Click the "Generate" button
- ⏳ Watch the progress as AI processes your content
- 📊 View real-time generation status for each component

### 3. **Review & Export**
- 📖 Review generated summaries, MCQs, and fill-in-the-blanks
- 💾 Download as PDF or Word document
- 🎨 Switch themes for comfortable reading

---

## 🛠️ Technology Stack

### **Frontend**
- **⚛️ React 18** - Modern React with hooks and context
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🎭 Lucide React** - Beautiful, customizable icons
- **📱 Responsive Design** - Mobile-first approach

### **AI & Processing**
- **🤖 Transformers.js** - In-browser machine learning
- **📝 Xenova Models** - Pre-trained language models
  - `distilbart-cnn-12-6` - Text summarization
  - `flan-t5-base` - Question generation
  - `distilroberta-base` - Fill-in-the-blank creation

### **Export & Utilities**
- **📄 jsPDF** - PDF generation
- **📝 docx** - Word document creation
- **🎯 Advanced Algorithms** - Custom text analysis and processing

---

## 📁 Project Structure

```
QuizCraft/
├── 📁 public/
│   ├── index.html
│   └── favicon.ico
├── 📁 src/
│   ├── 📁 components/
│   │   ├── Header.js
│   │   ├── InputSection.js
│   │   ├── ResultsSection.js
│   │   ├── card.js
│   │   ├── downloadContent.js
│   │   ├── genrationLoader.js
│   │   └── loading.js
│   ├── 📁 context/
│   │   └── AppContext.js
│   ├── 📁 utils/
│   │   └── aiUtils.js
│   │
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

---

## 🎯 Key Features Breakdown

### **📝 Smart Summarization**
- Extractive and abstractive summarization
- Context-aware content selection
- Fallback mechanisms for reliability

### **❓ MCQ Generation**
- **Factual Questions** (40%) - Direct information recall
- **Conceptual Questions** (30%) - Understanding of ideas
- **Analytical Questions** (30%) - Critical thinking
- Smart distractor generation for realistic options

### **📋 Fill-in-the-Blanks**
- Strategic word selection based on importance
- Context preservation for meaningful exercises
- Answer key generation and storage

---

## 🎨 UI/UX Highlights

### **🌟 Modern Design**
- Clean, minimalist interface
- Gradient accents and smooth transitions
- Card-based layout for organized content

### **🌓 Theme Support**
- Light and dark mode toggle
- Consistent theming across all components
- Eye-friendly color schemes

### **📱 Responsive Layout**
- Mobile-first design approach
- Adaptive grid system
- Touch-friendly interactions

---

## 🔧 Configuration

### **AI Model Settings**
```javascript
// Customize in src/utils/aiUtils.js
const MODEL_CONFIG = {
  summarizer: 'Xenova/distilbart-cnn-12-6',
  questionGenerator: 'Xenova/flan-t5-base',
  fillMask: 'Xenova/distilroberta-base'
};
```

### **Generation Parameters**
```javascript
// Adjust generation settings
const GENERATION_CONFIG = {
  mcqCount: 4,
  fillBlankCount: 4,
  summaryMaxLength: 150,
  minTextLength: 100
};
```

---

## 🙏 Acknowledgments

- **🤖 Hugging Face** - For the amazing Transformers.js library
- **⚛️ React Team** - For the incredible React framework
- **🎨 Tailwind CSS** - For the utility-first CSS framework
- **🎭 Lucide** - For the beautiful icon library

---

<div align="center">
  <h3>🌟 Star this repository if you found it helpful! 🌟</h3>
  <p>Made with ❤️ by <a href="https://github.com/manichandra95151">Mani Chandra</a></p>
</div>

---


*QuizCraft - Transforming learning through AI-powered Generation* ✨
