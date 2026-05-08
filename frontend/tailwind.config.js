/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      boxShadow: {
        panel: "0 24px 80px rgba(2, 6, 23, 0.48)",
        glass: "0 20px 70px rgba(15, 23, 42, 0.38)"
      },
      colors: {
        brand: {
          50: "#effef7",
          100: "#d9fce9",
          200: "#b8f7d7",
          300: "#88edbc",
          400: "#52d99d",
          500: "#22c97a",
          600: "#16a965",
          700: "#158553",
          800: "#156944",
          900: "#13563a"
        }
      },
      backgroundImage: {
        "brand-grid":
          "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
