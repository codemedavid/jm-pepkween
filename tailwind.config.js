/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Minimalist Modern Theme (The Peppy Lab - Logo Matched)
        'theme-bg': '#F9E4D4',      // Soft Peach (Logo Background)
        'theme-text': '#9A4444',    // Muted Maroon (Logo Text)
        'theme-accent': '#9A4444',  // Primary Brand Color
        'theme-secondary': '#E0C0A8', // Darker Peach for variation

        // Mapping standard colors to the new theme for compatibility
        primary: {
          50: '#F9E4D4',
          100: '#FDF1E6',
          200: '#E0C0A8',
          300: '#C0A080',
          400: '#9A4444',
          500: '#9A4444', // Brand Color
          600: '#7A3434',
          700: '#5A2424',
          800: '#3A1414',
          900: '#1A0404',
        },
        // Deprecating gold but mapping to secondary/accent to prevent breaks (Admin Panel Compass)
        gold: {
          50: '#F9E4D4',
          100: '#FDF1E6',
          200: '#E0C0A8',
          300: '#D0B098',
          400: '#B06060',
          500: '#9A4444', // Brand Color
          600: '#7A3434',
          700: '#5A2424',
          800: '#3A1414',
          900: '#1A0404',
        },
        accent: {
          light: '#9BCEC7',
          DEFAULT: '#6DA8A1',
          dark: '#588D87',
          white: '#ffffff',
          black: '#1E1E1E',
        },
      },
      fontFamily: {
        inter: ['"Times New Roman"', 'Times', 'serif'],
        sans: ['"Times New Roman"', 'Times', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'medium': '0 4px 15px rgba(0, 0, 0, 0.05)',
        'hover': '0 8px 25px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideIn': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
