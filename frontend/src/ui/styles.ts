// Figma Design Tokens and Shared Styles
export const colors = {
  // Primary colors
  primary: '#18A0FB',
  primaryHover: '#0D8CE8',
  primaryActive: '#0B7BC7',
  
  // Neutral colors
  white: '#FFFFFF',
  gray50: '#F8F9FA',
  gray100: '#F0F0F0',
  gray200: '#E5E5E5',
  gray300: '#CCCCCC',
  gray400: '#999999',
  gray500: '#666666',
  gray600: '#333333',
  gray900: '#000000',
  
  // Semantic colors
  success: '#00C851',
  warning: '#FF8800',
  error: '#FF4444',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#F0F0F0',
  
  // Border colors
  border: '#E5E5E5',
  borderHover: '#CCCCCC',
  borderFocus: '#18A0FB',
  
  // Text colors
  textPrimary: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 4px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
};

// Common component styles
export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
    color: colors.textInverse,
    border: 'none',
    borderRadius: borderRadius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: colors.primaryHover,
    },
    '&:active': {
      backgroundColor: colors.primaryActive,
    },
    '&:disabled': {
      backgroundColor: colors.gray300,
      cursor: 'not-allowed',
    },
  },
  secondary: {
    backgroundColor: colors.white,
    color: colors.textPrimary,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.borderHover,
    },
    '&:active': {
      backgroundColor: colors.backgroundTertiary,
    },
  },
};

export const inputStyles = {
  base: {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    transition: 'border-color 0.2s ease',
    '&:focus': {
      outline: 'none',
      borderColor: colors.borderFocus,
    },
    '&:hover': {
      borderColor: colors.borderHover,
    },
  },
};

export const cardStyles = {
  base: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    boxShadow: shadows.sm,
  },
};

export const tabStyles = {
  container: {
    display: 'flex',
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.background,
  },
  tab: {
    padding: `${spacing.sm} ${spacing.md}`,
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: colors.textPrimary,
      backgroundColor: colors.backgroundSecondary,
    },
    '&.active': {
      color: colors.primary,
      borderBottomColor: colors.primary,
    },
  },
};
