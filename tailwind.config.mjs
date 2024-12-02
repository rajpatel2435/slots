/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "0 50px 25px -24px rgb(0 0 0 / 0.3)",
        homePosts: "0 4px 7px #0000001a",
        casinoNews: "0px 2px 18px 0px rgb(0 0 0 / 30%)",
        casinoBlock: "rgba(0, 0, 0, 0.3) 0px 2px 18px 0px",
        gameReview: "0px 10px 20px #00000064",
      },

      fontFamily: {
        giloryLight: ["Gilroy-Light"],
        giloryMedium: ["Gilroy-Medium"],
        giloryRegular: ["Gilroy-Regular"],
        giloryBold: ["Gilroy-Bold"],
        giloryExtrabold: ["Gilroy-ExtraBold"],
      },

      backgroundSize: {
        "100%": "100%",
      },
      // Add your custom utility classes here
      backgroundImage: {
        "gradient-to-r": "linear-gradient(171deg, #ea94a8 0%, #8f4779 100%)",
      },
      backgroundColor: {
        "custom-pink": "#ea94a8",
      },
    },
  },
  plugins: [],
};
