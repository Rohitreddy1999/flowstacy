/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        abyss: '#07090D',
        fathom: '#0F141A',
        surge: '#3DF5A6',
        glacial: '#82D4FF',
        plasma: '#FF4FD8',
        'arc-light': '#EAFFF5',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'sans-serif'],
      },
      fontSize: {
        'display': ['96px', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'heading': ['26px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'body': ['13.5px', { lineHeight: '1.55' }],
        'caption': ['12px', { lineHeight: '1.4' }],
        'label': ['10px', { lineHeight: '1', letterSpacing: '0.1em' }],
      },
      borderRadius: {
        'card': '20px',
        'pill': '28px',
      },
      borderWidth: {
        'surface': '1px',
      },
    },
  },
  plugins: [],
}

