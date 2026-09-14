import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';

export default function ChatBox({ sessionId }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your Document Q&A assistant. Upload a PDF and ask me any questions about its content.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuestion = input.trim();
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message to UI
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userQuestion, timestamp: timeString },
    ]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userQuestion,
          session_id: sessionId || 'default_session',
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to get answer from server');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `⚠️ Error: ${err.message || 'Could not connect to backend.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: 'Chat history cleared. What would you like to ask next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="glass-card chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-title">
          <Sparkles className="sparkle-icon" />
          <div>
            <h3>Interactive Assistant</h3>
            <span className="session-badge">Session: {sessionId || 'default'}</span>
          </div>
        </div>
        <button
          onClick={handleClearChat}
          className="btn-icon"
          title="Clear Conversation"
        >
          <Trash2 className="icon" />
        </button>
      </div>

      {/* Message List */}
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-wrapper ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
          >
            <div className="avatar">
              {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={`message-bubble ${msg.isError ? 'error-bubble' : ''}`}>
              <div className="message-content">{msg.text}</div>
              <div className="message-time">{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-wrapper bot-msg">
            <div className="avatar">
              <Bot size={18} />
            </div>
            <div className="message-bubble typing-bubble">
              <Loader2 className="spin-icon" size={16} />
              <span>Analyzing documents & generating answer...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="chat-input-form">
        <input
          type="text"
          placeholder="Ask any question about your PDF documents..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="chat-input"
        />
        <button
          type="submit"
          className="btn btn-primary send-btn"
          disabled={!input.trim() || loading}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
