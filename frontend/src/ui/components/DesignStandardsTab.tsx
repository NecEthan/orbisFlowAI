import React, { useState, useEffect } from 'react';
import { colors, spacing, typography, borderRadius, buttonStyles, inputStyles, cardStyles } from '../styles';
import { apiClient } from '../../lib/apiClient';

interface DesignStandards {
  bestPractices: string;
  accessibilityStandards: string;
  brandGuidelines: string;
  designSystem: string;
  userExperiencePrinciples: string;
  technicalRequirements: string;
}

const DesignStandardsTab: React.FC = () => {
  const [standards, setStandards] = useState<DesignStandards>({
    bestPractices: '',
    accessibilityStandards: '',
    brandGuidelines: '',
    designSystem: '',
    userExperiencePrinciples: '',
    technicalRequirements: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Load design standards on component mount
  useEffect(() => {
    const loadStandards = async () => {
      try {
        const response = await apiClient('/api/design-standards');
        if (response.ok) {
          const data = await response.json();
          setStandards(data.standards);
        }
      } catch (error) {
        console.error('Failed to load design standards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStandards();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      const response = await apiClient('/api/design-standards', {
        method: 'POST',
        body: JSON.stringify({ standards }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save design standards');
      }

      const data = await response.json();
      setSaveMessage('Design standards saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      setSaveMessage(`Failed to save design standards: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof DesignStandards, value: string) => {
    setStandards(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadExampleStandards = () => {
    setStandards({
      bestPractices: `• Use consistent spacing (8px grid system)
• Maintain 4:1 contrast ratio for text
• Follow mobile-first design approach
• Use semantic HTML elements
• Implement progressive enhancement
• Test across multiple devices and browsers
• Follow WCAG 2.1 AA guidelines
• Use clear, descriptive labels and instructions`,
      accessibilityStandards: `• All interactive elements must be keyboard accessible
• Provide alternative text for all images
• Use proper heading hierarchy (H1, H2, H3)
• Ensure color is not the only way to convey information
• Provide focus indicators for all interactive elements
• Use sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
• Provide text alternatives for audio and video content
• Make sure all functionality is available from a keyboard`,
      brandGuidelines: `• Primary colors: #667eea (blue), #764ba2 (purple)
• Secondary colors: #f8f9fa (light gray), #6c757d (medium gray)
• Typography: Inter font family, 16px base size
• Logo usage: Minimum 24px height, maintain aspect ratio
• Spacing: 8px grid system (8, 16, 24, 32, 48, 64px)
• Border radius: 4px for small elements, 8px for cards, 12px for modals
• Shadows: Subtle elevation with rgba(0,0,0,0.1)`,
      designSystem: `• Components: Buttons, inputs, cards, modals, navigation
• Button styles: Primary (solid), Secondary (outline), Ghost (text only)
• Input states: Default, focus, error, disabled
• Card elevation: 0px (flat), 2px (subtle), 4px (elevated)
• Icon system: 16px, 20px, 24px sizes, consistent stroke width
• Animation: 200ms ease-in-out for micro-interactions
• Breakpoints: Mobile (320px), Tablet (768px), Desktop (1024px)`,
      userExperiencePrinciples: `• Keep it simple and intuitive
• Provide clear feedback for all user actions
• Minimize cognitive load
• Use familiar patterns and conventions
• Provide helpful error messages
• Make the most important actions prominent
• Ensure the interface is responsive and fast
• Design for accessibility from the start`,
      technicalRequirements: `• Support for modern browsers (Chrome, Firefox, Safari, Edge)
• Mobile responsive design (320px to 1920px)
• Performance: <3s load time, <100ms interaction response
• SEO: Semantic HTML, proper meta tags, structured data
• Security: HTTPS only, input validation, XSS protection
• Analytics: Google Analytics 4 integration
• Testing: Unit tests, integration tests, E2E tests
• Documentation: Component library, style guide, API docs`
    });
  };

  const clearAllStandards = () => {
    setStandards({
      bestPractices: '',
      accessibilityStandards: '',
      brandGuidelines: '',
      designSystem: '',
      userExperiencePrinciples: '',
      technicalRequirements: '',
    });
  };

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
      setSaveMessage('Please upload PDF files only.');
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }
    
    await processFiles(pdfFiles);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      setSaveMessage('Please select PDF files only.');
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }
    
    await processFiles(pdfFiles);
  };

  const processFiles = async (files: File[]) => {
    setIsProcessingFile(true);
    setSaveMessage(null);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await apiClient('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process PDF files');
      }

      const data = await response.json();
      
      setUploadedFiles(prev => [...prev, ...files]);
      
      // Auto-populate the form fields with extracted content
      if (data.extractedContent) {
        setStandards(prev => ({
          bestPractices: prev.bestPractices + (data.extractedContent.bestPractices || ''),
          accessibilityStandards: prev.accessibilityStandards + (data.extractedContent.accessibilityStandards || ''),
          brandGuidelines: prev.brandGuidelines + (data.extractedContent.brandGuidelines || ''),
          designSystem: prev.designSystem + (data.extractedContent.designSystem || ''),
          userExperiencePrinciples: prev.userExperiencePrinciples + (data.extractedContent.userExperiencePrinciples || ''),
          technicalRequirements: prev.technicalRequirements + (data.extractedContent.technicalRequirements || ''),
        }));
      }
      
      setSaveMessage(`Successfully processed ${files.length} PDF file(s). Content extracted and auto-populated in the form fields below.`);
      setTimeout(() => setSaveMessage(null), 5000);
      
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

  const standardsSections = [
    {
      id: 'bestPractices',
      title: 'Best Practices',
      icon: '⭐',
      description: 'General design and development best practices',
      placeholder: 'Enter your company\'s design and development best practices...'
    },
    {
      id: 'accessibilityStandards',
      title: 'Accessibility Standards',
      icon: '♿',
      description: 'WCAG guidelines and accessibility requirements',
      placeholder: 'Enter your accessibility standards and requirements...'
    },
    {
      id: 'brandGuidelines',
      title: 'Brand Guidelines',
      icon: '🎨',
      description: 'Colors, typography, spacing, and visual identity',
      placeholder: 'Enter your brand guidelines and visual standards...'
    },
    {
      id: 'designSystem',
      title: 'Design System',
      icon: '🧩',
      description: 'Component library and design tokens',
      placeholder: 'Enter your design system specifications...'
    },
    {
      id: 'userExperiencePrinciples',
      title: 'UX Principles',
      icon: '🎯',
      description: 'User experience and interaction principles',
      placeholder: 'Enter your UX principles and guidelines...'
    },
    {
      id: 'technicalRequirements',
      title: 'Technical Requirements',
      icon: '⚙️',
      description: 'Performance, browser support, and technical specs',
      placeholder: 'Enter your technical requirements and constraints...'
    }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      overflowY: 'auto',
    }}>
      
      {/* Header */}
      <div style={{ 
        padding: spacing.lg,
        borderBottom: `1px solid rgba(102, 126, 234, 0.2)`,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            marginBottom: spacing.md,
          }}>
            <div style={{
              fontSize: '32px',
              padding: spacing.md,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '16px',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.1)',
            }}>
              📋
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                fontSize: typography.fontSize.xl, 
                fontWeight: typography.fontWeight.bold,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: spacing.xs,
              }}>
                Design Standards
              </h3>
              <p style={{ 
                margin: 0,
                fontSize: typography.fontSize.md,
                color: colors.textSecondary,
                opacity: 0.9,
                lineHeight: typography.lineHeight.relaxed,
              }}>
                Configure your company's design standards to get personalized AI responses
              </p>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            marginBottom: spacing.lg,
          }}>
            <div style={{
              fontSize: typography.fontSize.sm,
              color: colors.textSecondary,
              fontWeight: typography.fontWeight.medium,
            }}>
              Configuration Progress:
            </div>
            <div style={{
              flex: 1,
              height: '8px',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '4px',
                width: `${(Object.values(standards).filter(value => value.length > 0).length / 6) * 100}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{
              fontSize: typography.fontSize.sm,
              color: colors.textSecondary,
              fontWeight: typography.fontWeight.medium,
              minWidth: '60px',
              textAlign: 'right',
            }}>
              {Object.values(standards).filter(value => value.length > 0).length}/6
            </div>
          </div>
        </div>
        
        {/* File Upload Section */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
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
            }}
          >
          <input
            type="file"
            accept=".pdf"
            multiple
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
                ? 'Processing PDF files...' 
                : isDragOver 
                  ? 'Drop PDF files here' 
                  : 'Drag & drop PDF files or click to browse'
              }
            </div>
            <div style={{ 
              fontSize: typography.fontSize.xs,
              color: colors.textSecondary,
              textAlign: 'center',
            }}>
              Upload your company's design guidelines, brand standards, or accessibility documents
            </div>
          </div>
          
          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: spacing.lg }}>
              <h4 style={{ 
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
              </h4>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.1)';
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
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 53, 69, 0.2)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 53, 69, 0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          paddingTop: spacing.lg,
        }}>
          <div style={{ 
            display: 'flex', 
            gap: spacing.md, 
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <button
            onClick={loadExampleStandards}
            style={{
              ...buttonStyles.secondary,
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.fontSize.sm,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '8px',
              color: '#667eea',
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.1)';
            }}
          >
            <span>📝</span>
            Load Examples
          </button>
          
          <button
            onClick={clearAllStandards}
            style={{
              ...buttonStyles.secondary,
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.fontSize.sm,
              background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%)',
              border: '2px solid rgba(220, 53, 69, 0.2)',
              borderRadius: '8px',
              color: '#dc3545',
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 8px rgba(220, 53, 69, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(220, 53, 69, 0.15) 0%, rgba(220, 53, 69, 0.1) 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.1)';
            }}
          >
            <span>🗑️</span>
            Clear All
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              ...buttonStyles.primary,
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.fontSize.sm,
              background: isSaving 
                ? 'linear-gradient(135deg, #a8a8a8 0%, #888888 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              fontWeight: typography.fontWeight.semibold,
              color: 'white',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            <span>{isSaving ? '💾' : '💾'}</span>
            {isSaving ? 'Saving...' : 'Save Standards'}
          </button>
          </div>
          
          {/* Save Message */}
          {saveMessage && (
            <div style={{
              marginTop: spacing.md,
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
      </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: spacing.lg,
          position: 'relative',
          zIndex: 2,
        }}>
        {isLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: typography.fontSize.md,
            color: colors.textSecondary,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <span>⏳</span>
              Loading design standards...
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: spacing.lg,
            maxWidth: '1400px',
            margin: '0 auto',
          }}>
            {standardsSections.map((section, index) => (
              <div
                key={section.id}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  padding: spacing.lg,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.2)';
                  e.currentTarget.style.border = '2px solid rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.1)';
                  e.currentTarget.style.border = '2px solid rgba(102, 126, 234, 0.2)';
                }}
              >
                {/* Card Header */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: spacing.md,
                  marginBottom: spacing.lg,
                  paddingBottom: spacing.md,
                  borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                }}>
                  <div style={{ 
                    fontSize: '24px',
                    padding: spacing.sm,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    backdropFilter: 'blur(10px)',
                  }}>
                    {section.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.bold,
                      color: colors.textPrimary,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: spacing.xs,
                    }}>
                      {section.title}
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      fontSize: typography.fontSize.sm, 
                      color: colors.textSecondary,
                      opacity: 0.9,
                      lineHeight: typography.lineHeight.relaxed,
                    }}>
                      {section.description}
                    </p>
                  </div>
                </div>
                
                {/* Text Area */}
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={standards[section.id as keyof DesignStandards]}
                    onChange={(e) => handleInputChange(section.id as keyof DesignStandards, e.target.value)}
                    placeholder={section.placeholder}
                    style={{
                      width: '100%',
                      minHeight: '140px',
                      maxHeight: '300px',
                      resize: 'vertical',
                      fontFamily: typography.fontFamily,
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.1)',
                      fontSize: typography.fontSize.sm,
                      lineHeight: typography.lineHeight.normal,
                      padding: spacing.md,
                      color: colors.textPrimary,
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '2px solid #667eea';
                      e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.25)';
                      e.target.style.background = 'rgba(255, 255, 255, 1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '2px solid rgba(102, 126, 234, 0.2)';
                      e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.1)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                    }}
                  />
                  
                  {/* Character count indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: spacing.sm,
                    right: spacing.sm,
                    fontSize: typography.fontSize.xs,
                    color: colors.textTertiary,
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backdropFilter: 'blur(5px)',
                  }}>
                    {standards[section.id as keyof DesignStandards].length} characters
                  </div>
                </div>
                
                {/* Card Footer */}
                <div style={{
                  marginTop: spacing.md,
                  paddingTop: spacing.sm,
                  borderTop: '1px solid rgba(102, 126, 234, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.textTertiary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                  }}>
                    <span>💡</span>
                    <span>Tip: Be specific and detailed for better AI responses</span>
                  </div>
                  <div style={{
                    fontSize: typography.fontSize.xs,
                    color: standards[section.id as keyof DesignStandards].length > 0 ? colors.success : colors.textTertiary,
                    fontWeight: typography.fontWeight.medium,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                  }}>
                    <span>{standards[section.id as keyof DesignStandards].length > 0 ? '✅' : '⭕'}</span>
                    <span>{standards[section.id as keyof DesignStandards].length > 0 ? 'Configured' : 'Empty'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default DesignStandardsTab;
