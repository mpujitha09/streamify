/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0d0d0f",
        surface: "#17171b",
        primary: "#1db954",
        muted: "#9a9aa2",
      },
    },
  },
  plugins: [],
};
