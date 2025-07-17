# EduEval AI - AI-Powered Answer Evaluation Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2+-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)

## 📖 Overview

EduEval AI is a comprehensive full-stack application that revolutionizes the educational assessment process by leveraging artificial intelligence for automated answer evaluation. The platform combines advanced OCR technology, semantic text analysis, and machine learning models to provide fair, consistent, and instant feedback on student submissions.

### 🎯 Key Features

- **AI-Powered Evaluation**: Uses SBERT (Sentence-BERT) and Google Gemini for semantic similarity analysis
- **Multi-Format Support**: Handles PDF, DOC, DOCX, JPG, JPEG, and PNG files
- **OCR Technology**: Google Cloud Vision API for accurate text extraction from images
- **Dual Dashboard System**: Separate interfaces for educators and students
- **Real-time Processing**: Instant feedback and evaluation results
- **User Authentication**: Secure login and registration system
- **Modern UI**: Responsive design with dark/light theme support

## 🏗️ Architecture

The application follows a modern full-stack architecture:

- **Frontend**: Next.js 15.2+ with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: FastAPI with Python for high-performance API services
- **AI Models**: 
  - SBERT for semantic text similarity
  - Google Gemini for advanced text analysis
  - Google Cloud Vision for OCR capabilities
- **Authentication**: JWT-based authentication system

## 📁 Project Structure

```
ai-eval/
├── README.md                          # Project documentation
├── requirements.txt                   # Root Python dependencies
├── credentials.json                   # Google Cloud credentials
├── preprocess.py                      # Image preprocessing utilities
├── verify.py                          # Verification scripts
├── student_details.xlsx               # Student data
├── *.jpg, *.jpeg                      # Sample images
│
├── backend/                           # FastAPI Backend
│   ├── main.py                        # Main FastAPI application
│   ├── auth_routes.py                 # Authentication endpoints
│   ├── train.py                       # Model training scripts
│   ├── test.py                        # Testing utilities
│   ├── requirements.txt               # Backend dependencies
│   ├── training_data.csv              # Training dataset
│   ├── testing_data.csv               # Testing dataset
│   ├── aerial-vehicle-453306-h5-c1c866d1a4f3.json  # GCP credentials
│   └── model/                         # AI Models
│       └── fine_tuned_sbert/          # Fine-tuned SBERT model
│           ├── config.json
│           ├── model.safetensors
│           ├── tokenizer.json
│           ├── vocab.txt
│           └── 1_Pooling/
│               └── config.json
│
└── frontend/                          # Next.js Frontend
    ├── package.json                   # Frontend dependencies
    ├── next.config.ts                 # Next.js configuration
    ├── tailwind.config.ts             # Tailwind CSS configuration
    ├── tsconfig.json                  # TypeScript configuration
    ├── components.json                # shadcn/ui configuration
    │
    ├── app/                           # Next.js App Router
    │   ├── layout.tsx                 # Root layout
    │   ├── page.tsx                   # Homepage
    │   ├── globals.css                # Global styles
    │   ├── api/                       # API routes
    │   │   └── evaluate/
    │   │       └── route.ts           # Evaluation API endpoint
    │   ├── dashboard/                 # Dashboard pages
    │   │   ├── educator/
    │   │   │   └── page.tsx           # Educator dashboard
    │   │   └── student/
    │   │       └── page.tsx           # Student dashboard
    │   ├── login/
    │   │   └── page.tsx               # Login page
    │   ├── register/
    │   │   └── page.tsx               # Registration page
    │   └── help/
    │       └── page.tsx               # Help page
    │
    ├── components/                    # Reusable components
    │   ├── dashboard-header.tsx
    │   ├── dashboard-shell.tsx
    │   ├── file-uploader.tsx
    │   ├── theme-provider.tsx
    │   ├── theme-toggle.tsx
    │   └── ui/                        # shadcn/ui components
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── input.tsx
    │       ├── textarea.tsx
    │       └── [other ui components]
    │
    ├── hooks/                         # Custom React hooks
    │   ├── use-mobile.ts
    │   └── use-toast.ts
    │
    ├── lib/                           # Utility functions
    │   └── utils.ts
    │
    ├── public/                        # Static assets
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── [other icons]
    │
    └── styles/
        └── globals.css
```

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Python 3.8+**
- **Node.js 18+**
- **npm or yarn**
- **Google Cloud account** (for Vision API)

### 1. Clone the Repository

```bash
git clone https://github.com/roshinjimmy/ai-eval.git
cd ai-eval
```

### 2. Backend Setup

