import styled, { createGlobalStyle } from 'styled-components';

// Palette de couleurs inspirée d'Overleaf
export const colors = {
  // Couleurs principales
  primary: '#1E88E5',        // Bleu principal (vivant et moderne)
  primaryLight: '#42A5F5',   // Bleu plus clair
  primaryDark: '#1565C0',    // Bleu foncé
  
  // Couleurs secondaires
  secondary: '#F5F7FA',      // Gris très clair pour les backgrounds
  accent: '#E74C3C',         // Rouge pour les actions importantes
  warning: '#F39C12',        // Orange pour les alertes
  success: '#27AE60',        // Vert succès
  info: '#3498DB',           // Bleu information
  
  // Couleurs neutres
  white: '#FFFFFF',
  lightGray: '#F8F9FA',
  gray: '#E9ECEF',
  mediumGray: '#6C757D',
  darkGray: '#495057',
  black: '#212529',
  
  // Couleurs de texte
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  textMuted: '#95A5A6',
  
  // Couleurs de bordure
  border: '#DEE2E6',
  borderLight: '#E9ECEF',
  borderDark: '#ADB5BD',
  
  // Couleurs de fond
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundDark: '#2C3E50',
  
  // États
  hover: '#F1F3F4',
  active: '#E8F5E8',
  disabled: '#E9ECEF',
  
  // Ombres
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
};

// Système de typographie
export const typography = {
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    code: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Consolas, monospace',
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// Système d'espacement
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
  '5xl': '6rem',    // 96px
};

// Système de border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
};

// Système d'ombres
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Breakpoints responsive
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Transitions
export const transitions = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  bounce: '200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// Global Styles
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${typography.fontFamily.primary};
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.normal};
    line-height: ${typography.lineHeight.normal};
    color: ${colors.textPrimary};
    background-color: ${colors.backgroundSecondary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${typography.fontFamily.heading};
    font-weight: ${typography.fontWeight.semibold};
    line-height: ${typography.lineHeight.tight};
    color: ${colors.textPrimary};
    margin-bottom: ${spacing.md};
  }

  h1 { font-size: ${typography.fontSize['4xl']}; }
  h2 { font-size: ${typography.fontSize['3xl']}; }
  h3 { font-size: ${typography.fontSize['2xl']}; }
  h4 { font-size: ${typography.fontSize.xl}; }
  h5 { font-size: ${typography.fontSize.lg}; }
  h6 { font-size: ${typography.fontSize.base}; }

  p {
    margin-bottom: ${spacing.lg};
    color: ${colors.textSecondary};
  }

  a {
    color: ${colors.primary};
    text-decoration: none;
    transition: color ${transitions.fast};

    &:hover {
      color: ${colors.primaryDark};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all ${transitions.normal};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: 1px solid ${colors.border};
    border-radius: ${borderRadius.md};
    padding: ${spacing.md} ${spacing.lg};
    transition: all ${transitions.fast};

    &:focus {
      outline: none;
      border-color: ${colors.primary};
      box-shadow: 0 0 0 3px rgba(19, 138, 54, 0.1);
    }

    &::placeholder {
      color: ${colors.textMuted};
    }
  }

  /* Scrollbar personnalisée */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.gray};
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.mediumGray};
    border-radius: ${borderRadius.full};

    &:hover {
      background: ${colors.darkGray};
    }
  }

  /* Sélection de texte */
  ::selection {
    background-color: rgba(19, 138, 54, 0.2);
    color: ${colors.textPrimary};
  }

  /* Animation loading */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .animate-pulse { animation: pulse 2s infinite; }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  .animate-slideInLeft { animation: slideInLeft 0.3s ease-out; }
  .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
`;

// Composants de base réutilisables
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${spacing.lg};

  @media (min-width: ${breakpoints.lg}) {
    padding: 0 ${spacing.xl};
  }
`;

export const Card = styled.div<{ $padding?: keyof typeof spacing; $shadow?: keyof typeof shadows }>`
  background: ${colors.white};
  border-radius: ${borderRadius.lg};
  border: 1px solid ${colors.borderLight};
  padding: ${props => spacing[props.$padding || 'xl']};
  box-shadow: ${props => shadows[props.$shadow || 'sm']};
  transition: all ${transitions.normal};

  &:hover {
    box-shadow: ${shadows.md};
  }
`;

