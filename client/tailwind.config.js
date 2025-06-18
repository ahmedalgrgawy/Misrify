import daisyui from "daisyui"
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        "bg-main": "#EBEBEF",
        "bg-second": "#EFF2F6",
        "light-grey": "#DDDEE5",
        "second-grey": "#C3C3C3",
        "dark-grey": "#6E7786",
        "main-blue": "#2B3D5B",
        "title-blue": "#15253F",
        "dark-blue": "#081120",
        "bg-footer": "#0B172A",
      },
      fontFamily: {
        jaro: ["Jaro", "sans-serif"],
        josefin: ["Josefin Sans", "sans-serif"],
        work: ["Work Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        "custom-md":
          "0px 3px 6px rgba(0, 0, 0, 0.15), 0px 3px 6px rgba(0, 0, 0, 0.23)",
      },
      screens: {
        sm: { max: "767px" },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [],
  },
};