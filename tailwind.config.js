/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0f1b2d',
        panel: '#f8fafc',
        bluebrand: '#1e64ff',
        purplebrand: '#9216e8',
        muted: '#65738a'
      },
      boxShadow: {
        soft: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.06)',
        card: '0 2px 10px rgba(15, 23, 42, 0.05)'
      },
      borderRadius: {
        xl2: '18px'
      }
    }
  },
  plugins: []
}
