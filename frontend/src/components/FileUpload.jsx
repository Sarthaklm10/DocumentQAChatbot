import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
        setStatus({ type: 'error', message: 'Please select a valid PDF file.' });
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setStatus({ type: '', message: '' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', message: 'Select a PDF to upload.' });
      return;
    }

    setUploading(true);
    setStatus({ type: 'info', message: 'Uploading & indexing PDF...' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      setStatus({ type: 'success', message: `Indexed "${data.filename}" successfully!` });
      setFile(null);
      if (onUploadSuccess) onUploadSuccess(data);
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Error connecting to backend server.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-card upload-card">
      <div className="card-header">
        <Upload className="header-icon" />
        <div>
          <h3>Upload Document</h3>
          <p className="subtitle">Add a PDF to the chatbot knowledge base</p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="upload-form">
        <label className={`file-dropzone ${file ? 'has-file' : ''}`}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <FileText className="dropzone-icon" />
          <div className="dropzone-text">
            {file ? (
              <span className="file-name">{file.name}</span>
            ) : (
              <span>Click to choose a <strong>PDF file</strong></span>
            )}
          </div>
        </label>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={!file || uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="spin-icon" /> Indexing Document...
            </>
          ) : (
            'Upload & Process PDF'
          )}
        </button>
      </form>

      {status.message && (
        <div className={`status-alert alert-${status.type}`}>
          {status.type === 'success' && <CheckCircle className="status-icon" />}
          {status.type === 'error' && <AlertCircle className="status-icon" />}
          {status.type === 'info' && <Loader2 className="status-icon spin-icon" />}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}
