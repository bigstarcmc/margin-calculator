/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // src 폴더 기준
    "./pages/**/*.{js,ts,jsx,tsx}", // 필요 시 pages 폴더도 포함
    "./*.html" // 루트 html 포함
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
