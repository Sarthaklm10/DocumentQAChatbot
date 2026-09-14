import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ChatBox from './components/ChatBox';
import { BookOpen, ShieldCheck } from 'lucide-react';
import './App.css';

export default function App() {
  const [sessionId] = useState('session_' + Math.random().toString(36).substring(2, 7));
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUploadSuccess = (fileData) => {
    setUploadedFiles((prev) => [fileData, ...prev]);
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <BookOpen className="logo-icon" />
          <h2>Document QA Chatbot</h2>
          <span className="tech-tag">RAG + FastAPI + FAISS</span>
        </div>
        <div className="navbar-status">
          <ShieldCheck className="status-dot-icon" />
          <span>Backend Connected (127.0.0.1:8000)</span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="main-content">
        <aside className="sidebar">
          <FileUpload onUploadSuccess={handleUploadSuccess} />

          {uploadedFiles.length > 0 && (
            <div className="glass-card document-list-card">
              <h4>Indexed Documents ({uploadedFiles.length})</h4>
              <ul className="doc-list">
                {uploadedFiles.map((doc, idx) => (
                  <li key={idx} className="doc-item">
                    <span className="doc-name">📄 {doc.filename}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <section className="chat-section">
          <ChatBox sessionId={sessionId} />
        </section>
      </main>
    </div>
  );
}
