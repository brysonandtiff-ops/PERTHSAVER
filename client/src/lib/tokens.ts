/**
 * Perth Saver Design Tokens
 * Professional Fintech Theme - Generated with OpenAI
 * 
 * RULE: All components MUST use these tokens. No raw hex values allowed.
 */

export const tokens = {
  // ============================================
  // COLOR PALETTE - Professional Fintech Theme v8.0
  // ============================================
  colors: {
    // Primary Brand Colors - Purple/Cyan Theme
    primary: {
      purple: {
        50: '#FAF5FF',
        100: '#F3E8FF',
        200: '#E9D5FF',
        300: '#D8B4FE',
        400: '#C084FC',
        500: '#A855F7', // Primary purple - modern & innovative
        600: '#9333EA',
        700: '#7E22CE',
        800: '#6B21A8',
        900: '#581C87',
        950: '#3B0764',
      },
      cyan: {
        50: '#ECFEFF',
        100: '#CFFAFE',
        200: '#A5F3FC',
        300: '#67E8F9',
        400: '#22D3EE',
        500: '#06B6D4', // Secondary cyan - energy & clarity
        600: '#0891B2',
        700: '#0E7490',
        800: '#155E75',
        900: '#164E63',
        950: '#083344',
      },
      // Legacy aliases for backward compatibility
      blue: {
        50: '#FAF5FF',
        100: '#F3E8FF',
        200: '#E9D5FF',
        300: '#D8B4FE',
        400: '#C084FC',
        500: '#A855F7',
        600: '#9333EA',
        700: '#7E22CE',
        800: '#6B21A8',
        900: '#581C87',
        950: '#3B0764',
      },
      emerald: {
        50: '#E8F5E9',
        100: '#C8E6C9',
        200: '#A5D6A7',
        300: '#81C784',
        400: '#66BB6A',
        500: '#4CAF50',
        600: '#43A047',
        700: '#388E3C',
        800: '#2E7D32',
        900: '#1B5E20',
        950: '#0D3D13',
      },
    },
    
    // Neutral Colors - Dark Theme
    neutral: {
      white: '#ffffff',
      silver: '#B3B3B3',
      slate: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#757575',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#1D1D1D', // Surface background
        950: '#121212', // Page background
      },
      black: '#121212',
      trueDark: '#0A0A0A',
    },
    
    // Semantic Colors
    semantic: {
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#F44336',
      info: '#A855F7',
    },
    
    // Glass/Overlay Colors
    glass: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.08)',
      strong: 'rgba(255, 255, 255, 0.12)',
      border: 'rgba(255, 255, 255, 0.10)',
      borderHover: 'rgba(255, 255, 255, 0.20)',
    },
  },

  // ============================================
  // GRADIENTS - NEXT GEN STYLING
  // ============================================
  gradients: {
    // Primary gradients - Purple/Cyan v8.0
    primary: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
    primaryHover: 'linear-gradient(135deg, #C084FC 0%, #9333EA 100%)',
    primaryLight: 'linear-gradient(135deg, #D8B4FE 0%, #C084FC 100%)',
    
    // Accent gradients - Purple to Cyan blending
    accent: 'linear-gradient(135deg, #A855F7 0%, #06B6D4 100%)',
    accentReverse: 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)',
    cyan: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    cyanLight: 'linear-gradient(135deg, #67E8F9 0%, #22D3EE 100%)',
    
    // Text gradients - Enhanced readability
    textPrimary: 'linear-gradient(90deg, #A855F7, #C084FC)',
    textHero: 'linear-gradient(90deg, #C084FC, #06B6D4)',
    textCyan: 'linear-gradient(90deg, #06B6D4, #67E8F9)',
    
    // Modern mesh gradients
    meshPurple: 'linear-gradient(135deg, #A855F7 0%, #D8B4FE 50%, #C084FC 100%)',
    meshCyan: 'linear-gradient(135deg, #06B6D4 0%, #67E8F9 50%, #22D3EE 100%)',
    meshBlend: 'linear-gradient(135deg, #A855F7 0%, #06B6D4 50%, #C084FC 100%)',
    
    // Radial gradients for highlights
    radialGlow: 'radial-gradient(600px at 55% 0%, rgba(168, 85, 247, 0.15), transparent)',
    radialAccent: 'radial-gradient(600px at 100% 100%, rgba(6, 182, 212, 0.15), transparent)',
    
    // Background gradients
    heroGlow: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.15), transparent 70%)',
    pageBackground: 'linear-gradient(180deg, rgba(168, 85, 247, 0.03) 0%, transparent 50%, rgba(6, 182, 212, 0.02) 100%)',
    
    // Glass gradients
    glassCard: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))',
    glassStrong: 'linear-gradient(135deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.04))',
  },

  // ============================================
  // TYPOGRAPHY SCALE
  // ============================================
  typography: {
    // Display - Hero headlines
    display: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      fontFamily: "'Poppins', system-ui, sans-serif",
    },
    
    // Title - Section headers
    title: {
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      fontFamily: "'Poppins', system-ui, sans-serif",
    },
    
    // Heading - Card titles
    heading: {
      fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0',
      fontFamily: "'Poppins', system-ui, sans-serif",
    },
    
    // Body - Main content
    body: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0',
      fontFamily: "'Roboto', system-ui, sans-serif",
    },
    
    // Caption - Small text
    caption: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
      fontFamily: "'Roboto', system-ui, sans-serif",
    },
  },

  // ============================================
  // SPACING SCALE (8px base)
  // ============================================
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
  },

  // ============================================
  // BORDER RADIUS
  // ============================================
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',      // Primary radius - professional rounded
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },

  // ============================================
  // SHADOWS
  // ============================================
  shadows: {
    none: 'none',
    sm: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    md: '0px 4px 20px rgba(0, 0, 0, 0.2)', // Primary shadow
    lg: '0px 8px 32px rgba(0, 0, 0, 0.25)',
    xl: '0px 16px 48px rgba(0, 0, 0, 0.3)',
    
    // Glow effects
    glowBlue: '0 0 20px rgba(30, 136, 229, 0.3), 0 0 40px rgba(30, 136, 229, 0.15)',
    glowGold: '0 0 20px rgba(249, 168, 38, 0.3), 0 0 40px rgba(249, 168, 38, 0.15)',
    glowPrimary: '0 0 25px rgba(30, 136, 229, 0.4), 0 0 50px rgba(249, 168, 38, 0.2)',
    
    // Glass shadows
    glass: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  },

  // ============================================
  // TRANSITIONS
  // ============================================
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // ============================================
  // BREAKPOINTS
  // ============================================
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Helper: Convert hex to space-separated RGB for CSS rgba()
export function hexToRgbSpaced(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0 0';
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}

