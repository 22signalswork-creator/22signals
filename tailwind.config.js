/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              color: "#ffffff", // 
              fontWeight: "300", // font-thin
              fontSize: "68px", // 
              lineHeight: "1.1", // leading-none
              
            },
            h2: {
              fontWeight: "300",
              fontSize: "48px",
              lineHeight: "1.2",
              background:
                "linear-gradient(91.16deg, #325FEC 1.74%, #FFFFFF 43.71%, #FFFFFF 61.62%, #325FEC 102.48%)",
              "-webkit-background-clip": "text",
              "-webkit-text-fill-color": "transparent",
            },
            h3: {
              color: "#ffffff",
              fontWeight: "400",
              fontSize: "36px",
              lineHeight: "1.3",
            },
            p: {
              color: "#9ca3af",
              fontSize: "1rem",
              lineHeight: "1.5",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
