/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pink Glam Theme - Clean, classy, girly but modern
        'theme-bg': 'var(--theme-bg)',
        'theme-text': 'var(--theme-text)',
        'theme-accent': 'var(--theme-accent)',
        'theme-secondary': 'var(--theme-secondary)',

        // Mapping standard colors to the new theme for compatibility
        primary: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: '#FF75B2', // No var defined
          500: 'var(--theme-accent)',
          600: '#E6478F', // No var defined
          700: '#CC3F7A', // No var defined
          800: '#B33766', // No var defined
          900: 'var(--gray-900)',
        },
        // Pink palette (backward compatibility)
        pink: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: '#FF75B2',
          500: 'var(--theme-accent)',
          600: '#E6478F',
          700: '#CC3F7A',
          800: '#B33766',
          900: 'var(--gray-900)',
        },
        accent: {
          light: 'var(--theme-secondary)',
          DEFAULT: 'var(--theme-accent)',
          dark: 'var(--gray-500)',
          white: 'var(--primary-white)',
          black: 'var(--primary-black)',
        },
        // Legacy gold mapping (for backward compatibility)
        gold: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: '#FF75B2',
          500: 'var(--theme-accent)',
          600: '#E6478F',
          700: '#CC3F7A',
          800: '#B33766',
          900: 'var(--gray-900)',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        serif: ['Georgia', 'serif'],
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
