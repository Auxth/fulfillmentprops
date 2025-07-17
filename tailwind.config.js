/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        accent: "#22c55e",
        glow: "#eab308",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 8px #22c55e",
      },
    },
  },
  plugins: [],
};