// Inject CSS variables at runtime
export function injectThemeTokens(): void {
  const style = document.createElement('style');
  style.id = 'perth-saver-tokens';
  style.textContent = `
    :root {
      /* Primary Colors v8.0 - Purple/Cyan Theme */
      --purple-500: ${hexToRgbSpaced(tokens.colors.primary.purple[500])};
      --purple-400: ${hexToRgbSpaced(tokens.colors.primary.purple[400])};
      --purple-300: ${hexToRgbSpaced(tokens.colors.primary.purple[300])};
      --purple-600: ${hexToRgbSpaced(tokens.colors.primary.purple[600])};
      
      --cyan-500: ${hexToRgbSpaced(tokens.colors.primary.cyan[500])};
      --cyan-400: ${hexToRgbSpaced(tokens.colors.primary.cyan[400])};
      --cyan-300: ${hexToRgbSpaced(tokens.colors.primary.cyan[300])};
      --cyan-600: ${hexToRgbSpaced(tokens.colors.primary.cyan[600])};
      
      /* Legacy aliases for backward compatibility */
      --blue-500: ${hexToRgbSpaced(tokens.colors.primary.purple[500])};
      --blue-400: ${hexToRgbSpaced(tokens.colors.primary.purple[400])};
      --blue-300: ${hexToRgbSpaced(tokens.colors.primary.purple[300])};
      --blue-600: ${hexToRgbSpaced(tokens.colors.primary.purple[600])};
      
      --gold-500: ${hexToRgbSpaced(tokens.colors.primary.cyan[500])};
      --gold-400: ${hexToRgbSpaced(tokens.colors.primary.cyan[400])};
      --gold-300: ${hexToRgbSpaced(tokens.colors.primary.cyan[300])};
      --gold-600: ${hexToRgbSpaced(tokens.colors.primary.cyan[600])};
      
      --emerald-500: ${hexToRgbSpaced(tokens.colors.semantic.success)};
      --emerald-400: ${hexToRgbSpaced('#66BB6A')};
      --emerald-300: ${hexToRgbSpaced('#81C784')};
      --emerald-600: ${hexToRgbSpaced('#43A047')};
      
      --cyan-bright: ${hexToRgbSpaced(tokens.colors.primary.cyan[500])};
      --cyan-light: ${hexToRgbSpaced(tokens.colors.primary.cyan[400])};
      --cyan-neon: ${hexToRgbSpaced(tokens.colors.primary.cyan[300])};
      --cyan-deep: ${hexToRgbSpaced(tokens.colors.primary.cyan[600])};
      
      --emerald-bright: ${hexToRgbSpaced(tokens.colors.semantic.success)};
      --emerald-light: ${hexToRgbSpaced('#66BB6A')};
      --emerald-neon: ${hexToRgbSpaced('#81C784')};
      --emerald-deep: ${hexToRgbSpaced('#43A047')};
      
      /* Neutral Colors */
      --white: 255 255 255;
      --black: 0 0 0;
      --charcoal: ${hexToRgbSpaced(tokens.colors.neutral.slate[950])};
      --obsidian: ${hexToRgbSpaced(tokens.colors.neutral.trueDark)};
      --surface: ${hexToRgbSpaced(tokens.colors.neutral.slate[900])};
      
      --chrome-light: ${hexToRgbSpaced(tokens.colors.neutral.slate[200])};
      --chrome-mid: ${hexToRgbSpaced(tokens.colors.neutral.silver)};
      --silver-shine: ${hexToRgbSpaced(tokens.colors.neutral.slate[50])};
      --onyx: ${hexToRgbSpaced(tokens.colors.neutral.slate[900])};
      
      /* Semantic Colors */
      --success: ${hexToRgbSpaced(tokens.colors.semantic.success)};
      --warning: ${hexToRgbSpaced(tokens.colors.semantic.warning)};
      --error: ${hexToRgbSpaced(tokens.colors.semantic.error)};
      --info: ${hexToRgbSpaced(tokens.colors.semantic.info)};
    }
  `;
  
  const existing = document.getElementById('perth-saver-tokens');
  if (existing) existing.remove();
  document.head.appendChild(style);
}

// Auto-inject on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectThemeTokens);
  } else {
    injectThemeTokens();
  }
}

// Token version for cache invalidation
export const TOKEN_VERSION = '8.0.0';

// Token timestamp for theme health check
export const TOKEN_TIMESTAMP = Date.now();

// Backward compatibility alias
export const injectTokensToDOM = injectThemeTokens;

export default tokens;
