import React, { useState } from 'react';
import { colors, spacing, typography, buttonStyles } from '../styles';
import { apiClient } from '../../lib/apiClient';

const ImportDocsTab: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      setSaveMessage('Please upload PDF file only.');
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }
    
    // Process only the first file
    await processFiles(pdfFiles[0]);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      setSaveMessage('Please select PDF file only.');
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }
    
    // Process only the first file
    await processFiles(pdfFiles[0]);
  };

  const processFiles = async (file: File) => {
    setIsProcessingFile(true);
    setSaveMessage(null);
    
    // Check file size before processing
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      setSaveMessage(`❌ File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 500MB.`);
      setTimeout(() => setSaveMessage(null), 5000);
      setIsProcessingFile(false);
      return;
    }
    
    // Warn for large files
    if (file.size > 50 * 1024 * 1024) { // 50MB
      setSaveMessage(`⚠️ Large file detected (${(file.size / 1024 / 1024).toFixed(1)}MB). Upload may take a while...`);
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Add timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 400000); // 400 second timeout

      try {
        const response = await apiClient('/api/upload-pdf', {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process PDF files');
        }

        const data = await response.json();
        
        setUploadedFiles(prev => [...prev, file]);
        
        setSaveMessage(`Successfully processed PDF file. Document is now available for AI context.`);
        setTimeout(() => setSaveMessage(null), 5000);
        
      } catch (timeoutError: any) {
        clearTimeout(timeoutId);
        if (timeoutError.name === 'AbortError') {
          setSaveMessage(`⏰ Upload timed out after 400 seconds. The file might be too large or the server is slow.`);
        } else {
          setSaveMessage(`❌ Failed to process PDF file: ${timeoutError.message}`);
        }
        setTimeout(() => setSaveMessage(null), 5000);
      }
      
    } catch (error: any) {
      setSaveMessage(`Failed to process PDF files: ${error.message}`);
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      overflowY: 'auto',
      padding: spacing.lg,
    }}>
      <h2 style={{ 
        margin: `0 0 ${spacing.lg} 0`,
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
      }}>
        📚 Import Internal Documents
      </h2>
      
      <p style={{ 
        margin: `0 0 ${spacing.lg} 0`,
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        lineHeight: typography.lineHeight.relaxed,
      }}>
        Upload your company's internal documents to enhance AI responses with your specific knowledge.
      </p>

      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          padding: spacing.xl,
          border: `2px dashed ${isDragOver ? '#667eea' : 'rgba(102, 126, 234, 0.3)'}`,
          borderRadius: '16px',
          background: isDragOver 
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(15px)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: isDragOver 
            ? '0 8px 32px rgba(102, 126, 234, 0.2)'
            : '0 4px 16px rgba(102, 126, 234, 0.1)',
          marginBottom: spacing.lg,
        }}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: spacing.sm,
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: '24px' }}>
            {isProcessingFile ? '⏳' : isDragOver ? '📁' : '📄'}
          </div>
          <div style={{ 
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: isDragOver ? '#667eea' : colors.textPrimary,
            textAlign: 'center',
          }}>
            {isProcessingFile 
              ? 'Processing document...' 
              : isDragOver 
                ? 'Drop PDF file here' 
                : 'Drag & drop PDF file or click to browse'
            }
          </div>
          <div style={{ 
            fontSize: typography.fontSize.xs,
            color: colors.textSecondary,
            textAlign: 'center',
          }}>
            Upload company guidelines, policies, design systems, and other internal documents
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div style={{ marginBottom: spacing.lg }}>
          <h3 style={{ 
            margin: `0 0 ${spacing.md} 0`,
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}>
            <span>📁</span>
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
          }}>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${spacing.md} ${spacing.lg}`,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flex: 1 }}>
                  <span style={{ fontSize: '20px' }}>📄</span>
                  <div>
                    <div style={{ 
                      fontSize: typography.fontSize.sm,
                      color: colors.textPrimary,
                      fontWeight: typography.fontWeight.medium,
                      marginBottom: '2px',
                    }}>
                      {file.name}
                    </div>
                    <div style={{ 
                      fontSize: typography.fontSize.xs,
                      color: colors.textSecondary,
                    }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  style={{
                    background: 'rgba(220, 53, 69, 0.1)',
                    border: '1px solid rgba(220, 53, 69, 0.2)',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: spacing.sm,
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Message */}
      {saveMessage && (
        <div style={{
          padding: `${spacing.sm} ${spacing.md}`,
          borderRadius: '8px',
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          background: saveMessage.includes('success') 
            ? 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(40, 167, 69, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%)',
          color: saveMessage.includes('success') ? '#28a745' : '#dc3545',
          border: `1px solid ${saveMessage.includes('success') ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)'}`,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          {saveMessage}
        </div>
      )}
    </div>
  );
};

export default ImportDocsTab;
