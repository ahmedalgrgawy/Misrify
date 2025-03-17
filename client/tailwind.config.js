import daisyui from "daisyui"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'white': '#FFFFFF',
        'bg-main': '#EBEBEF',
        'light-grey': '#DDDEE5',
        'second-grey': '#C3C3C3',
        'dark-grey': '#6E7786',
        'main-blue': '#2B3D5B',
        'title-blue': '#15253F',
        'dark-blue': '#081120',
      },
      screens: {
        sm: { max: "767px" },
      },
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [],
  },
}