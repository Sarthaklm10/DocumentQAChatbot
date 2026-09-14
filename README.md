# 📄 PDF Document Q&A Chatbot

A full-stack Retrieval-Augmented Generation (RAG) web application built with **FastAPI**, **LangChain**, **FAISS**, **Google Gemini**, and **React**. 

Upload PDF documents and ask questions about their content in an interactive, session-aware chat interface.

---

## ✨ Features

- 📁 **PDF Upload & Processing**: Automatic text extraction and chunking (`RecursiveCharacterTextSplitter`).
- 🧠 **Local Embeddings**: Fast, free vector embeddings using HuggingFace `sentence-transformers/all-MiniLM-L6-v2`.
- ⚡ **Multi-Document FAISS Store**: Persistent vector database stored on disk, supporting similarity search across all uploaded documents.
- 💬 **Conversational Memory**: Session-based chat history using LangChain's `RunnableWithMessageHistory` and `InMemoryChatMessageHistory`.
- 🤖 **Gemini LLM Integration**: Powered by Google's `gemini-3.6-flash` model for high-accuracy answers grounded in retrieved context.
- 🎨 **Glassmorphic React UI**: Modern two-column interface with document status, typing animations, and session management.

---

## 🛠️ Tech Stack

### Backend
- **Python 3.10+**
- **FastAPI** & **Uvicorn**
- **SQLAlchemy** & **SQLite** (Document Metadata)
- **LangChain** (RAG Pipeline & Memory)
- **FAISS-CPU** (Vector Database)
- **HuggingFace Embeddings** & **Google Gemini API**

### Frontend
- **React** (Vite)
- **Vanilla CSS** (Glassmorphism & Dark Mode System)
- **Lucide React** (UI Icons)

---

## 📂 Project Structure

```text
DocumentQAChatbot/
├── backend/
│   ├── app/
│   │   ├── db/          # Database connection & SQLAlchemy models
│   │   ├── routes/      # API endpoints (/upload, /ask)
│   │   ├── schemas/     # Pydantic request & response validation
│   │   ├── services/    # PDF chunking, embeddings, FAISS, RAG chain
│   │   └── main.py      # FastAPI entry point & CORS configuration
│   ├── data/
│   │   ├── uploads/     # Uploaded PDF files
│   │   └── vectorstore/ # Persisted FAISS index files (.faiss, .pkl)
│   ├── .env.example     # Environment variables template
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FileUpload.jsx  # PDF upload & status component
    │   │   └── ChatBox.jsx     # Interactive chat & memory component
    │   ├── App.jsx             # Main layout
    │   ├── App.css             # Glassmorphism & layout styles
    │   └── main.jsx
    └── package.json
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Google Gemini API Key ([Get a key here](https://aistudio.google.com/app/apikey))

---

### 2. Backend Setup

```bash
# Navigate to project root
cd DocumentQAChatbot

# Create and activate virtual environment
python -m venv venv
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r backend/requirements.txt

# Create .env file inside backend/
echo "GOOGLE_API_KEY=your_actual_gemini_api_key_here" > backend/.env

# Start FastAPI server
cd backend
uvicorn app.main:app --reload
```

* **FastAPI Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 3. Frontend Setup

In a new terminal window:

```bash
# Navigate to frontend folder
cd DocumentQAChatbot/frontend

# Install node packages
npm install

# Start React dev server
npm run dev
```

* **React App**: [http://localhost:5173](http://localhost:5173)

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/` | `GET` | Welcome health check |
| `/api/upload` | `POST` | Upload PDF file, chunk, embed, and save to FAISS & SQLite |
| `/api/ask` | `POST` | Query the RAG pipeline with question & `session_id` |

---

## 📜 License

MIT License — Feel free to use and adapt this project for your own learning and portfolio!
