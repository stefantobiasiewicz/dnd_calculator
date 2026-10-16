/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18201f',
        muted: '#66716d',
        line: '#d8dfdc',
        panel: '#ffffff',
        soft: '#f3f6f4',
        field: '#f8faf9',
        brand: {
          DEFAULT: '#246b4f',
          dark: '#154431',
          light: '#edf5ef',
        },
        amber: { DEFAULT: '#b57923', soft: '#fff8ec', ink: '#6b4a16' },
        info: '#386b8f',
        danger: '#9b4439',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      boxShadow: {
        panel: '0 18px 50px rgba(24, 32, 31, 0.1)',
      },
      borderRadius: {
        card: '4px',
      },
    },
  },
  plugins: [],
};
