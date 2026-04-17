/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vem: {
         vem: {
  50:  '#EBF2FA',
  100: '#C8DDEF',
  200: '#91BBE0',
  400: '#3D84C8',
  600: '#1B65B2',
  800: '#144D87',
  900: '#0D3560',
},
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'pulse2': 'pulse2 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