Navigate to the backend directory and set up the Python environment:

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configure Google Cloud Vision API:**
1. Place your Google Cloud service account key file (`aerial-vehicle-453306-h5-c1c866d1a4f3.json`) in the backend directory
2. The application will automatically detect and use this credential file

**Start the backend server:**
```bash
python main.py
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

The application uses the following configuration:

**Backend (`backend/main.py`):**
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google Cloud credentials
- `GEMINI_API_KEY`: Google Gemini API key
- CORS origins: `http://localhost:3000`, `http://localhost:3001`

**Frontend (`frontend/next.config.ts`):**
- API base URL: `http://localhost:8000`

### API Keys Setup

1. **Google Cloud Vision API:**
   - Create a project in Google Cloud Console
   - Enable the Vision API
   - Create a service account and download the JSON key
   - Place the key file in the backend directory

2. **Google Gemini API:**
   - Obtain an API key from Google AI Studio
   - Update the `GEMINI_API_KEY` in `backend/main.py`

## 🔄 Application Workflow

### For Educators

1. **Registration/Login**: Create an educator account or login
2. **Access Dashboard**: Navigate to the educator dashboard
3. **Create Assignment**: Set up new evaluation tasks
4. **Upload Reference Answers**: Provide model answers for comparison
5. **Configure Evaluation**: Set grading criteria and parameters
6. **Review Results**: Monitor student submissions and AI evaluations
7. **Provide Feedback**: Add additional comments or adjustments

### For Students

1. **Registration/Login**: Create a student account or login
2. **Access Dashboard**: Navigate to the student dashboard
3. **View Assignments**: See available tasks and requirements
4. **Upload Answers**: Submit answer sheets (PDF, images, or documents)
5. **AI Processing**: System performs OCR and semantic analysis
6. **Receive Results**: Get instant feedback and scores
7. **Review Feedback**: Understand areas for improvement

### Technical Workflow

1. **File Upload**: User uploads answer sheet through the frontend
2. **OCR Processing**: Google Cloud Vision extracts text from images/PDFs
3. **Text Preprocessing**: Clean and normalize extracted text
4. **Semantic Analysis**: SBERT model compares student answers with reference answers
5. **Scoring**: AI models generate similarity scores and grades
6. **Feedback Generation**: System provides detailed feedback and suggestions
7. **Result Display**: Frontend presents results with visualizations

## 🛠️ API Endpoints

### Backend API (`http://localhost:8000`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload/` | POST | Upload and process files with OCR |
| `/fetch/` | GET | Fetch evaluation data |
| `/api/register` | POST | User registration |
| `/api/evaluate` | POST | Evaluate answer scripts |

### Frontend API Routes (`http://localhost:3000`)

| Route | Description |
|-------|-------------|
| `/api/evaluate` | Internal evaluation processing |

## 🧪 Testing

Run the test suite:

```bash
# Backend tests
cd backend
python test.py

# Frontend tests (if available)
cd frontend
npm test
```

## 🏗️ Development

### Adding New Features

1. **Backend**: Add new endpoints in `main.py` or create new route files
2. **Frontend**: Create new pages in the `app/` directory
3. **Components**: Build reusable components in `components/`
4. **Models**: Train and integrate new AI models in `backend/model/`

### Code Structure

- **Type Safety**: Full TypeScript support in frontend
- **Component Library**: shadcn/ui for consistent UI components
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React hooks and context for state management
- **API Integration**: Axios for HTTP requests

## 🔒 Security Features

- JWT-based authentication
- CORS protection
- Input validation and sanitization
- Secure file upload handling
- Environment variable protection

## 📊 AI Models

### SBERT (Sentence-BERT)
- **Purpose**: Semantic similarity analysis
- **Model**: Fine-tuned sentence-transformers/all-MiniLM-L6-v2
- **Location**: `backend/model/fine_tuned_sbert/`
- **Use Case**: Comparing student answers with reference answers

### Google Gemini
- **Purpose**: Advanced text analysis and evaluation
- **Integration**: Google AI generative AI API
- **Use Case**: Generating detailed feedback and suggestions

### Google Cloud Vision
- **Purpose**: OCR (Optical Character Recognition)
- **Use Case**: Extracting text from uploaded images and PDFs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for inspiring AI-powered education solutions
- **Google Cloud** for Vision API and Gemini AI
- **Hugging Face** for Sentence Transformers
- **Vercel** for Next.js framework
- **FastAPI** for high-performance Python web framework

## 📞 Support

For support, please contact [roshinjimmy@example.com](mailto:roshinjimmy@example.com) or create an issue in the GitHub repository.

---

**Built with ❤️ for modern education**
