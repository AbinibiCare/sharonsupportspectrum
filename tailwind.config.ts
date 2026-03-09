import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1e3a8a',
          green: '#0d9488',
          purple: '#7c3aed'
        }
      }
    }
  },
  plugins: []
}
export default config
