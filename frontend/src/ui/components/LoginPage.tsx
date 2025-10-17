import React, { useState } from 'react';
import { colors, spacing, typography, borderRadius, buttonStyles, inputStyles } from '../styles';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If any field has content, proceed to login
    if (email.trim() || password.trim()) {
      setIsLoading(true);
      
      // Simulate a brief loading state
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: typography.fontFamily,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
        `,
        zIndex: 1,
      }} />

      {/* Login Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: spacing.xl,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 2,
        transform: 'translateY(0)',
        transition: 'all 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: spacing.xl,
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: spacing.md,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            🎨
          </div>
          <h1 style={{
            margin: 0,
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: spacing.sm,
          }}>
            AI Design Copilot
          </h1>
          <p style={{
            margin: 0,
            fontSize: typography.fontSize.sm,
            color: colors.textSecondary,
            lineHeight: typography.lineHeight.relaxed,
          }}>
            Your intelligent design assistant for Figma
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: spacing.lg }}>
            <label style={{
              display: 'block',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: colors.textPrimary,
              marginBottom: spacing.xs,
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email address"
              style={{
                ...inputStyles.base,
                width: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.fontSize.sm,
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #667eea';
                e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(102, 126, 234, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              }}
            />
          </div>

          <div style={{ marginBottom: spacing.xl }}>
            <label style={{
              display: 'block',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: colors.textPrimary,
              marginBottom: spacing.xs,
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              style={{
                ...inputStyles.base,
                width: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                padding: `${spacing.md} ${spacing.lg}`,
                fontSize: typography.fontSize.sm,
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid #667eea';
                e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2)';
                e.target.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(102, 126, 234, 0.2)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...buttonStyles.primary,
              width: '100%',
              background: isLoading 
                ? 'linear-gradient(135deg, #a8a8a8 0%, #888888 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: `${spacing.md} ${spacing.lg}`,
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            {isLoading ? (
              <>
                <span>⏳</span>
                Signing In...
              </>
            ) : (
              <>
                <span>🚀</span>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: spacing.lg,
          paddingTop: spacing.lg,
          borderTop: '1px solid rgba(102, 126, 234, 0.1)',
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            fontSize: typography.fontSize.xs,
            color: colors.textTertiary,
            lineHeight: typography.lineHeight.relaxed,
          }}>
            Enter any information above and press Enter to continue
          </p>
        </div>
      </div>

      {/* Features Preview */}
      <div style={{
        position: 'absolute',
        bottom: spacing.xl,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: spacing.lg,
        zIndex: 2,
      }}>
        {[
          { icon: '🤖', label: 'AI Chat' },
          { icon: '📋', label: 'Design Standards' },
          { icon: '💬', label: 'Feedback Management' },
          { icon: '🎫', label: 'Jira Integration' },
        ].map((feature, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.xs,
              padding: spacing.md,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '20px' }}>{feature.icon}</span>
            <span style={{
              fontSize: typography.fontSize.xs,
              color: 'white',
              fontWeight: typography.fontWeight.medium,
            }}>
              {feature.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;