export const Button = styled.button<{
  $variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  $size?: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  font-family: ${typography.fontFamily.primary};
  font-weight: ${typography.fontWeight.medium};
  border-radius: ${borderRadius.md};
  transition: all ${transitions.normal};
  text-decoration: none;
  white-space: nowrap;

  ${props => {
    const sizes = {
      sm: `
        padding: ${spacing.sm} ${spacing.md};
        font-size: ${typography.fontSize.sm};
      `,
      md: `
        padding: ${spacing.md} ${spacing.lg};
        font-size: ${typography.fontSize.base};
      `,
      lg: `
        padding: ${spacing.lg} ${spacing.xl};
        font-size: ${typography.fontSize.lg};
      `,
    };
    return sizes[props.$size || 'md'];
  }}

  ${props => {
    const variants = {
      primary: `
        background: ${colors.primary};
        color: ${colors.white};
        border: 1px solid ${colors.primary};

        &:hover {
          background: ${colors.primaryDark};
          border-color: ${colors.primaryDark};
          transform: translateY(-1px);
          box-shadow: ${shadows.md};
        }

        &:active {
          transform: translateY(0);
        }
      `,
      secondary: `
        background: ${colors.gray};
        color: ${colors.textPrimary};
        border: 1px solid ${colors.border};

        &:hover {
          background: ${colors.borderLight};
          transform: translateY(-1px);
        }
      `,
      outline: `
        background: transparent;
        color: ${colors.primary};
        border: 1px solid ${colors.primary};

        &:hover {
          background: ${colors.primary};
          color: ${colors.white};
          transform: translateY(-1px);
        }
      `,
      ghost: `
        background: transparent;
        color: ${colors.primary};
        border: 1px solid transparent;

        &:hover {
          background: ${colors.hover};
        }
      `,
      danger: `
        background: ${colors.accent};
        color: ${colors.white};
        border: 1px solid ${colors.accent};

        &:hover {
          background: #c0392b;
          border-color: #c0392b;
          transform: translateY(-1px);
        }
      `,
    };
    return variants[props.$variant || 'primary'];
  }}

  ${props => props.$fullWidth && `width: 100%;`}

  &:disabled {
    background: ${colors.disabled};
    color: ${colors.textMuted};
    border-color: ${colors.border};
    transform: none;
    box-shadow: none;
  }
`;

export const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: ${spacing.md} ${spacing.lg};
  font-size: ${typography.fontSize.base};
  border: 1px solid ${props => props.$error ? colors.accent : colors.border};
  border-radius: ${borderRadius.md};
  background: ${colors.white};
  transition: all ${transitions.fast};

  &:focus {
    border-color: ${props => props.$error ? colors.accent : colors.primary};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(231, 76, 60, 0.1)' : 'rgba(19, 138, 54, 0.1)'};
  }

  &::placeholder {
    color: ${colors.textMuted};
  }
`;

export const Label = styled.label`
  display: block;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.sm};
`;

export const Flex = styled.div<{
  $direction?: 'row' | 'column';
  $align?: 'start' | 'center' | 'end' | 'stretch';
  $justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  $gap?: keyof typeof spacing;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.$direction || 'row'};
  align-items: ${props => {
    const alignMap = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' };
    return alignMap[props.$align || 'start'];
  }};
  justify-content: ${props => {
    const justifyMap = { 
      start: 'flex-start', 
      center: 'center', 
      end: 'flex-end', 
      between: 'space-between', 
      around: 'space-around' 
    };
    return justifyMap[props.$justify || 'start'];
  }};
  gap: ${props => spacing[props.$gap || 'md']};
  flex-wrap: ${props => props.$wrap ? 'wrap' : 'nowrap'};
`;

export const Grid = styled.div<{
  $columns?: number;
  $gap?: keyof typeof spacing;
}>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 1}, 1fr);
  gap: ${props => spacing[props.$gap || 'lg']};
`;