// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    // Define your colors as CSS variables
    colors: ({ theme }) => ({
      // Your custom colors
      dark: '#1E1E1E',
      darkGray: '#333333',
      mediumGray: '#555555',
      green: '#4CAF50',
      white: '#FFFFFF',
      red: '#F44336',
      
      // Optional: Map to CSS variables for better theming
      primary: "rgb(var(--color-primary) / <alpha-value>)",
      danger: "rgb(var(--color-danger) / <alpha-value>)"
    }),
    extend: {},
  },
  plugins: [],
}