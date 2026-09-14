# 📄 PDF Document Q&A Chatbot

A full-stack Retrieval-Augmented Generation (RAG) web application built with **FastAPI**, **LangChain**, **FAISS**, **Google Gemini**, and **React**. 

Upload PDF documents and ask questions about their content in an interactive, session-aware chat interface.

---

##  Features

- **PDF Upload & Processing**: Automatic text extraction and chunking (`RecursiveCharacterTextSplitter`).
- **Local Embeddings**: Fast, free vector embeddings using HuggingFace `sentence-transformers/all-MiniLM-L6-v2`.
- **Multi-Document FAISS Store**: Persistent vector database stored on disk, supporting similarity search across all uploaded documents.
- **Conversational Memory**: Session-based chat history using LangChain's `RunnableWithMessageHistory` and `InMemoryChatMessageHistory`.
- **Gemini LLM Integration**: Powered by Google's `gemini-3.6-flash` model for high-accuracy answers grounded in retrieved context.
- **React UI**: Modern two-column interface with document status, typing animations, and session management.

---

##  Tech Stack

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

##  Project Structure

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