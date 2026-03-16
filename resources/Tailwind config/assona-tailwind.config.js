/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY (TEAL) - Professional Brand Color
        primary: {
          50: '#F0F9FA',
          100: '#D9F1F4',
          200: '#B3E3E9',
          300: '#80CFD9',
          400: '#4DB5C4',
          500: '#2896AA',
          600: '#144F56', // Brand primary
          700: '#0F3A3F',
          800: '#0A282B',
          900: '#061A1C',
          950: '#030F10',
          DEFAULT: '#144F56',
        },
        
        // ACCENT (LIME) - Brand Highlight Color
        accent: {
          50: '#FBFDF0',
          100: '#F8FCDB',
          200: '#F1F9B8',
          300: '#EAF68F',
          400: '#E4EC84', // Brand accent
          500: '#D8E554',
          600: '#C5D62F',
          700: '#A0AE1F',
          800: '#757F17',
          900: '#4F5510',
          950: '#2D300A',
          DEFAULT: '#E4EC84',
          brand: '#E4EC84',
        },
        
        // NEUTRAL (GREEN-GRAY) - Interface Foundation
        neutral: {
          0: '#FFFFFF',
          50: '#FAFBFA',
          100: '#F4F6F4',
          200: '#E8EBE8',
          300: '#D4D9D4',
          400: '#B8BFB8',
          500: '#9BA29B',
          600: '#7A827A',
          700: '#5C635C',
          800: '#3F443F',
          900: '#282B28',
          950: '#181A18',
          1000: '#0D0F0D',
          DEFAULT: '#5C635C',
        },
        
        // ERROR (CORAL-RED) - Friendly Error States
        error: {
          50: '#FEF5F3',
          100: '#FEEAE5',
          200: '#FDD4CA',
          300: '#FCB5A0',
          400: '#F99577',
          500: '#EE735D', // Brand error
          600: '#E64E2E',
          700: '#C73715',
          800: '#962A11',
          900: '#651C0B',
          950: '#3A1006',
          DEFAULT: '#EE735D',
          brand: '#EE735D',
        },
        
        // SUCCESS (GREEN) - Positive Feedback
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#0A2918',
          DEFAULT: '#22C55E',
        },
        
        // WARNING (ORANGE) - Caution States
        warning: {
          50: '#FFF8F0',
          100: '#FFF0DB',
          200: '#FFDEB8',
          300: '#FFC67D',
          400: '#FFAC42',
          500: '#FF9110',
          600: '#E67700',
          700: '#B35D00',
          800: '#804300',
          900: '#4D2900',
          950: '#261400',
          DEFAULT: '#FF9110',
        },
        
        // PASTEL PETROL (COOL) - Subtle Cool Surfaces
        petrol: {
          50: '#F7FBFB',
          100: '#EDF5F5',
          200: '#DBEAEA',
          300: '#C3DDDD', // Brand pastel
          400: '#A8CDCD',
          500: '#8DBDBD',
          600: '#6FA5A5',
          700: '#538484',
          800: '#3E6464',
          900: '#2A4444',
          950: '#182929',
          DEFAULT: '#C3DDDD',
          brand: '#C3DDDD',
        },
        
        // PASTEL RED/BLUSH (WARM) - Subtle Warm Surfaces
        blush: {
          50: '#FCFBFB',
          100: '#F9F5F5',
          200: '#EFE8E8', // Brand pastel
          300: '#E5D8D8',
          400: '#D9C5C5',
          500: '#CCB2B2',
          600: '#B89797',
          700: '#9E7676',
          800: '#7D5757',
          900: '#5C3D3D',
          950: '#3B2424',
          DEFAULT: '#EFE8E8',
          brand: '#EFE8E8',
        },
        
        // PASTEL YELLOW/SAGE (EARTHY) - Natural Surfaces
        sage: {
          50: '#FAFBF7',
          100: '#F5F7ED',
          200: '#EAEED9',
          300: '#D1DCBA', // Brand pastel
          400: '#BCC99E',
          500: '#A7B682',
          600: '#8D9C66',
          700: '#6F7C4D',
          800: '#535C39',
          900: '#383D26',
          950: '#20241A',
          DEFAULT: '#D1DCBA',
          brand: '#D1DCBA',
        },
      },
      
      // SPACING TOKENS (8px base unit)
      spacing: {
        0: '0px',
        1: '0.25rem',  // 4px
        2: '0.5rem',   // 8px
        3: '0.75rem',  // 12px
        4: '1rem',     // 16px
        6: '1.5rem',   // 24px
        8: '2rem',     // 32px
        9: '2.25rem',  // 36px
        10: '2.5rem',  // 40px
        12: '3rem',    // 48px
        14: '3.5rem',  // 56px
        16: '4rem',    // 64px
        20: '5rem',    // 80px
        24: '6rem',    // 96px
        28: '7rem',    // 112px
        32: '8rem',    // 128px
        40: '10rem',   // 160px
        48: '12rem',   // 192px
        56: '14rem',   // 224px
        64: '16rem',   // 256px
        80: '20rem',   // 320px
        96: '24rem',   // 384px
      },
      
      // BORDER RADIUS TOKENS
      borderRadius: {
        none: '0px',
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '14px',
        xl: '20px',
        '2xl': '24px',
        circle: '50px',
        full: '9999px',
      },
      
      // TYPOGRAPHY TOKENS
      fontFamily: {
        heading: ['Uni-Neue', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['SF Mono', 'monospace'],
      },
      
      fontSize: {
        xs: ['12px', { lineHeight: '16px', letterSpacing: '-0.31px' }],
        sm: ['14px', { lineHeight: '20px', letterSpacing: '-0.31px' }],
        md: ['16px', { lineHeight: '20px', letterSpacing: '-0.31px' }],
        lg: ['18px', { lineHeight: '24px', letterSpacing: '-0.31px' }],
        xl: ['24px', { lineHeight: '24px', letterSpacing: '-0.6%' }],
        '2xl': ['32px', { lineHeight: '24px', letterSpacing: '-0.6%' }],
        '3xl': ['40px', { lineHeight: '40px', letterSpacing: '-0.6%' }],
      },
      
      fontWeight: {
        light: '200',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      
      letterSpacing: {
        tight: '-0.64px',
        normal: '-0.6%',
        wide: '-0.31px',
      },
      
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
      },
      
      // SHADOW TOKENS
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
        card: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        dropdown: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        modal: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
